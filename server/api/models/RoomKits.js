// api/models/RoomKits.js

module.exports = {
    tableName: 'room_kits',
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
        propertyId: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string',
        },

        kitItems: {
            collection: 'RoomKitItems',
            via: 'roomKit'
        }
    }
};