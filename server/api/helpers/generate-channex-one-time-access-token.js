const axios = require('axios');
module.exports = {
  friendlyName: 'Generate channex one time access token',

  description: '',

  inputs: {
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    username: {
      type: 'string',
      required: true,
    },
    groupChannexId: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    let { propertyChannexId, username, groupChannexId } = inputs;
    await axios
      .post(
        process.env.CHANNEX_ENDPOINT + `/auth/one_time_token`,
        {
          one_time_token: {
            property_id: propertyChannexId,
            group_id: groupChannexId || null,
            username: username,
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
        console.log('result Here', result.data);
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
