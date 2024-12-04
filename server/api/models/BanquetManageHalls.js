//api/models/BanquetManageHalls.js

module.exports = {
    tableName: 'banquetManageHalls',
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
        hallName: {
            type: 'string',
            required: true
        },
        seatingCapacity: {
            type: 'number',
            required: true
        },

        typeOfBanquet: {
            model: 'banquetTypes'
        },

        facilitiesProvided: {
            collection: 'BanquetFacilities',
            via: 'banquetHall',
            through: 'BanquetHallFacility'
        },
        suitableFor: {
            collection: 'BanquetSuitable',
            via: 'banquetHall',
            through: 'BanquetHallSuitable'
        },

        rentPerDay: {
            type: 'number',
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
        }
    }
}