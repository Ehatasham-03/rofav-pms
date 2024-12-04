/**
 * BookingTaxes.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    is_inclusive: {
      type: 'boolean',
    },
    name: {
      type: 'string',
    },
    nights: {
      type: 'number',
    },
    persons: {
      type: 'number',
    },
    price_mode: {
      type: 'string',
    },
    price_per_unit: {
      type: 'string',
    },
    total_price: {
      type: 'string',
    },
    type: {
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
