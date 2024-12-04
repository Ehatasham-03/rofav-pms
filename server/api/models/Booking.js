/**
 * Booking.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    amount: {
      type: 'string',
      allowNull: true,
    },
    ota_commission: {
      type: 'string',
      allowNull: true,
    },
    arrival_date: {
      type: 'string',
      allowNull: true,
    },
    arrival_hour: {
      type: 'string',
      allowNull: 'true',
    },
    currency: {
      type: 'string',
      allowNull: true,
    },
    departure_date: {
      type: 'string',
      allowNull: true,
    },
    guarantee: {
      type: 'json',
    },
    booking_id: {
      type: 'string',
      allowNull: true,
    },
    inserted_at: {
      type: 'string',
      allowNull: true,
    },
    notes: {
      type: 'string',
      allowNull: true,
    },
    occupancy: {
      type: 'json',
    },
    ota_name: {
      type: 'string',
      allowNull: true,
    },
    ota_reservation_code: {
      type: 'string',
      allowNull: true,
    },
    payment_collect: {
      type: 'string',
      allowNull: true,
    },
    payment_type: {
      type: 'string',
      allowNull: true,
    },
    property_id: {
      type: 'string',
      allowNull: true,
    },
    revision_id: {
      type: 'string',
      allowNull: true,
    },
    services: {
      type: 'json',
      columnType: 'array',
    },
    status: {
      type: 'string',
      allowNull: true,
    },
    unique_id: {
      type: 'string',
      allowNull: true,
    },
    is_acknowledged: {
      type: 'boolean',
      defaultsTo: false,
    },
    is_manual: {
      type: 'boolean',
      defaultsTo: false,
    },
    booking_type: {
      type: 'string',
    },
    company_name: {
      type: 'string',
    },
    company_address: {
      type: 'string',
    },
    company_gst: {
      type: 'string',
    },
    discount_amount: {
      type: 'number',
    },
    discount_percent: {
      type: 'number',
    },
    room_count: {
      type: 'number',
    },
    no_show: {
      type: 'boolean',
      defaultsTo: false,
    },
    checkOutDate: {
      type: 'number',
    },
    checkInDate: {
      type: 'number',
    },
    cancel_policy: {
      type: 'string',
    },
  },

  validateManualBookingData: async (data) => {
    let rules = {
      amount: 'required',
      arrival_date: 'required|string',
      departure_date: 'required|string',
      booking_id: 'string|required',
      property_id: 'string|required',
      status: 'string|required',
      is_acknowledged: 'boolean|required',
      is_manual: 'boolean|required',
      booking_room_id: 'string|required',
      room_type_id: 'string|required',
      rate_plan_id: 'string|required',
      propertyChannexId: 'string|required',
      ota_name: 'string|required',
      booking_type: 'string|required',
      company_name: 'string',
      company_address: 'string',
      company_gst: 'string',
      // discount_amount: 'numeric',
      // discount_percent: 'numeric',
      room_count: 'numeric',
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
