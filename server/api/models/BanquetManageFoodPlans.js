// api/models/BanquetManageFoodPlans.js

module.exports = {
    tableName: 'banquetManageFoodPlans',
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
        planeName: {
            type: 'string',
            required: true
        },
        planPrice: {
            type: 'number',
        },
        planeDescription: {
            type: 'string',
        },
        dishes: {
            collection: 'BanquetManageFoodPlansDish',
            via: 'banquetManageFoodPlans'
        },
        status: {
            type: 'string',
            isIn: ['true', 'false'],
            defaultsTo: 'true'
        },
        isDeleted: {
            type: 'string',
            isIn: ['true', 'false'],
            defaultsTo: 'false'
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