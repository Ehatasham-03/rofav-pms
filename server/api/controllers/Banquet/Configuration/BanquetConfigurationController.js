// api/controller/BanquetConfigurationController.js

const { v4: uuidv4 } = require("uuid");

module.exports = {
  createSuitable: async function (req, res) {
    try {
      const { propertyId, name, description } = req.body;
      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "Name and Description are required" });
      }

      const uniqueId = uuidv4();

      const suitable = await BanquetSuitable.create({
        uniqueId,
        propertyId,
        name,
        description,
      }).fetch();

      return res.status(201).json(suitable);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  fetchSuitable: async function (req, res) {
    try {
      const { propertyId } = req.query;
      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      const suitable = await BanquetSuitable.find({
        propertyId,
        isDeleted: false,
      });

      if (suitable.length === 0) {
        return res.status(200).json({ error: "No suitable found" });
      }

      return res.status(200).json(suitable);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteSuitable: async function (req, res) {
    try {
      const { uniqueId } = req.query;
      if (!uniqueId) {
        return res.status(400).json({ error: "Unique ID is required" });
      }

      const updatedSuitable = await BanquetSuitable.updateOne({ uniqueId }).set(
        { isDeleted: true }
      );

      if (!updatedSuitable) {
        return res.status(404).json({ error: "Suitable not found" });
      }

      return res
        .status(200)
        .json({ message: "Suitable marked as deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  createFacilities: async function (req, res) {
    try {
      const { propertyId, name, description } = req.body;

      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "Name and Description are required" });
      }

      const uniqueId = uuidv4();
      const facilities = await BanquetFacilities.create({
        uniqueId,
        propertyId,
        name,
        description,
      }).fetch();

      return res.status(201).json(facilities);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  fetchFacilities: async function (req, res) {
    try {
      const { propertyId } = req.query;
      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      const facilities = await BanquetFacilities.find({
        propertyId,
        isDeleted: false,
      });

      if (facilities.length === 0) {
        return res.status(200).json({ error: "No facilities found" });
      }

      return res.status(200).json(facilities);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteFacilities: async function (req, res) {
    try {
      const { uniqueId } = req.query;

      if (!uniqueId) {
        return res.status(400).json({ error: "Unique ID is required" });
      }

      const updatedFacilities = await BanquetFacilities.updateOne({
        uniqueId,
      }).set({ isDeleted: true });

      if (!updatedFacilities) {
        return res.status(404).json({ error: "Facilities not found" });
      }

      return res
        .status(200)
        .json({ message: "Facilities marked as deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  createTypes: async function (req, res) {
    try {
      const { propertyId, name, description } = req.body;

      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      if (!name || !description) {
        return res
          .status(400)
          .json({ error: "Name and Description are required" });
      }

      const uniqueId = uuidv4();
      const types = await BanquetTypes.create({
        uniqueId,
        propertyId,
        name,
        description,
      }).fetch();

      return res.status(201).json(types);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  fetchTypes: async function (req, res) {
    try {
      const { propertyId } = req.query;
      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      const types = await BanquetTypes.find({ propertyId, isDeleted: false });

      if (types.length === 0) {
        return res.status(200).json({ error: "No types found" });
      }

      return res.status(200).json(types);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteTypes: async function (req, res) {
    try {
      const { uniqueId } = req.query;
      if (!uniqueId) {
        return res.status(400).json({ error: "Unique ID is required" });
      }

      const updatedTypes = await BanquetTypes.updateOne({ uniqueId }).set({
        isDeleted: true,
      });

      if (!updatedTypes) {
        return res.status(404).json({ error: "Types not found" });
      }

      return res
        .status(200)
        .json({ message: "Types marked as deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
