// DutyRoasterShifts.js
module.exports = {

    tableName: 'dutyRoasterShifts',
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

       name:{
           type: 'string',
           required: true
       },

       startTime: {
           type: 'string',
           required: true
       },

       endTime: {
           type: 'string',
           required: true
       }
    }
}
