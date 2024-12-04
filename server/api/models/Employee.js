// api/models/Employee.js

module.exports = {
    tableName: 'Employee',
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

        phoneNumber: {
            type: 'string',
            required: true
        },

        address: {
            type: 'string',
            required: true
        },

        designation: {
            model: 'EmployeeDesignations'
        },

        dateOfJoining: {
            type: 'string',
            required: true
        },

        department: {
            type: 'string',
            required: true
        },
        gender: {
            type: 'string',
            isIn: ['male', 'female', 'other', 'null'],
            defaultsTo: 'null'
        },

        nokName: {
            type: 'string',

        },

        nokPhone: {
            type: 'string',

        },

        nokAddress: {
            type: 'string',

        },

        nokRelationship: {
            type: 'string',
        },

        avatar: {
            type: 'string',
        },

        documentType: {
            type: 'string',
            isIn: ['passport', 'driving_license', 'adhar_card', 'other', 'null'],
            defaultsTo: 'null'
        },

        panCard: {
            type: 'string',
        },

        status: {
            type: 'string',
            isIn: ['active', 'inactive'],
            defaultsTo: 'active'
        },
        dutyRoaster: {
            model: 'dutyroaster'
        }

    }

}