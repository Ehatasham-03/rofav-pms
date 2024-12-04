// DutyRoasterResponsibilities.js


module.exports = {
    tableName: 'DutyRoasterResponsibilities',
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
        dutyRoaster: {
            model: 'dutyroaster'
        }
    }
}