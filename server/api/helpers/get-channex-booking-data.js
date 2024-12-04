const axios = require('axios');

module.exports = {
  friendlyName: 'Get channex booking data',

  description: '',

  inputs: {
    booking_id: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Channex booking data',
    },
  },

  fn: async function (inputs, exits) {
    let { booking_id } = inputs;

    await axios
      .get(process.env.CHANNEX_ENDPOINT + `/bookings/${booking_id}`, {
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
