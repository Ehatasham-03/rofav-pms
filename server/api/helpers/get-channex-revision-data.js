const axios = require('axios');

module.exports = {
  friendlyName: 'Get channex revision data',

  description: '',

  inputs: {
    revision_id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Channex revision data',
    },
  },

  fn: async function (inputs, exits) {
    let { revision_id } = inputs;

    await axios
      .get(process.env.CHANNEX_ENDPOINT + `/booking_revisions/${revision_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'user-api-key': process.env.CHANNEX_API_KEY,
        },
      })
      .then(async (result) => {
        console.log('result Here', result.data);
        if (!result.data) {
          return exits.success(false);
        }

        return exits.success(result.data.data.attributes);
      })
      .catch((err) => {
        console.log('err', err.response);
        return exits.success(false);
      });
  },
};
