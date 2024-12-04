const axios = require('axios');

module.exports = {
  friendlyName: 'Create channex tax set',

  description: '',

  inputs: {
    title: {
      type: 'string',
      required: true,
    },
    propertyId: {
      type: 'string',
      required: true,
    },
    associated_rate_plan_ids: {
      type: 'json',
      columnType: 'array',
    },
    taxes: {
      type: 'json',
      columnType: 'array',
    },
    currency: {
      type: 'string',
      required: true,
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
        process.env.CHANNEX_ENDPOINT + `/tax_sets`,
        {
          tax_set: {
            title: inputs.title,
            property_id: inputs.propertyId,
            associated_rate_plan_ids: inputs.associated_rate_plan_ids,
            taxes: inputs.taxes,
            currency: inputs.currency,
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
        console.log('err', err.response);
        return exits.success(false);
      });
  },
};
