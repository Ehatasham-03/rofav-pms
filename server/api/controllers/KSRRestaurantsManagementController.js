// api/controllers/KSRRestaurantsManagementController.js

const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: async (req, res) => {
        try {
            const { propertyId, restaurantName, restaurantType, tables } = req.body;

            if (!propertyId) {
                return res.status(400).json({ error: 'Property ID is required' });
            }
            if (!restaurantName) {
                return res.status(400).json({ error: 'Restaurant Name is required' });
            }
            if (!restaurantType) {
                return res.status(400).json({ error: 'Restaurant Type is required' });
            }

            const restaurantUniqueId = uuidv4();
            const restaurant = await KsrRestaurants.create({
                uniqueId: restaurantUniqueId,
                propertyId,
                restaurantName,
                restaurantType
            }).fetch();

            const tableRecords = [];
            for (const table of tables) {
                const { tableNumber, seatCounts } = table;

                if (!tableNumber) {
                    return res.status(400).json({ error: 'Table Number is required' });
                }
                if (!seatCounts) {
                    return res.status(400).json({ error: 'Seat Count is required' });
                }

                const tableUniqueId = uuidv4();
                const tableRecord = await KsrTables.create({
                    uniqueId: tableUniqueId,
                    restaurantUniqueId: restaurantUniqueId,
                    tableNumber,
                    seatCounts
                }).fetch();

                tableRecords.push(tableRecord);
            }

            restaurant.tables = tableRecords;

            return res.status(201).json({ restaurant });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while creating the restaurant and tables' });
        }
    },

    fetch: async (req, res) => {
        try {
            const { propertyId, includeTables, uniqueId } = req.query;

            if (!propertyId) {
                return res.status(400).json({ error: 'Property ID is required' });
            }

            let restaurants;

            if (uniqueId) {
                restaurants = await KsrRestaurants.find({ propertyId, uniqueId });
            } else {
                restaurants = await KsrRestaurants.find({ propertyId });
            }

            if (includeTables === 'true') {
                for (const restaurant of restaurants) {
                    const tables = await KsrTables.find({ restaurantUniqueId: restaurant.uniqueId });
                    restaurant.tables = tables;
                }
            }

            return res.status(200).json({ restaurants });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while fetching restaurants' });
        }
    },

    delete: async (req, res) => {
        try {
            const { uniqueId } = req.query;

            if (!uniqueId) {
                return res.status(400).json({ error: 'Restaurant uniqueId is required' });
            }

            const restaurant = await KsrRestaurants.findOne({ uniqueId });

            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            await KsrTables.destroy({ restaurantUniqueId: uniqueId });

            await KsrRestaurants.destroyOne({ uniqueId });

            return res.status(200).json({ message: 'Restaurant and its associated tables deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while deleting the restaurant' });
        }
    }
};