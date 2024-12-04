// api/models/KsrDishInventory.js
module.exports = {
    tableName: 'KsrDishInventory',
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
        dishMainCategory: {
            model: 'DishMainCategory',
        },

        dishMainCategoryName: {
            type: 'string',
            required: true
        },

        productName: {
            type: 'string',
            required: true
        },
        quantity: {
            type: 'number',
            required: true
        },

        price: {
            type: 'number',
            required: true
        },

        status: {
            type: 'string',
            isIn: ['true', 'false'],
            defaultsTo: 'true'
        },

    }


}