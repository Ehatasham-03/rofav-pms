// api/controllers/RoomKits/RoomKitsController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async function (req, res) {
        try {
            const { name, products, propertyId } = req.body;

            if (!name || !products || !Array.isArray(products) || !propertyId) {
                return res.status(400).json({ success: false, message: 'Invalid input. Name, products array, and propertyId are required.' });
            }

            // Create a new RoomKit
            const newRoomKitUniqueId = uuidv4();
            const newRoomKit = await RoomKits.create({
                uniqueId: newRoomKitUniqueId,
                name,
                propertyId
            }).fetch();

            // Process each product
            const kitItems = [];
            for (const product of products) {
                const { inHouseInventoryUniqueId } = product;

                // Check if the product exists in the InHouseInventory
                const inventoryItem = await MMInHouseInventory.findOne({
                    uniqueId: inHouseInventoryUniqueId,
                    propertyId
                });

                if (!inventoryItem) {
                    return res.status(404).json({ success: false, message: `Product with InHouseInventory ID ${inHouseInventoryUniqueId} not found for this property.` });
                }

                // Create a new RoomKitItem
                const newKitItem = await RoomKitItems.create({
                    uniqueId: uuidv4(),
                    inHouseInventoryUniqueId: inventoryItem.uniqueId,
                    productUniqueId: inventoryItem.productId,
                    productName: inventoryItem.productName,
                    roomKit: newRoomKitUniqueId
                }).fetch();

                kitItems.push(newKitItem);
            }

            // Fetch the created RoomKit with its items
            const createdRoomKit = await RoomKits.findOne({ uniqueId: newRoomKitUniqueId }).populate('kitItems');

            return res.status(201).json({ success: true, message: 'Room kit created successfully.', data: createdRoomKit });
        } catch (error) {
            console.error('Error in RoomKits create:', error);
            return res.status(500).json({ success: false, message: 'An error occurred while creating the room kit.', error: error.message });
        }
    },

    // Get all RoomKits
    find: async function (req, res) {
        try {

            const { uniqueId, propertyId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ success: false, message: 'propertyId is required.' });
            }
            let query = {};

            if (uniqueId) {
                query.uniqueId = uniqueId;
            }

            if (propertyId) {
                query.propertyId = propertyId;
            }

            const roomKits = await RoomKits.find(uniqueId).populate('kitItems');
            return res.json({ success: true, data: roomKits });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'An error occurred while fetching room kits.', error: error.message });
        }
    },


    // Update a RoomKit
    update: async function (req, res) {
        try {
            const { uniqueId } = req.query;
            const { name, description } = req.body;

            if (!uniqueId) {
                return res.status(400).json({ success: false, message: 'uniqueId is required.' });
            }

            // Find and update the RoomKit in one operation
            const updatedRoomKit = await RoomKits.updateOne({ uniqueId })
                .set({
                    name: name || undefined,
                    description: description || undefined
                });

            if (!updatedRoomKit) {
                return res.status(404).json({ success: false, message: 'Room kit not found.' });
            }

            // Fetch the updated RoomKit with its associated items
            const roomKitWithItems = await RoomKits.findOne({ uniqueId });

            return res.json({
                success: true,
                message: 'Room kit updated successfully.',
                data: roomKitWithItems
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred while updating the room kit.',
                error: error.message
            });
        }
    },

    // Delete a RoomKit
    delete: async function (req, res) {
        try {
            const { uniqueId } = req.query;
            if (!uniqueId) {
                return res.status(400).json({ success: false, message: 'uniqueId is required.' });
            }

            const roomKit = await RoomKits.findOne({ uniqueId });
            if (!roomKit) {
                return res.status(404).json({ success: false, message: 'Room kit not found.' });
            }

            // Delete associated RoomKitItems
            await RoomKitItems.destroy({ roomKit: uniqueId });

            // Delete the RoomKit
            await RoomKits.destroyOne({ uniqueId });

            return res.json({ success: true, message: 'Room kit and associated items deleted successfully.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the room kit.', error: error.message });
        }
    },

    // Add an item to a RoomKit
    addItem: async function (req, res) {
        try {
            const { uniqueId } = req.query;
            const { inHouseInventoryUniqueId, propertyId } = req.body;

            if (!uniqueId || !inHouseInventoryUniqueId || !propertyId) {
                return res.status(400).json({ success: false, message: 'uniqueId, inHouseInventoryUniqueId and propertyId are required.' });
            }

            const roomKit = await RoomKits.findOne({ uniqueId });
            if (!roomKit) {
                return res.status(404).json({ success: false, message: 'Room kit not found.' });
            }

            const inventoryItem = await MMInHouseInventory.findOne({
                uniqueId: inHouseInventoryUniqueId,
                propertyId
            });

            if (!inventoryItem) {
                return res.status(404).json({ success: false, message: 'Product not found in inventory.' });
            }

            const newItem = await RoomKitItems.create({
                uniqueId: uuidv4(),
                inHouseInventoryUniqueId: inventoryItem.uniqueId,
                productUniqueId: inventoryItem.productId,
                productName: inventoryItem.productName,
                roomKit: uniqueId
            }).fetch();

            return res.json({ success: true, message: 'Item added to room kit successfully.', data: newItem });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'An error occurred while adding the item to the room kit.', error: error.message });
        }
    },

    // Remove an item from a RoomKit
    removeItem: async function (req, res) {
        try {
            const { uniqueId, itemUniqueId } = req.query;

            if (!uniqueId || !itemUniqueId) {
                return res.status(400).json({ success: false, message: 'uniqueId and itemUniqueId are required.' });
            }

            const roomKit = await RoomKits.findOne({ uniqueId });
            if (!roomKit) {
                return res.status(404).json({ success: false, message: 'Room kit not found.' });
            }

            const deletedItem = await RoomKitItems.destroyOne({ uniqueId: itemUniqueId, roomKit: uniqueId });
            if (!deletedItem) {
                return res.status(404).json({ success: false, message: 'Item not found in the room kit.' });
            }

            return res.json({ success: true, message: 'Item removed from room kit successfully.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'An error occurred while removing the item from the room kit.', error: error.message });
        }
    }

};