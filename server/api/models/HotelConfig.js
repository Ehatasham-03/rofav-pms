// api/models/HotelConfig/HotelConfig.js

module.exports = {
    tableName: 'HotelConfig',
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
            unique: true,
        },

        propertyId: {
            type: 'string',
            required: true
        },
        
        companyName: {
            type: 'string',
            required: true
        },

        companyPanNumber: {
            type: 'string',
        },

        corporateOfficeAddress: {
            type: 'string',
        },

        branches:{
            type: 'string',
        },

        logoLink:{
            type: 'string'
        },

        tinNumber: {
            type: 'string', 
        },

        fssaiNumber: {
            type: 'string'
        },

        gstinNumber:{ 
            type: 'string'
        },
        description:{ 
            type: 'string'
        },
        status: {
            type: 'boolean',
            defaultsTo: true
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