// api/controllers/KSRDishInventoryController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {

    create: async (req, res) => {
        try {
            const { propertyId, productName, dishMainCategoryUniqueId, quantity, price } = req.body;

            if (!propertyId) {
                return res.status(400).json({ error: 'Property Id is required' });
            }

            if (!productName || !dishMainCategoryUniqueId || !quantity || !price) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const dishMainCategoryExists = await DishMainCategory.findOne({ uniqueId: dishMainCategoryUniqueId });

            if (!dishMainCategoryExists) {
                return res.status(400).json({ error: 'Main Category not found' });
            }

            // Check if a dish inventory entry with the same productName and dishMainCategoryUniqueId already exists for the current property
            const existingEntry = await KsrDishInventory.findOne({
                productName,
                dishMainCategory: dishMainCategoryUniqueId,
                propertyId
            });

            if (existingEntry) {
                // If an entry already exists for the current property, update the quantity and price
                const updatedEntry = await KsrDishInventory.updateOne({ uniqueId: existingEntry.uniqueId })
                    .set({
                        quantity: existingEntry.quantity + quantity,
                        price
                    })
                    .fetch();

                return res.status(200).json({
                    message: 'Dish inventory entry updated successfully',
                    data: updatedEntry
                });
            } else {
                // If no entry exists for the current property, create a new dish inventory entry
                const uniqueId = uuidv4();
                const dishInventory = await KsrDishInventory.create({
                    propertyId,
                    uniqueId,
                    productName,
                    dishMainCategory: dishMainCategoryUniqueId,
                    dishMainCategoryName: dishMainCategoryExists.name,
                    quantity,
                    price
                }).fetch();

                return res.status(201).json({
                    message: 'Dish inventory entry created successfully',
                    data: dishInventory
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    get: async (req, res) => {
        try {
            const { propertyId, mainCategoryUniqueId, uniqueId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Property Id is required' });
            }

            const query = { propertyId };

            if (mainCategoryUniqueId) {
                query.mainCategoryUniqueId = mainCategoryUniqueId;
            }

            if (uniqueId) {
                query.uniqueId = uniqueId;
            }

            const dishInventories = await KsrDishInventory.find(query);

            return res.status(200).json(dishInventories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    delete: async (req, res) => {
        try {
            const { uniqueId } = req.query;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Unique Id is required' });
            }

            const deletedDish = await KsrDishInventory.destroyOne({ uniqueId });

            if (!deletedDish) {
                return res.status(404).json({ error: 'Dish not found' });
            }

            return res.status(200).json({ message: 'Dish deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    update: async (req, res) => {
        try {
            const { uniqueId } = req.query;
            const { status, quantity } = req.body;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Unique Id is required' });
            }

            if (status === undefined && quantity === undefined) {
                return res.status(400).json({ error: 'At least one field (status or quantity) is required for update' });
            }

            const updateData = {};

            if (status !== undefined) {
                updateData.status = status;
            }

            if (quantity !== undefined) {
                updateData.quantity = quantity;
            }

            //check if status is valid
            if (updateData.status && !['true', 'false'].includes(updateData.status)) {
                return res.status(400).json({ error: 'Invalid status value. Must be true or false' });
            }

            const updatedDish = await KsrDishInventory.updateOne({ uniqueId }).set(updateData);

            if (!updatedDish) {
                return res.status(404).json({ error: 'Dish not found' });
            }

            return res.status(200).json({ message: 'Dish updated successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};