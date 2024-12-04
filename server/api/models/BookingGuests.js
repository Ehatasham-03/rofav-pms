/**
 * BookingGuests.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    surname: {
      type: 'string',
    },
    dob: {
      type: 'number',
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
    },
    idNumber: {
      type: 'string',
    },
    idType: {
      type: 'string',
    },
    id_image: {
      type: 'string',
    },
    live_image: {
      type: 'string',
    },
    issuing_country: {
      type: 'string',
    },
    issuing_city: {
      type: 'string',
    },
    expiryDate: {
      type: 'number',
    },
    is_primary: {
      type: 'boolean',
      defaultsTo: true,
    },
  },

  validateGuestData: async (data) => {
    let rules = {
      name: 'required|string|max:20',
      email: 'required|string|max:20',
      phone: 'required|string',
      dob: 'required|numeric',
      bookingChannexId: 'required|string',
      propertyChannexId: 'required|string',
      bookingRoomId: 'string',
      idNumber: 'required|string',
      idType: 'required|string',
      issuing_country: 'required|string',
      issuing_city: 'string',
      id_image: 'required|string',
      live_image: 'string',
      expiryDate: 'numeric',
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
