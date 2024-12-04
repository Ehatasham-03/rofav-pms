// api/models/BanquetSuitable.js

module.exports = {
    tableName: 'banquetSuitable',
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
        banquetHalls: {
            collection: 'BanquetManageHalls',
            via: 'suitable',
            through: 'BanquetHallSuitable'
        }
    }
}