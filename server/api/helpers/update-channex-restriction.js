const axios = require('axios');

module.exports = {
  friendlyName: 'Update channex restriction',

  description: '',

  inputs: {
    data: {
      type: 'json',
      columnType: 'array',
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Update channex restriction',
    },
  },

  fn: async function (inputs, exits) {
    let { data } = inputs;

    await axios
      .post(
        process.env.CHANNEX_ENDPOINT + `/restrictions`,
        {
          values: data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'user-api-key': process.env.CHANNEX_API_KEY,
          },
        }
      )
      .then(async (result) => {
        console.log('result Here', result.data.data);
        if (!result.data) {
          return exits.success(false);
        }

        return exits.success(result.data);
      })
      .catch((err) => {
        console.log('err', err.response);
        return exits.success(false);
      });
  },
};
