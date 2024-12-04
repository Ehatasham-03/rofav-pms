const { WebhookUrl } = sails.config.constants;
const axios = require('axios');

module.exports = {
  friendlyName: 'Create channex webhook',

  description: '',

  inputs: {
    property_id: {
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
        process.env.CHANNEX_ENDPOINT + `/webhooks`,
        {
          webhook: {
            property_id: inputs.property_id,
            callback_url: WebhookUrl,
            event_mask: '*',
            request_params: {},
            headers: {},
            is_active: true,
            send_data: true,
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
        if (!result.data) {
          return exits.success(false);
        }
        return exits.success(result.data);
      })
      .catch((err) => {
        console.log('err', err.response?.data?.errors);
        return exits.success(false);
      });
  },
};
