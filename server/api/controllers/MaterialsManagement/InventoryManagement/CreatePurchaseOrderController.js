// api/controllers/MMPurchaseOrderController.js
const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async function (req, res) {
        try {
            const { propertyId, items } = req.body;
            if (!propertyId) {
                return res.status(400).json({ error: 'Property ID is required' });
            }
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'Items array is required and must not be empty' });
            }
            const responses = [];
            for (const item of items) {
                const { productId, quantity, unit, noOfProducts, vendorId, incomingDate, price } = item;
                if (!productId || !quantity || !unit || !noOfProducts || !vendorId || !incomingDate || !price) {
                    responses.push({
                        status: 400,
                        message: 'Product ID, quantity, unit, number of products, vendor ID, incoming date, and price are required for each item'
                    });
                    continue;
                }
                const product = await MarketManagement.findOne({ uniqueId: productId });
                if (!product) {
                    responses.push({
                        status: 404,
                        message: `Product with ID ${productId} not found`
                    });
                    continue;
                }
                const mainCategory = await MainCategory.findOne({ uniqueId: product.mainCategory });
                if (!mainCategory) {
                    responses.push({
                        status: 404,
                        message: `Main category not found for product with ID ${productId}`
                    });
                    continue;
                }
                const subCategory = await SubCategory.findOne({ uniqueId: product.subCategory });
                if (!subCategory) {
                    responses.push({
                        status: 404,
                        message: `Sub category not found for product with ID ${productId}`
                    });
                    continue;
                }
                const vendor = await VendorsManagement.findOne({ uniqueId: vendorId });
                if (!vendor) {
                    responses.push({
                        status: 404,
                        message: `Vendor with ID ${vendorId} not found`
                    });
                    continue;
                }
                const uniqueId = uuidv4();
                const purchaseOrder = await MMPurchaseOrder.create({
                    uniqueId,
                    propertyId,
                    productId,
                    mainCategoryId: product.mainCategory,
                    mainCategoryName: mainCategory.name,
                    subCategoryId: product.subCategory,
                    subCategoryName: subCategory.name,
                    productName: product.productName,
                    quantity,
                    unit,
                    noOfProducts,
                    vendorId,
                    vendorName: vendor.vendorName,
                    incomingDate,
                    price,
                    status: vendor.selfVending === 'true' ? 'InHouse' : 'Ordered',
                    isReceived: vendor.selfVending === 'true' ? true : false

                }).fetch();

                if (vendor.selfVending === 'true') {
                    // Check if an inventory entry with the same productId and vendorId already exists for the current property
                    const existingEntry = await MMInHouseInventory.findOne({
                        productId: purchaseOrder.productId,
                        vendorId: purchaseOrder.vendorId,
                        propertyId: purchaseOrder.propertyId
                    });

                    if (existingEntry) {
                        // If an entry already exists for the current property, update the quantity, noOfProducts, and other fields
                        await MMInHouseInventory.updateOne({ uniqueId: existingEntry.uniqueId })
                            .set({
                                quantity: existingEntry.quantity + purchaseOrder.quantity,
                                noOfProducts: existingEntry.noOfProducts + purchaseOrder.noOfProducts,
                                incomingDate: purchaseOrder.incomingDate,
                                expiryDate: purchaseOrder.expiryDate,
                                price: purchaseOrder.price
                            });
                    } else {
                        // If no entry exists for the current property, create a new inventory entry
                        await MMInHouseInventory.create({
                            uniqueId: uuidv4(),
                            propertyId: purchaseOrder.propertyId,
                            productId: purchaseOrder.productId,
                            mainCategoryId: purchaseOrder.mainCategoryId,
                            mainCategoryName: purchaseOrder.mainCategoryName,
                            subCategoryId: purchaseOrder.subCategoryId,
                            subCategoryName: purchaseOrder.subCategoryName,
                            productName: purchaseOrder.productName,
                            quantity: purchaseOrder.quantity,
                            unit: purchaseOrder.unit,
                            noOfProducts: purchaseOrder.noOfProducts,
                            vendorId: purchaseOrder.vendorId,
                            vendorName: purchaseOrder.vendorName,
                            incomingDate: purchaseOrder.incomingDate,
                            expiryDate: purchaseOrder.expiryDate,
                            price: purchaseOrder.price,
                            status: 'Normal'
                        });
                    }
                }

                responses.push({
                    status: 201,
                    message: 'Purchase order created successfully',
                    data: purchaseOrder
                });
            }
            return res.json(responses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    find: async function (req, res) {
        try {
            const { propertyId, vendorId, expiryDate, incomingDate, productId, includeAll, history } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Property ID is required' });
            }

            const query = { propertyId };

            if (vendorId) {
                query.vendorId = vendorId;
            }

            if (expiryDate) {
                query.expiryDate = expiryDate;
            }

            if (incomingDate) {
                query.incomingDate = incomingDate;
            }

            if (productId) {
                query.productId = productId;
            }

            if (includeAll === 'true') {
                const purchaseOrders = await MMPurchaseOrder.find(query).populate('damagedItems');

                const populatedPurchaseOrders = await Promise.all(
                    purchaseOrders.map(async (purchaseOrder) => {
                        if (purchaseOrder.damagedItems && purchaseOrder.damagedItems.uniqueId) {
                            const damagedItem = await MMDamagedItems.findOne({
                                uniqueId: purchaseOrder.damagedItems.uniqueId,
                            });
                            purchaseOrder.damagedItems = damagedItem || {};
                        } else {
                            purchaseOrder.damagedItems = {};
                        }
                        return purchaseOrder;
                    })
                );

                return res.json(populatedPurchaseOrders);
            } else {
                if (history === 'true') {
                    query.status = 'InHouse';
                } else {
                    query.status = 'Ordered';
                }

                const purchaseOrders = await MMPurchaseOrder.find(query);
                return res.json(purchaseOrders);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    update: async function (req, res) {
        try {
            const { uniqueId } = req.query;
            const updateData = req.body;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Purchase order uniqueId is required' });
            }

            const existingOrder = await MMPurchaseOrder.findOne({ uniqueId });

            if (!existingOrder) {
                return res.status(404).json({ error: `Purchase order with uniqueId ${uniqueId} not found` });
            }

            if (existingOrder.status === 'InHouse' && existingOrder.isReceived) {
                return res.status(400).json({ error: 'Cannot update the purchase order when status is "InHouse" and isReceived is true' });
            }

            const updatedFields = {};

            if (updateData.productId) {
                updatedFields.productId = updateData.productId;
                const product = await MarketManagement.findOne({ uniqueId: updateData.productId });
                if (product) {
                    updatedFields.productName = product.productName;
                    updatedFields.mainCategoryId = product.mainCategory;
                    updatedFields.subCategoryId = product.subCategory;

                    const mainCategory = await MainCategory.findOne({ uniqueId: product.mainCategory });
                    if (mainCategory) {
                        updatedFields.mainCategoryName = mainCategory.name;
                    }

                    const subCategory = await SubCategory.findOne({ uniqueId: product.subCategory });
                    if (subCategory) {
                        updatedFields.subCategoryName = subCategory.name;
                    }
                }
            }

            if (updateData.quantity !== undefined) {
                updatedFields.quantity = updateData.quantity;
            }

            if (updateData.unit) {
                updatedFields.unit = updateData.unit;
            }

            if (updateData.noOfProducts !== undefined) {
                updatedFields.noOfProducts = updateData.noOfProducts;
            }

            if (updateData.vendorId) {
                updatedFields.vendorId = updateData.vendorId;
                const vendor = await VendorsManagement.findOne({ uniqueId: updateData.vendorId });
                if (vendor) {
                    updatedFields.vendorName = vendor.vendorName;
                }
            }

            if (updateData.incomingDate) {
                updatedFields.incomingDate = updateData.incomingDate;
            }

            if (updateData.expiryDate) {
                updatedFields.expiryDate = updateData.expiryDate;
            }

            if (updateData.price !== undefined) {
                updatedFields.price = updateData.price;
            }

            if (updateData.status) {
                updatedFields.status = updateData.status;
            }

            let damagedItems = null;


            if (updateData.status === 'InHouse') {
                const {
                    damagedQuantity,
                    damagedNoOfProducts,
                    description,
                    expiryDate,
                    isDamaged,
                    isReceived,
                    receivedQuantity,
                    receivedNoOfProducts
                } = updateData;

                updatedFields.isReceived = isReceived;

                let quantityToAdd = existingOrder.quantity;
                let noOfProductsToAdd = existingOrder.noOfProducts;


                if (isDamaged) {
                    if (damagedQuantity > existingOrder.quantity) {
                        return res.status(400).json({ error: 'Damaged quantity cannot exceed the total quantity' });
                    }

                    if (damagedNoOfProducts > existingOrder.noOfProducts) {
                        return res.status(400).json({ error: 'Damaged number of products cannot exceed the total number of products' });
                    }

                    if (damagedQuantity) {
                        quantityToAdd -= damagedQuantity;
                    }

                    if (damagedNoOfProducts) {
                        noOfProductsToAdd -= damagedNoOfProducts;
                    }

                    // Copy damaged items to MMDamagedItems
                    damagedItems = await MMDamagedItems.create({
                        uniqueId: uuidv4(),
                        propertyId: existingOrder.propertyId,
                        purchaseOrderId: existingOrder.uniqueId,
                        productId: existingOrder.productId,
                        productName: existingOrder.productName,
                        mainCategoryId: existingOrder.mainCategoryId,
                        mainCategoryName: existingOrder.mainCategoryName,
                        subCategoryId: existingOrder.subCategoryId,
                        subCategoryName: existingOrder.subCategoryName,
                        damageFrom: 'Purchased',
                        damageQuantity: damagedQuantity || null,
                        damageNoOfProducts: damagedNoOfProducts || null,
                        damageDescription: description,
                        vendorUniqueId: existingOrder.vendorId,
                        vendorName: existingOrder.vendorName
                    }).fetch();

                    // Add the uniqueId of MMDamagedItems to MMPurchaseOrder
                    updatedFields.damagedItems = damagedItems.uniqueId;
                }

                if (receivedQuantity !== undefined && receivedQuantity < existingOrder.quantity) {
                    quantityToAdd = receivedQuantity;
                }

                if (receivedNoOfProducts !== undefined && receivedNoOfProducts < existingOrder.noOfProducts) {
                    noOfProductsToAdd = receivedNoOfProducts;
                }

                // Check if an inventory entry with the same productId and vendorId already exists for the current property
                const existingEntry = await MMInHouseInventory.findOne({
                    productId: existingOrder.productId,
                    vendorId: existingOrder.vendorId,
                    propertyId: existingOrder.propertyId
                });

                if (existingEntry) {
                    // If an entry already exists for the current property, update the quantity, noOfProducts, and other fields
                    const updatedInHouseItem = await MMInHouseInventory.updateOne({ uniqueId: existingEntry.uniqueId })
                        .set({
                            quantity: existingEntry.quantity + quantityToAdd,
                            noOfProducts: existingEntry.noOfProducts + noOfProductsToAdd,
                            incomingDate: existingOrder.incomingDate,
                            expiryDate,
                            price: existingOrder.price
                        })
                        .fetch();
                } else {
                    // If no entry exists for the current property, create a new inventory entry
                    const inHouseInventory = await MMInHouseInventory.create({
                        uniqueId: uuidv4(),
                        propertyId: existingOrder.propertyId,
                        productId: existingOrder.productId,
                        mainCategoryId: existingOrder.mainCategoryId,
                        mainCategoryName: existingOrder.mainCategoryName,
                        subCategoryId: existingOrder.subCategoryId,
                        subCategoryName: existingOrder.subCategoryName,
                        productName: existingOrder.productName,
                        quantity: quantityToAdd,
                        unit: existingOrder.unit,
                        noOfProducts: noOfProductsToAdd,
                        vendorId: existingOrder.vendorId,
                        vendorName: existingOrder.vendorName,
                        incomingDate: existingOrder.incomingDate,
                        expiryDate,
                        price: existingOrder.price,
                        status: 'Normal'
                    }).fetch();
                }
            }

            const updatedOrder = await MMPurchaseOrder.updateOne({ uniqueId })
                .set(updatedFields)
                .fetch();

            const response = {
                message: 'Purchase order updated successfully',
                data: updatedOrder
            };

            if (damagedItems) {
                response.data.damagedItems = damagedItems;
            }

            return res.json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    delete: async function (req, res) {
        try {
            const { uniqueId } = req.query;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Purchase order uniqueId is required' });
            }

            const purchaseOrder = await MMPurchaseOrder.findOne({ uniqueId: uniqueId }).populate('damagedItems');

            if (!purchaseOrder) {
                return res.status(404).json({ error: `Purchase order with uniqueId ${uniqueId} not found` });
            }

            if (purchaseOrder.damagedItems && purchaseOrder.damagedItems.uniqueId) {
                await MMDamagedItems.destroyOne({ uniqueId: purchaseOrder.damagedItems.uniqueId });
            }

            await MMPurchaseOrder.destroyOne({ uniqueId: uniqueId });

            return res.json({ message: 'Purchase order and associated damaged items deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};