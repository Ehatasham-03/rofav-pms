const axios = require('axios');
const { TaxLogics, TaxTypes } = sails.config.constants;

module.exports = {
  friendlyName: 'Create channex tax',

  description: '',

  inputs: {
    title: {
      type: 'string',
      required: true,
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
    propertyId: {
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

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    await axios
      .post(
        process.env.CHANNEX_ENDPOINT + `/taxes`,
        {
          tax: {
            title: inputs.title,
            logic: inputs.logic,
            type: inputs.type,
            rate: inputs.rate,
            is_inclusive: inputs.is_inclusive,
            property_id: inputs.propertyId,
            currency: inputs.currency,
            applicable_after: inputs.applicable_after || null,
            applicable_before: inputs.applicable_before || null,
            max_nights: inputs.max_nights || null,
            skip_nights: inputs.skip_nights || null,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'user-api-key': process.env.CHANNEX_API_KEY,
          },
        }
      )
      .then(async (result) => {
        console.log('result', result.data);
        if (!result.data || !result.data.data || !result.data.data.id) {
          return exits.success(false);
        }
        return exits.success(result.data.data.id);
      })
      .catch((err) => {
        console.log('error', err.response?.data?.errors);

        return exits.success(false);
      });
  },
};
