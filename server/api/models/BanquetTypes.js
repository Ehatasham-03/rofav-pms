// api/models/BanquetTypes.js

module.exports = {
    tableName: 'banquetTypes',
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
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },

    }
}