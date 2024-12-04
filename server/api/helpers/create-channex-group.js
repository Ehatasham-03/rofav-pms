const axios = require('axios');
module.exports = {
  friendlyName: 'Create channex group',

  description: '',

  inputs: {
    title: {
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
    const { title } = inputs;
    await axios
      .post(
        process.env.CHANNEX_ENDPOINT + `/groups`,
        {
          group: {
            title: title,
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
        console.log('err', err);
        return exits.success(false);
      });
  },
};
