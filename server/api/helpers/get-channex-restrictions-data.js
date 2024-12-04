const axios = require('axios');

module.exports = {
  friendlyName: 'Get channex restrictions data',

  description: '',

  inputs: {
    startDate: {
      type: 'string',
    },
    endDate: {
      type: 'string',
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Channex restrictions data',
    },
  },

  fn: async function (inputs, exits) {
    let { propertyChannexId, startDate, endDate } = inputs;
    let filter = {
      date: {},
    };

    let restrictions = `rate,stop_sell,closed_to_arrival,closed_to_departure,min_stay_arrival,min_stay_through,min_stay,max_stay,availability,stop_sell_manual,max_availability,availability_offset`;

    await axios
      .get(
        process.env.CHANNEX_ENDPOINT +
          `/restrictions?filter[date][gte]=${startDate}&filter[date][lte]=${endDate}&filter[restrictions]=${restrictions}&filter[property_id]=${propertyChannexId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'user-api-key': process.env.CHANNEX_API_KEY,
          },
        }
      )
      .then(async (result) => {
        console.log('result', result.data);
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
