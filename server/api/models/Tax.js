/**
 * Tax.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const { TaxLogics, TaxTypes } = sails.config.constants;

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
    logic: {
      type: 'string',
      isIn: [
        TaxLogics.PERCENT,
        TaxLogics.PER_ROOM,
        TaxLogics.PER_ROOM_PER_NIGHT,
        TaxLogics.PER_PERSON,
        TaxLogics.PER_PERSON_PER_NIGHT,
        TaxLogics.PER_NIGHT,
        TaxLogics.PER_BOOKING,
      ],
      required: true,
    },
    type: {
      type: 'string',
      isIn: [TaxTypes.TAX, TaxTypes.FEE, TaxTypes.CITY_TAX],
      required: true,
    },
    rate: {
      type: 'string',
      required: true,
    },
    currency: {
      type: 'string',
      required: true,
    },
    is_inclusive: {
      type: 'boolean',
      defaultsTo: false,
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    property: {
      model: 'property',
    },
    channexId: {
      type: 'string',
    },
    group_id: {
      type: 'string',
      required: true,
    },
    applicable_after: {
      type: 'string',
    },
    applicable_before: {
      type: 'string',
    },
    max_nights: {
      type: 'number',
    },
    skip_nights: {
      type: 'number',
    },
  },

  beforeCreate: async function (tax, cb) {
    if (tax.title) {
      tax.searchTitle = tax.title.toLowerCase();
    }
    let channexRes = await sails.helpers.createChannexTax.with({
      title: tax.title,
      logic: tax.logic,
      type: tax.type,
      rate: tax.rate,
      currency: tax.currency,
      is_inclusive: tax.is_inclusive,
      propertyId: tax.propertyChannexId,
      applicable_after: tax.applicable_after,
      applicable_before: tax.applicable_before,
      max_nights: tax.max_nights,
      skip_nights: tax.skip_nights,
    });
    if (!channexRes) {
      cb(new Error('Channex Tax not created'));
    }
    tax.channexId = channexRes;
    return cb();
  },

  validateCreateTaxData: async (data) => {
    let rules = {
      title: 'required|string|max:50',
      logic:
        'required|string|in:' +
        TaxLogics.PERCENT +
        ',' +
        TaxLogics.PER_ROOM +
        ',' +
        TaxLogics.PER_ROOM_PER_NIGHT +
        ',' +
        TaxLogics.PER_PERSON +
        ',' +
        TaxLogics.PER_PERSON_PER_NIGHT +
        TaxLogics.PER_NIGHT +
        ',' +
        TaxLogics.PER_BOOKING +
        ',' +
        '',
      type:
        'required|string|in:' +
        TaxTypes.TAX +
        ',' +
        TaxTypes.FEE +
        ',' +
        TaxTypes.CITY_TAX +
        ',' +
        '',
      rate: 'required|string',
      currency: 'required|string',
      is_inclusive: 'required|boolean',
      propertyUniqueId: 'required|string',
      applicable_after: 'string',
      applicable_before: 'string',
      max_nights: 'integer|min:1',
      skip_nights: 'integer|min:1',
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
