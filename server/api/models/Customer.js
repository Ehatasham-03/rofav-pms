/**
 * Customer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    address: {
      type: 'string',
      allowNull: true,
    },
    city: {
      type: 'string',
      allowNull: true,
    },
    company: {
      type: 'string',
      allowNull: true,
    },
    country: { type: 'string', allowNull: true },
    language: { type: 'string', allowNull: true },
    mail: { type: 'string', allowNull: true },
    meta: {
      type: 'json',
    },
    name: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    surname: {
      type: 'string',
    },
    zip: {
      type: 'string',
      allowNull: true,
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
