// KsrTables.js

module.exports = {
    tableName: 'KsrTables',
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
        restaurantUniqueId: {
            model: 'KsrRestaurants',
            required: true
        },
        tableNumber: {
            type: 'string',
            required: true
        },
        seatCounts: {
            type: 'number',
            required: true
        },
        status: {
            type: 'string',
            isIn: ['occupied', 'available', 'reserved'],
            defaultsTo: 'available'
        },
        createdAt: {
            type: 'number',
            autoCreatedAt: true
        },
        updatedAt: {
            type: 'number',
            autoUpdatedAt: true
        }
    }
}