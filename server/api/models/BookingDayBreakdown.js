/**
 * BookingDayBreakdown.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    amount: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    promotion: {
      type: 'json',
    },
    rate_code: {
      type: 'number',
    },
    rate_plan: {
      type: 'string',
    },
    bookingChannexId: {
      type: 'string',
      required: true,
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    bookingRoomId: {
      type: 'string',
      required: true,
    },
  },
};
