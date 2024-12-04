// api/models/TaxesList.js

module.exports = {
    tableName: 'taxesList',
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
        CGST: {
            type: 'number',
        },
        IGST: {
            type: 'number',
        },
        SGST: {
            type: 'number',
        },
        CESS: {
            type: 'number',
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
        }
    }
}