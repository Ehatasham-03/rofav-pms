/**
 * BookingServices.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    type: {
      type: 'string',
    },
    total_price: {
      type: 'string',
    },
    price_per_unit: {
      type: 'string',
    },
    price_mode: {
      type: 'string',
    },
    persons: {
      type: 'number',
    },
    nights: {
      type: 'number',
    },
    name: {
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
