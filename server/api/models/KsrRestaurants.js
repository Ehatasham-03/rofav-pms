// api/models/KsrRestaurants.js
module.exports = {
    tableName: 'KsrRestaurants',
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
        restaurantName: {
            type: 'string',
            required: true
        },
        restaurantType: {
            type: 'string',
            required: true
        },
        status: {
            type: 'string',
            isIn: ['true', 'false'],
            defaultsTo: 'true'
        },
        createdAt: {
            type: 'number',
            autoCreatedAt: true
        },
        updatedAt: {
            type: 'number',
            autoUpdatedAt: true
        },
        tables: {
            collection: 'KsrTables',
            via: 'restaurantUniqueId'
        }
    }
}