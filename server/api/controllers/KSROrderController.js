// api/controllers/KsrOrderController.js

const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const ExcelJS = require("exceljs");

module.exports = {
  create: async function (req, res) {
    try {
      const {
        propertyId,
        restaurantId,
        totalPrice,
        products,
        typeOfSale,
        tableNumber,
        roomNumber,
        guests,
        deliveryPartner,
        discountAmount,
        discountType,
        taxesListUniqueid,
        stewardId,
      } = req.body;

      if (!propertyId || !products || !totalPrice) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid products array" });
      }

      let restaurant;
      if (restaurantId) {
        restaurant = await KsrRestaurants.findOne({ uniqueId: restaurantId });
        if (!restaurant) {
          return res
            .status(404)
            .json({ success: false, message: "Restaurant not found" });
        }
      }

      if (tableNumber) {
        const table = await KsrTables.findOne({ tableNumber: tableNumber });
        if (!table) {
          return res
            .status(404)
            .json({ success: false, message: "Table not found" });
        }

        if (restaurant && table.restaurantUniqueId !== restaurantId) {
          return res.status(400).json({
            success: false,
            message: "Table does not belong to the specified restaurant",
          });
        }

        if (table.status !== "available") {
          return res
            .status(400)
            .json({ success: false, message: "Table is not available" });
        }
      }
      if (!taxesListUniqueid) {
        return res
          .status(400)
          .json({ success: false, message: "Tax information ID is required" });
      }

      const taxInfo = await TaxesList.findOne({ uniqueId: taxesListUniqueid });
      if (!taxInfo) {
        return res
          .status(404)
          .json({ success: false, message: "Tax information not found" });
      }

      let discounts;
      let subTotal = totalPrice;

      // Always send discount ammount (For example 20, 30, 10 etc)
      // It doens't matter if you gave the discount as percentage or flat
      if (discountAmount) {
        discounts = true;
        subTotal = subTotal - discountAmount;
      } else {
        discounts = false;
      }

      let taxAmount = 0;

      if (taxInfo.CGST) taxAmount += subTotal * (taxInfo.CGST / 100);
      if (taxInfo.IGST) taxAmount += subTotal * (taxInfo.IGST / 100);
      if (taxInfo.SGST) taxAmount += subTotal * (taxInfo.SGST / 100);
      if (taxInfo.CESS) taxAmount += subTotal * (taxInfo.CESS / 100);

      const newTotalPrice = subTotal + taxAmount;

      // Generate an 8-digit numerical order ID
      const generateOrderId = () => {
        const currentDate = new Date();
        const dateString =
          currentDate.getFullYear().toString().slice(-2) +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          currentDate.getDate().toString().padStart(2, "0");

        const randomDigits = Math.floor(Math.random() * 100000)
          .toString()
          .padStart(5, "0");

        return (dateString + randomDigits).slice(0, 8);
      };

      const orderId = generateOrderId();

      const order = await KsrOrders.create({
        orderId: orderId,
        propertyId: propertyId,
        restaurantId: restaurant ? restaurantId : null,
        subTotal: subTotal,
        totalPrice: newTotalPrice,
        taxesList: taxesListUniqueid,
        tableNumber: tableNumber,
        roomNumber: roomNumber,
        guests: guests,
        typeOfSale: typeOfSale,
        deliveryPartner: deliveryPartner,
        discounts,
        discountAmount,
        discountType,
        stewardId: stewardId,
      }).fetch();

      for (const product of products) {
        const { productId, quantity, price } = product;

        if (!productId || !quantity || !price) {
          throw new Error("Missing required fields for a product");
        }

        if (
          typeof productId !== "string" ||
          typeof quantity !== "number" ||
          typeof price !== "number"
        ) {
          throw new Error("Invalid data types for a product");
        }

        const inventoryItem = await KsrDishInventory.findOne({
          uniqueId: productId,
        });

        if (!inventoryItem) {
          throw new Error(
            `Product with productId ${productId} not found in inventory`
          );
        }

        if (inventoryItem.quantity < quantity) {
          throw new Error(
            `Insufficient quantity for product with productId ${productId}`
          );
        }

        await KsrDishInventory.updateOne({ uniqueId: productId }).set({
          quantity: inventoryItem.quantity - quantity,
        });

        //Later change UUID to 8 Digit Numerical Number
        const orderProductUniqueId = uuidv4();

        await KsrOrderProducts.create({
          uniqueId: orderProductUniqueId,
          orderId: order.orderId,
          productName: inventoryItem.productName,
          productId: productId,
          quantity: quantity,
          price: price,
        });
      }
      // Update the table status to 'occupied'
      //  if (tableNumber) {
      //    await KsrTables.updateOne({ tableNumber: tableNumber }).set({ status: 'occupied' });
      //  }

      const updatedOrder = await KsrOrders.findOne({ orderId: order.orderId })
        .populate("products")
        .populate("taxesList");

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: updatedOrder,
        taxDetails: {
          subTotal: subTotal,
          taxAmount: taxAmount,
          totalPrice: newTotalPrice,
        },
      });
    } catch (error) {
      console.error(error);

      if (
        error.message.startsWith("Missing required fields") ||
        error.message.startsWith("Invalid data types")
      ) {
        return res.status(400).json({ success: false, message: error.message });
      }

      if (
        error.message.startsWith("Product with productId") ||
        error.message.startsWith("Insufficient quantity")
      ) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  },

  find: async function (req, res) {
    try {
      const { orderId, propertyId } = req.query;

      let query = {};

      if (orderId) {
        query.orderId = orderId;
      }

      if (propertyId) {
        query.propertyId = propertyId;
      }

      // Find orders based on the query
      const orders = await KsrOrders.find(query)
        .populate("products")
        .populate("taxesList")
        .populate("restaurantId")
        .populate("stewardId");

      if (orders.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Orders not found" });
      }

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve orders",
        error: error.message,
      });
    }
  },

  //NOT IN ROUTES YET

  delete: async function (req, res) {
    try {
      const { orderId } = req.query;

      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "Order ID is required" });
      }

      const order = await KsrOrders.findOne({ orderId: orderId });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      await KsrOrderProducts.destroy({ orderId: orderId });

      await KsrOrders.destroyOne({ orderId: orderId });

      return res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete order",
        error: error.message,
      });
    }
  },

  ksrOrderReceipt: async function (req, res) {
    try {
      const { orderId, propertyId } = req.query;

      if (!propertyId) {
        return res
          .status(400)
          .json({ success: false, message: "propertyId is required." });
      }

      if (!orderId) {
        return res
          .status(400)
          .json({ success: false, message: "orderId is required." });
      }

      const order = await KsrOrders.findOne({ orderId: orderId })
        .populate("products")
        .populate("taxesList")
        .populate("restaurantId")
        .populate("stewardId");

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      let subtotal = 0;
      const productsWithTotal = order.products.map((product) => {
        const total = product.quantity * product.price;
        subtotal += total;
        return {
          ...product,
          total: total.toFixed(2),
        };
      });

      let discountAmount = order.discountAmount || 0;
      let discountedSubtotal = subtotal - discountAmount;

      let totalTax = 0;
      if (order.taxesList) {
        const { CGST, IGST, SGST, CESS } = order.taxesList;
        totalTax += discountedSubtotal * (CGST / 100);
        totalTax += discountedSubtotal * (IGST / 100);
        totalTax += discountedSubtotal * (SGST / 100);
        totalTax += discountedSubtotal * (CESS / 100);
      }

      let totalPrice = discountedSubtotal + totalTax;

      const templateData = {
        ...order,
        products: productsWithTotal,
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        totalTax: totalTax.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      };

      Handlebars.registerHelper("multiply", function (a, b) {
        return (a * b).toFixed(2);
      });

      const templatePath = path.resolve(
        __dirname,
        "../../assets/templates/order_receipt_template.html"
      );
      const templateHtml = fs.readFileSync(templatePath, "utf8");

      const template = Handlebars.compile(templateHtml);
      const htmlContent = template(templateData);

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: "A4" });

      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=order_receipt.pdf"
      );
      res.end(pdfBuffer, "binary");
    } catch (error) {
      console.error("Error generating PDF:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  KsrOrdersDownloadExcel: async function (req, res) {
    try {
      const { propertyId, orderId, includeProducts, all } = req.query;

      if (!propertyId) {
        return res
          .status(400)
          .json({ success: false, message: "propertyId is required." });
      }

      let query = {};
      if (orderId) query.orderId = orderId;
      if (propertyId) query.propertyId = propertyId;

      let orders = await KsrOrders.find(query)
        .populate("products")
        .populate("taxesList")
        .populate("restaurantId")
        .populate("stewardId");

      if (orders.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Orders not found" });
      }

      const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
        return (
          date.toISOString().split("T")[0] +
          " " +
          date.toTimeString().split(" ")[0]
        );
      };

      const getDateOnly = (timestamp) => {
        const dateOnly = new Date(parseInt(timestamp));
        if (isNaN(dateOnly.getTime())) {
          return "Invalid Date";
        }
        return dateOnly.toISOString().split("T")[0];
      };

      const getTimeOnly = (timeStamp) => {
        const timeOnly = new Date(parseInt(timeStamp));
        if (isNaN(timeOnly.getTime())) {
          return "Invalid Time";
        }
        return timeOnly.toTimeString().split(" ")[0];
      };

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      worksheet.columns = [
        { header: "Outlet Name", key: "resturantName", width: 20 },
        { header: "Date", key: "orderDate", width: 15 },
        { header: "Order ID", key: "orderId", width: 15 },
        { header: "Time", key: "orderTime", width: 15 },
        { header: "Type of Sale", key: "typeOfSale", width: 15 },
        { header: "Table Number", key: "tableNumber", width: 15 },
        { header: "Room Number", key: "roomNumber", width: 15 },
        { header: "Guests", key: "guests", width: 15 },
        { header: "Delivery Partner", key: "deliveryPartner", width: 20 },
        { header: "Gross Aammount", key: "subTotal", width: 15 },
        { header: "Discounts", key: "discounts", width: 15 },
        { header: "Discount Type", key: "discountType", width: 15 },
        { header: "Discount Amount", key: "discountAmount", width: 15 },
        { header: "CGST", key: "CGST", width: 10 },
        { header: "SGST", key: "SGST", width: 10 },
        { header: "IGST", key: "IGST", width: 10 },

        { header: "CESS", key: "CESS", width: 10 },
        /* { header: 'Tax Name', key: 'taxName', width: 20 }, */
        { header: "Net Ammout", key: "totalPrice", width: 15 },
      ];

      if (all) {
        worksheet.columns.push(
          { header: "ID", key: "id", width: 15 },
          { header: "Created At", key: "createdAt", width: 25 },
          { header: "Updated At", key: "updatedAt", width: 25 },
          { header: "Property ID", key: "propertyId", width: 20 },
          { header: "Restaurant ID", key: "restaurantId", width: 20 },
          { header: "Tax List ID", key: "taxListId", width: 20 },
          {
            header: "Tax List Property ID",
            key: "taxListPropertyId",
            width: 25,
          }
        );
      }

      if (includeProducts || all) {
        worksheet.columns.push({
          header: "Products",
          key: "products",
          width: 50,
        });
      }

      // Add data
      orders.forEach((order) => {
        let taxData = {
          CGST: "",
          IGST: "",
          SGST: "",
          CESS: "",
          taxName: "",
        };

        if (order.taxesList && typeof order.taxesList === "object") {
          taxData = {
            CGST: order.taxesList.CGST || "",
            IGST: order.taxesList.IGST || "",
            SGST: order.taxesList.SGST || "",
            CESS: order.taxesList.CESS || "",
            taxName: order.taxesList.name || "",
          };
        }

        let orderData = {
          resturantName: order.restaurantId.restaurantName,
          orderDate: getDateOnly(order.createdAt),
          orderId: order.orderId,
          orderTime: getTimeOnly(order.createdAt),
          typeOfSale: order.typeOfSale,
          tableNumber: order.tableNumber,
          roomNumber: order.roomNumber,
          guests: order.guests,
          deliveryPartner: order.deliveryPartner,
          discounts: order.discounts,
          discountType: order.discountType,
          discountAmount: order.discountAmount,
          subTotal: order.subTotal,
          totalPrice: order.totalPrice,
          stewardName: order.stewardId ? order.stewardId.name : "Self",
          ...taxData,
        };

        if (all) {
          orderData = {
            ...orderData,
            id: order.id,
            createdAt: formatDate(order.createdAt),
            updatedAt: formatDate(order.updatedAt),
            propertyId: order.propertyId,
            restaurantId: order.restaurantId,
            taxListId: order.taxesList.uniqueId || "",
            taxListPropertyId: order.taxesList.propertyId || "",
          };
        }

        if (includeProducts || all) {
          orderData.products = JSON.stringify(
            order.products.map((product) => ({
              productName: product.productName,
              quantity: product.quantity,
              price: product.price,
              ...(all && {
                id: product.id,
                uniqueId: product.uniqueId,
                createdAt: formatDate(product.createdAt),
                updatedAt: formatDate(product.updatedAt),
                productId: product.productId,
              }),
            }))
          );
        }
        //worksheet.getColumn(3).numFmt = '@';
        //worksheet.getColumn(6).numFmt = '@';
        worksheet.addRow(orderData);
      });

      const filename = `orders_${Date.now()}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate Excel",
        error: error.message,
      });
    }
  },
};
