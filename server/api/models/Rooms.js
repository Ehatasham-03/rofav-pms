/**
 * Rooms.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
    },
    propertyId: {
      type: 'string',
      required: true,
    },
    property: {
      model: 'property',
    },
    roomTypeId: {
      type: 'string',
      required: true,
    },
    roomType: {
      model: 'roomtype',
    },
    roomNo: {
      type: 'string',
    },
    floorNo: {
      type: 'string',
    },
    beds: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    purpose: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    hasPrivateBathroom: {
      type: 'boolean',
      defaultsTo: false,
    },
    bedType: {
      type: 'string',
    },
    bedSize: {
      type: 'string',
    },
    bedCount: {
      type: 'string',
    },
    status: {
      type: 'string',
      isIn: ['available', 'occupied', 'maintenance', 'cleaning'],
      defaultsTo: 'available',
    },
  },
  validateRoomData: async (data) => {
    let rules = {
      roomNo: 'required|string',
      floorNo: 'required|string',
      beds: 'string',
      size: 'string',
      purpose: 'string',
      type: 'string',
      hasPrivateBathroom: 'boolean',
      bedType: 'string',
      bedSize: 'string',
      bedCount: 'string',
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
