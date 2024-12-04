/**
 * CancelPolicy.js
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
    after_reservation_cancellation_logic: {
      type: 'string',
      required: true,
    },
    after_reservation_cancellation_amount: {
      type: 'number',
    },
    allow_deadline_based_logic: {
      type: 'boolean',
      defaultsTo: false,
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
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    channexId: {
      type: 'string',
    },
  },

  beforeCreate: async function (policy, cb) {
    let {
      title,
      after_reservation_cancellation_logic,
      after_reservation_cancellation_amount,
      allow_deadline_based_logic,
      associated_rate_plan_ids,
      cancellation_policy_deadline,
      cancellation_policy_deadline_type,
      cancellation_policy_logic,
      cancellation_policy_mode,
      cancellation_policy_penalty,
      currency,
      guarantee_payment_amount,
      guarantee_payment_policy,
      non_show_policy,
      propertyChannexId,
    } = policy;
    let channexRes = await sails.helpers.createChannexCancelPolicy.with({
      title,
      after_reservation_cancellation_logic,
      after_reservation_cancellation_amount,
      allow_deadline_based_logic,
      associated_rate_plan_ids,
      cancellation_policy_deadline,
      cancellation_policy_deadline_type,
      cancellation_policy_logic,
      cancellation_policy_mode,
      cancellation_policy_penalty,
      currency,
      guarantee_payment_amount,
      guarantee_payment_policy,
      non_show_policy,
      propertyChannexId,
    });
    if (channexRes) {
      policy.channexId = channexRes;
      policy.uniqueId = channexRes;
    }
    return cb();
  },
  beforeUpdate: async function (policy, cb) {
    let {
      title,
      after_reservation_cancellation_logic,
      after_reservation_cancellation_amount,
      allow_deadline_based_logic,
      associated_rate_plan_ids,
      cancellation_policy_deadline,
      cancellation_policy_deadline_type,
      cancellation_policy_logic,
      cancellation_policy_mode,
      cancellation_policy_penalty,
      currency,
      guarantee_payment_amount,
      guarantee_payment_policy,
      non_show_policy,
      channexId,
    } = policy;
    let channexRes = await sails.helpers.updateChannexCancelPolicy.with({
      title,
      after_reservation_cancellation_logic,
      after_reservation_cancellation_amount,
      allow_deadline_based_logic,
      associated_rate_plan_ids,
      cancellation_policy_deadline,
      cancellation_policy_deadline_type,
      cancellation_policy_logic,
      cancellation_policy_mode,
      cancellation_policy_penalty,
      currency,
      guarantee_payment_amount,
      guarantee_payment_policy,
      non_show_policy,
      policyChannexId: channexId,
    });
    return cb();
  },
  validateCreateCancelPolicyData: async (data) => {
    let rules = {
      title: 'string|required',
      after_reservation_cancellation_logic: 'string|required',
      after_reservation_cancellation_amount: 'numeric',
      allow_deadline_based_logic: 'boolean',
      associated_rate_plan_ids: 'array',
      cancellation_policy_deadline: 'numeric',
      cancellation_policy_deadline_type: 'required|string',
      cancellation_policy_logic: 'required|string',
      cancellation_policy_mode: 'string|required',
      cancellation_policy_penalty: 'string',
      currency: 'string|required',
      guarantee_payment_amount: 'numeric|required',
      guarantee_payment_policy: 'string|required',
      non_show_policy: 'string|required',
      propertyChannexId: 'string|required',
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
