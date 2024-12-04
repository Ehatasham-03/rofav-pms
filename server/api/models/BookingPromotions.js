/**
 * BookingPromotions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    from_code: {
      type: 'string',
    },
    from_name: {
      type: 'string',
    },
    promotion_id: {
      type: 'string',
    },
    to_code: {
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
