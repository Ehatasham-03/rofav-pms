const axios = require('axios');
const { InternetAccessType, InternetAccessCoverage, ParkingType } =
  sails.config.constants;
module.exports = {
  friendlyName: 'Update channex cancel policy',

  description: '',

  inputs: {
    policyChannexId: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      required: true,
    },
    after_reservation_cancellation_logic: {
      type: 'string',
      required: true,
    },
    after_reservation_cancellation_amount: {
      type: 'number',
    },
    allow_deadline_based_logic: {
      type: 'boolean',
      default: false,
    },
    associated_rate_plan_ids: {
      type: 'json',
      columnType: 'array',
    },
    cancellation_policy_deadline: {
      type: 'number',
      allowNull: true,
    },
    cancellation_policy_deadline_type: {
      type: 'string',
      required: true,
    },
    cancellation_policy_logic: {
      type: 'string',
      required: true,
    },
    cancellation_policy_mode: {
      type: 'string',
      required: true,
    },
    cancellation_policy_penalty: {
      type: 'string',
    },
    currency: {
      type: 'string',
      required: true,
    },
    guarantee_payment_amount: {
      type: 'number',
      required: true,
    },
    guarantee_payment_policy: {
      type: 'string',
      required: true,
    },
    non_show_policy: {
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
      .put(
        process.env.CHANNEX_ENDPOINT +
          `/cancellation_policies/${inputs.policyChannexId}`,
        {
          cancellation_policy: {
            after_reservation_cancellation_logic:
              inputs.after_reservation_cancellation_logic,
            after_reservation_cancellation_amount:
              inputs.after_reservation_cancellation_amount || null,
            title: inputs.title,
            guarantee_payment_policy: inputs.guarantee_payment_policy,
            guarantee_payment_amount: inputs.guarantee_payment_amount || null,
            cancellation_policy_logic: inputs.cancellation_policy_logic,
            cancellation_policy_deadline_type:
              inputs.cancellation_policy_deadline_type,
            cancellation_policy_mode: inputs.cancellation_policy_mode,
            non_show_policy: inputs.non_show_policy,
            associated_rate_plan_ids: inputs.associated_rate_plan_ids || [],
            currency: inputs.currency,
            allow_deadline_based_logic:
              inputs.allow_deadline_based_logic || false,
            cancellation_policy_deadline:
              inputs.cancellation_policy_deadline || null,
            cancellation_policy_penalty:
              inputs.cancellation_policy_penalty || null,
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
        // console.log('err', err.response.data.errors.details);
        return exits.success(false);
      });
  },
};
