const axios = require('axios');

module.exports = {
  friendlyName: 'Delete channex tax',

  description: '',

  inputs: {
    channexId: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    const { channexId } = inputs;
    await axios
      .delete(process.env.CHANNEX_ENDPOINT + `/taxes/${channexId}`, {
        headers: {
          'Content-Type': 'application/json',
          'user-api-key': process.env.CHANNEX_API_KEY,
        },
      })
      .then(async (result) => {
        console.log('result', result.data);
        if (!result.data || !result.data.meta || !result.data.meta.message) {
          return exits.success(false);
        }
        return exits.success(true);
      })
      .catch((err) => {
        console.log('error', err.response?.data?.errors);
        return exits.success(false);
      });
  },
};
