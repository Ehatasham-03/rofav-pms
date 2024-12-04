/**
 * TaxSet.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      required: true,
    },
    searchTitle: {
      type: 'string',
    },
    currency: {
      type: 'string',
      required: true,
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    property: {
      model: 'property',
    },
    associated_rate_plan_ids: {
      type: 'json',
      columnType: 'array',
    },
    taxes: {
      type: 'json',
      columnType: 'array',
    },
    tax: {
      collection: 'tax',
    },
    channexId: {
      type: 'string',
    },
    group_id: {
      type: 'string',
      required: true,
    },
  },

  beforeCreate: async function (taxSet, cb) {
    if (taxSet.title) {
      taxSet.searchTitle = taxSet.title.toLowerCase();
    }
    let channexRes = await sails.helpers.createChannexTaxSet.with({
      title: taxSet.title,
      propertyId: taxSet.propertyChannexId,
      currency: taxSet.currency,
      associated_rate_plan_ids: taxSet.associated_rate_plan_ids,
      taxes: taxSet.taxes,
    });
    if (!channexRes) {
      cb(new Error('Channex tax set not created'));
    }
    taxSet.channexId = channexRes;
    return cb();
  },

  validateCreateTaxSetData: async (data) => {
    let rules = {
      title: 'required|string|max:50',
      propertyUniqueId: 'required|string',
      taxes: 'required|array',
      currency: 'required|string',
      associated_rate_plan_ids: 'array',
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
