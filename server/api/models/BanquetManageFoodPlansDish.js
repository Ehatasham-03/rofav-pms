// src/mdoels/BanquetManageFoodPlansDish.js

module.exports = {
    tableName: 'banquetManageFoodPlansDish',
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
        banquetManageFoodPlans: {
            model: 'BanquetManageFoodPlans'
        },
        dishName: {
            type: 'string',
            required: true
        },
        dishPrice: {
            type: 'number',
            required: true
        },
        dishDescription: {
            type: 'string',
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
        createdAt: {
            type: 'number',
            autoUpdatedAt: true
        },
        updatedAt: {
            type: 'number',
            autoUpdatedAt: true
        }
    }
}
