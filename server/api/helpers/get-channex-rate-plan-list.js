const axios = require('axios');

module.exports = {
  friendlyName: 'Get channex rate plans data',

  description: '',

  inputs: {
    propertyChannexId: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Channex rate plans data',
    },
  },

  fn: async function (inputs, exits) {
    let { propertyChannexId } = inputs;

    await axios
      .get(
        process.env.CHANNEX_ENDPOINT +
          `/rate_plans?filter[property_id]=${propertyChannexId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'user-api-key': process.env.CHANNEX_API_KEY,
          },
        }
      )
      .then(async (result) => {
        console.log('result Here', result.data);
        if (!result.data) {
          return exits.success(false);
        }

        return exits.success(result.data.data);
      })
      .catch((err) => {
        console.log('err', err.response);
        return exits.success(false);
      });
  },
};
