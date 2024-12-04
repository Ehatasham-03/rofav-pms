//api/models/BanquetBookings.js
module.exports = {
    tableName: 'banquetBookings',
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
        bookerName: {
            type: 'string',
            required: true
        },
        bookerPhoneNumber: {
            type: 'string',
            required: true
        },
        selectedHall: {
            model: 'BanquetManageHalls',
            required: true

        },
        selectedFoodPlan: {
            model: 'BanquetManageFoodPlans',
            required: true
        },
        pax: {
            type: 'number',
            required: true
        },
        taxes: {
            model: 'TaxesList'
        },
        addOns: {
            type: 'string',
        },
        addOnsCost: {
            type: 'number',
        },
        discounts: {
            type: 'boolean',
            defaultsTo: false
        },
        discountAmount: {
            type: 'number',
        },
        discountType: {
            type: 'string',
        },
        totalCost: {
            type: 'number',
        },
        bookingDateAndTime: {
            type: 'string',
            required: true
        },
        bookingEndDateAndTime: {
            type: 'string',
            required: true
        },
        bookingStatus: {
            type: 'string',
            isIn: ['pending', 'active', 'cancelled', 'completed'],
            defaultsTo: 'pending'
        }
    }
}




