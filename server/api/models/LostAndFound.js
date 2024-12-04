// api/models/LostAndFound.js

module.exports = {
    tableName: 'lostAndFound',
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
        itemStatus: {
            type: 'string',
            isIn: ['not found', 'found', 'found damaged'],
            defaultsTo: 'no found'
        },

        caseStatus: {
            type: 'string',
            isIn: ['item retained', 'item disposed', 'resolved', 'unresolved'],
            defaultsTo: 'unresolved'
        },

        caseOpenedBy: {
            type: 'string',
            isIn: ['guest', 'hotel']
        },

        caseClosedBy: {
            type: 'string',
            isIn: ['guest', 'hotel']
        },

        itemType: {
            type: 'string',
            required: true
        },
        itemName: {
            type: 'string',
            required: true
        },

        itemDescription: {
            type: 'string',

        },
        description: {
            type: 'string',
            required: true
        },

        itemFoundDateAndTime: {
            type: 'string',
        },

        caseOpenedDate: {
            type: 'string',
        },

        caseClosedDate: {
            type: 'string',
        },


        bookingId: {
            type: 'string',
        },

    }
}