// api/controllers/TaxManagementController.js
const { v4: uuidv4 } = require("uuid");

module.exports = {
  create: async function (req, res) {
    try {
      const { propertyId, name, CGST, IGST, SGST, CESS, status } = req.body;
      if (!propertyId || !name) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Property ID and name are required",
          });
      }
      const uniqueId = uuidv4();
      const taxItem = await TaxesList.create({
        uniqueId: uniqueId,
        propertyId: propertyId,
        name: name,
        CGST: CGST,
        IGST: IGST,
        SGST: SGST,
        CESS: CESS,
        status: status,
      }).fetch();
      return res
        .status(201)
        .json({
          success: true,
          message: "Tax item created successfully",
          taxItem,
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to create tax item",
          error: error.message,
        });
    }
  },
  find: async function (req, res) {
    try {
      const { propertyId, uniqueId } = req.query;

      let query = {};

      if (propertyId) {
        query.propertyId = propertyId;
      }

      if (uniqueId) {
        query.uniqueId = uniqueId;
      }

      const taxItems = await TaxesList.find(query);

      if (taxItems.length === 0) {
        return res
          .status(200)
          .json({ success: false, message: "No tax items found" });
      }

      return res.status(200).json({ success: true, taxItems });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve tax items",
        error: error.message,
      });
    }
  },

  update: async function (req, res) {
    try {
      const { uniqueId } = req.query;
      const { name, CGST, IGST, SGST, status } = req.body;
      if (!uniqueId) {
        return res
          .status(400)
          .json({ success: false, message: "Tax item ID is required" });
      }
      const taxItem = await TaxesList.findOne({ uniqueId: uniqueId });
      if (!taxItem) {
        return res
          .status(404)
          .json({ success: false, message: "Tax item not found" });
      }
      const updatedTaxItem = await TaxesList.updateOne({
        uniqueId: uniqueId,
      }).set({
        name: name || taxItem.name,
        CGST: CGST || taxItem.CGST,
        IGST: IGST || taxItem.IGST,
        SGST: SGST || taxItem.SGST,
        status: status || taxItem.status,
      });
      return res.status(200).json({
        success: true,
        message: "Tax item updated successfully",
        taxItem: updatedTaxItem,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update tax item",
        error: error.message,
      });
    }
  },

  delete: async function (req, res) {
    try {
      const { uniqueId } = req.query;
      if (!uniqueId) {
        return res
          .status(400)
          .json({ success: false, message: "Tax item ID is required" });
      }
      const deletedTaxItem = await TaxesList.destroyOne({ uniqueId: uniqueId });
      if (!deletedTaxItem) {
        return res
          .status(404)
          .json({ success: false, message: "Tax item not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Tax item deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete tax item",
        error: error.message,
      });
    }
  },
};
