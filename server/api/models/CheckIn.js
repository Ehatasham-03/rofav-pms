/**
 * CheckIn.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    checkInDate: {
      type: 'number',
      required: true,
    },
    roomType: {
      type: 'string',
      required: true,
    },
    roomNo: {
      type: 'json',
      columnType: 'array',
    },
    checkOutDate: {
      type: 'number',
    },
    booking_id: {
      type: 'string',
      required: true,
    },
    kits_provided: {
      type: 'boolean',
      defaultsTo: false,
    },
    complimentary_provided: {
      type: 'boolean',
      defaultsTo: false,
    },
    no_show: {
      type: 'boolean',
      defaultsTo: false,
    },
    changedRoomType: {
      type: 'string',
    },
    is_room_changed: {
      type: 'boolean',
      defaultsTo: false,
    },
    is_complimentary_upgrade: {
      type: 'boolean',
      defaultsTo: false,
    },
    notes: {
      type: 'string',
    },
  },
  validateCheckInData: async (data) => {
    let rules = {
      checkInDate: 'required|numeric',
      roomType: 'required|string',
      roomNo: 'string',
      checkOutDate: 'numeric',
      booking_id: 'required|string',
    };

    let validation = new sails.config.constants.Validator(data, rules);
    let result = {};

    if (validation.passes()) {
      result['hasError'] = false;
    }
    if (validation.fails()) {
      result['hasError'] = true;
      result['errors'] = validation.errors.all();
    }
    return result;
  },
};
