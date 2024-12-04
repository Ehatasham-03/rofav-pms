/**
 * RatePlans.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
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
    property: {
      model: 'property',
    },
    roomType: {
      model: 'roomType',
    },
    taxset: {
      model: 'taxset',
    },
    group_id: {
      type: 'string',
    },
    channexId: {
      type: 'string',
    },
    cancellation_policy_id: {
      type: 'string',
    },
    cancellation_policy: {
      model: 'cancelpolicy',
    },
    parentRatePlan: {
      model: 'rateplans',
    },
    pricing_rate_mode: {
      type: 'string',
    },
  },
  beforeCreate: async function (plan, cb) {
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
    } = plan;
    let channexRes = await sails.helpers.createChannexRatePlan.with({
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
    });
    if (!channexRes) {
      return cb(new Error('Channex Rate Plan not created'));
    }
    plan.uniqueId = channexRes;
    plan.channexId = channexRes;
    return cb();
  },
  beforeUpdate: async function (plan, cb) {
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
      channexId,
      cancellationPolicyChannexId,
    } = plan;
    let channexRes = await sails.helpers.updateChannexRatePlan.with({
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
      ratePlanChannexId: channexId,
      cancellationPolicyChannexId,
    });
    if (!channexRes) {
      return cb(new Error('Channex Rate Plan not updated'));
    }
    return cb();
  },
  validateCreateRatePlans: async (data) => {
    let rules = {
      title: 'required|string',
      propertyChannexId: 'required|string',
      roomTypeChannexId: 'required|string',
      taxSetChannexId: 'string',
      options: 'array',
      parentRatePlanChannexId: 'string',
      currency: 'string',
      sell_mode: 'string',
      rate_mode: 'string',
      meal_type: 'string',
      inherit_rate: 'boolean',
      inherit_closed_to_arrival: 'boolean',
      inherit_closed_to_departure: 'boolean',
      inherit_stop_sell: 'boolean',
      inherit_min_stay_arrival: 'boolean',
      inherit_min_stay_through: 'boolean',
      inherit_max_stay: 'boolean',
      inherit_max_sell: 'boolean',
      inherit_max_availability: 'boolean',
      inherit_availability_offset: 'boolean',
      children_fee: 'string',
      infant_fee: 'string',
      max_stay: 'array|min:7|max:7',
      min_stay_arrival: 'array|min:7|max:7',
      min_stay_through: 'array|min:7|max:7',
      closed_to_arrival: 'array|min:7|max:7',
      closed_to_departure: 'array|min:7|max:7',
      stop_sell: 'array|min:7|max:7',
      cancellationPolicyChannexId: 'string',
    };

    let validation = new sails.config.constants.Validator(data, rules);
    let result = {};

    if (validation.passes()) {
      result['hasError'] = false;
    }
    if (validation.fails()) {
      result['hasError'] = true;
      result['errors'] = validation.errors.all();
    }
    return result;
  },
};
