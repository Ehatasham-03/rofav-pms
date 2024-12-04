// api/models/DutyRoaster.js


module.exports = {
    primaryKey: 'uniqueId',
    tableName: 'DutyRoaster',
    
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
            required: true,
        },

        date: {
            type: 'ref',
            required: true,
        },

        shift: {
            model: 'dutyroastershifts',
     
        },

        additionalResponsibilities: {
            type: 'string'
        },

        responsibilities: {
            collection: 'dutyroasterresponsibilities',
            via: 'dutyRoaster'
        },
        employees: {
            collection: 'employee',
            via: 'dutyRoaster'
        },

        status: {
            type: 'boolean',
            defaultsTo: true,
        }
    },


};