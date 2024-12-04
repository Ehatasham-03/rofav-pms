const axios = require('axios');

module.exports = {
  friendlyName: 'Update channex rate plan',

  description: '',

  inputs: {
    ratePlanChannexId: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      required: true,
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    roomTypeChannexId: {
      type: 'string',
      required: true,
    },
    taxSetChannexId: {
      type: 'string',
      allowNull: true,
    },
    options: {
      type: 'json',
      columnType: 'array',
    },
    parentRatePlanChannexId: {
      type: 'string',
      allowNull: true,
    },
    currency: {
      type: 'string',
      allowNull: true,
    },
    sell_mode: {
      type: 'string',
      allowNull: true,
    },
    rate_mode: {
      type: 'string',
      allowNull: true,
    },
    meal_type: {
      type: 'string',
      allowNull: true,
    },
    auto_rate_settings: {
      type: 'json',
      // allowNull: true,
    },
    inherit_rate: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_closed_to_arrival: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_closed_to_departure: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_stop_sell: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_min_stay_arrival: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_min_stay_through: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_max_stay: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_max_sell: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_max_availability: {
      type: 'boolean',
      defaultsTo: false,
    },
    inherit_availability_offset: {
      type: 'boolean',
      defaultsTo: false,
    },
    children_fee: {
      type: 'string',
      allowNull: true,
    },
    infant_fee: {
      type: 'string',
      allowNull: true,
    },
    max_stay: {
      type: 'json',
      columnType: 'array',
    },
    min_stay_arrival: {
      type: 'json',
      columnType: 'array',
    },
    min_stay_through: {
      type: 'json',
      columnType: 'array',
    },
    closed_to_arrival: {
      type: 'json',
      columnType: 'array',
    },
    closed_to_departure: {
      type: 'json',
      columnType: 'array',
    },
    stop_sell: {
      type: 'json',
      columnType: 'array',
    },
    cancellationPolicyChannexId: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    let {
      title,
      propertyChannexId,
      roomTypeChannexId,
      taxSetChannexId,
      options,
      parentRatePlanChannexId,
      currency,
      sell_mode,
      rate_mode,
      meal_type,
      auto_rate_settings,
      inherit_rate,
      inherit_closed_to_arrival,
      inherit_closed_to_departure,
      inherit_stop_sell,
      inherit_min_stay_arrival,
      inherit_min_stay_through,
      inherit_max_stay,
      inherit_max_sell,
      inherit_max_availability,
      inherit_availability_offset,
      children_fee,
      infant_fee,
      max_stay,
      min_stay_arrival,
      min_stay_through,
      closed_to_arrival,
      closed_to_departure,
      stop_sell,
      cancellationPolicyChannexId,
    } = inputs;
    await axios
      .put(
        process.env.CHANNEX_ENDPOINT +
          `/rate_plans/${inputs.ratePlanChannexId}`,
        {
          rate_plan: {
            title,
            property_id: propertyChannexId,
            room_type_id: roomTypeChannexId,
            tax_set_id: taxSetChannexId,
            options,
            parent_rate_plan_id: parentRatePlanChannexId || null,
            currency,
            sell_mode,
            rate_mode,
            meal_type,
            auto_rate_settings,
            inherit_rate,
            inherit_closed_to_arrival,
            inherit_closed_to_departure,
            inherit_stop_sell,
            inherit_min_stay_arrival,
            inherit_min_stay_through,
            inherit_max_stay,
            inherit_max_sell,
            inherit_max_availability,
            inherit_availability_offset,
            children_fee,
            infant_fee,
            max_stay,
            min_stay_arrival,
            min_stay_through,
            closed_to_arrival,
            closed_to_departure,
            stop_sell,
            cancellation_policy_id: cancellationPolicyChannexId,
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
        console.log('err', err.response.data.errors.details);
        return exits.success(false);
      });
  },
};
