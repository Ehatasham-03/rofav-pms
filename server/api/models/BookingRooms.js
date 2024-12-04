/**
 * BookingRooms.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    amount: {
      type: 'string',
    },
    booking_room_id: {
      type: 'string',
    },
    checkin_date: {
      type: 'string',
    },
    checkout_date: {
      type: 'string',
    },
    ota_unique_id: {
      type: 'string',
    },
    days: {
      type: 'json',
    },
    additional_details: {
      type: 'json',
    },
    booking_com_room_index: {
      type: 'string',
    },
    meal_plan: {
      type: 'string',
    },
    policies: {
      type: 'string',
    },
    rate_plan_code: {
      type: 'number',
    },
    room_remarks: {
      type: 'json',
    },
    room_type_code: {
      type: 'string',
    },
    smoking_preferences: {
      type: 'string',
      allowNull: true,
    },
    occupancy: {
      type: 'json',
    },
    rate_plan_id: {
      type: 'string',
      allowNull: true,
    },
    room_type_id: {
      type: 'string',
      allowNull: true,
    },
    services: {
      type: 'json',
      columnType: 'array',
    },
    bookingChannexId: {
      type: 'string',
      required: true,
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
  },
};
