// api/models/RoomKitItems.js

module.exports = {
    tableName: 'room_kit_items',
    primaryKey: 'uniqueId',

    attributes: {
        id: {
            type: 'number',
            autoIncrement: true,
            columnName: 'id' 
        },
        uniqueId: {
            type: 'string',
            required: true,
            unique: true
        },

        inHouseInventoryUniqueId: {
            model: 'MMInHouseInventory',
        },

        productUniqueId: {
            model: 'MarketManagement',
        },
        productName: {
            type: 'string',
            required: true
        },

        roomKit: {
            model: 'RoomKits',
        },
    }
};