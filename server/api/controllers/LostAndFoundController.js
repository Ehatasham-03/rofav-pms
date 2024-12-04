// api/controllers/LostAndFoundController.js
const { create } = require('handlebars');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async (req, res) => {
        try {
            const {
                propertyId,
                itemStatus,
                caseStatus,
                caseOpenedBy,
                itemType,
                itemName,
                itemDescription,
                description,
                bookingId
            } = req.body;

            if (!propertyId || !itemType || !itemName || !description) {
                return res.status(400).json({ error: 'propertyId, itemType, itemName, and description are required fields' });
            }

            const uniqueId = uuidv4();
            const newLostAndFoundItem = await LostAndFound.create({
                uniqueId,
                propertyId,
                itemStatus: itemStatus || 'not found',
                caseStatus: caseStatus || 'unresolved',
                caseOpenedBy,
                itemType,
                itemName,
                itemDescription,
                description,
                caseOpenedDate: new Date().toISOString(),
                bookingId
            }).fetch();

            return res.status(201).json(newLostAndFoundItem);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    find: async (req, res) => {
        try {
            const { uniqueId, propertyId, itemStatus, caseStatus, itemType } = req.query;

            const where = {};

            if (uniqueId) where.uniqueId = uniqueId;
            if (propertyId) where.propertyId = propertyId;
            if (itemStatus) where.itemStatus = itemStatus;
            if (caseStatus) where.caseStatus = caseStatus;
            if (itemType) where.itemType = itemType;

            const lostAndFoundItems = await LostAndFound.find({ where });

            return res.status(200).json(lostAndFoundItems);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    update: async (req, res) => {
        try {
            const { uniqueId } = req.params;
            const {
                itemStatus,
                caseStatus,
                caseClosedBy,
                itemDescription,
                description,
                itemFoundDateAndTime,
                caseClosedDate
            } = req.body;

            const updateData = {};

            if (itemStatus) updateData.itemStatus = itemStatus;
            if (caseStatus) updateData.caseStatus = caseStatus;
            if (caseClosedBy) updateData.caseClosedBy = caseClosedBy;
            if (itemDescription) updateData.itemDescription = itemDescription;
            if (description) updateData.description = description;
            if (itemFoundDateAndTime) updateData.itemFoundDateAndTime = itemFoundDateAndTime;
            if (caseClosedDate) updateData.caseClosedDate = caseClosedDate;

            const updatedLostAndFoundItem = await LostAndFound.updateOne({ uniqueId }).set(updateData);

            if (!updatedLostAndFoundItem) {
                return res.status(404).json({ error: 'Lost and found item not found' });
            }

            return res.status(200).json(updatedLostAndFoundItem);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    delete: async (req, res) => {
        try {
            const { uniqueId } = req.params;

            const deletedLostAndFoundItem = await LostAndFound.destroyOne({ uniqueId });

            if (!deletedLostAndFoundItem) {
                return res.status(404).json({ error: 'Lost and found item not found' });
            }

            return res.status(200).json({ message: 'Lost and found item deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    closeLostAndFoundCase: async (req, res) => {
        try {
            const { uniqueId } = req.params;
            const { caseClosedBy, caseStatus } = req.body;

            if (!caseClosedBy || !caseStatus) {
                return res.status(400).json({ error: 'caseClosedBy and caseStatus are required fields' });
            }

            const updatedLostAndFoundItem = await LostAndFound.updateOne({ uniqueId }).set({
                caseClosedBy,
                caseStatus,
                caseClosedDate: new Date().toISOString()
            });

            if (!updatedLostAndFoundItem) {
                return res.status(404).json({ error: 'Lost and found item not found' });
            }

            return res.status(200).json(updatedLostAndFoundItem);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};