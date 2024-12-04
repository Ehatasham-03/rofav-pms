/**
 * HotelPolicy.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const { InternetAccessType, InternetAccessCoverage, ParkingType } =
  sails.config.constants;

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
    },
    title: {
      type: 'string',
      required: true,
    },
    currency: {
      type: 'string',
      required: true,
    },
    is_adults_only: {
      type: 'boolean',
      defaultsTo: false,
    },
    max_count_of_guests: {
      type: 'number',
      required: true,
    },
    checkin_time: {
      type: 'string',
      required: true,
    },
    checkout_time: {
      type: 'string',
      required: true,
    },
    internet_access_type: {
      type: 'string',
      isIn: [
        InternetAccessType.NONE,
        InternetAccessType.WIFI,
        InternetAccessType.WIRED,
      ],
      required: true,
    },
    internet_access_cost: {
      type: 'number',
    },
    internet_access_coverage: {
      type: 'string',
      // isIn: [
      //   InternetAccessCoverage.ENTIRE_PROPERTY,
      //   InternetAccessCoverage.PUBLIC_AREAS,
      //   InternetAccessCoverage.ALL_ROOMS,
      //   InternetAccessCoverage.SOME_ROOMS,
      //   InternetAccessCoverage.BUSINESS_CENTRE,
      // ],
      allowNull: true,
      // required: true,
    },
    parking_type: {
      type: 'string',
      isIn: [ParkingType.ON_SITE, ParkingType.NEARBY, ParkingType.NONE],
      required: true,
    },
    parking_reservation: {
      type: 'string',
      // required: true,
      allowNull: true,
    },
    parking_is_private: {
      type: 'boolean',
      defaultsTo: false,
    },
    pets_policy: {
      type: 'string',
      required: true,
    },
    pets_non_refundable_fee: {
      type: 'number',
      required: true,
    },
    pets_refundable_deposit: {
      type: 'number',
      required: true,
    },
    smoking_policy: {
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
    checkin_from_time: {
      type: 'string',
      required: true,
    },
    checkin_to_time: {
      type: 'string',
      required: true,
    },
    checkout_from_time: {
      type: 'string',
      required: true,
    },
    checkout_to_time: {
      type: 'string',
      required: true,
    },
    self_checkin_checkout: {
      type: 'boolean',
      defaultsTo: false,
    },
    infant_max_age: {
      type: 'number',
      allowNull: true,
    }, //new
    children_max_age: {
      type: 'number',
      allowNull: true,
    }, // new
    parking_cost_type: {
      type: 'string',
    },
    parking_cost: {
      type: 'number',
      allowNull: true,
    },
    internet_access_cost_type: {
      type: 'string',
    },
    cleaning_practices_description: {
      type: 'string',
    },
  },
  beforeCreate: async function (policy, cb) {
    let {
      title,
      currency,
      is_adults_only,
      max_count_of_guests,
      checkin_time,
      checkout_time,
      internet_access_type,
      internet_access_cost,
      internet_access_coverage,
      parking_type,
      parking_reservation,
      parking_is_private,
      pets_policy,
      pets_non_refundable_fee,
      pets_refundable_deposit,
      smoking_policy,
      propertyChannexId,
      checkin_from_time,
      checkin_to_time,
      checkout_from_time,
      checkout_to_time,
      self_checkin_checkout,
      infant_max_age, //new
      children_max_age, // new
      parking_cost_type,
      parking_cost,
      internet_access_cost_type,
      cleaning_practices_description,
    } = policy;
    let channexRes = await sails.helpers.createChannexHotelPolicy.with({
      title,
      currency,
      is_adults_only,
      max_count_of_guests,
      checkin_time,
      checkout_time,
      internet_access_type,
      internet_access_cost,
      internet_access_coverage,
      parking_type,
      parking_reservation,
      parking_is_private,
      pets_policy,
      pets_non_refundable_fee,
      pets_refundable_deposit,
      smoking_policy,
      checkin_from_time,
      checkin_to_time,
      checkout_from_time,
      checkout_to_time,
      propertyChannexId,
      self_checkin_checkout,
      infant_max_age, //new
      children_max_age, // new
      parking_cost_type,
      parking_cost,
      internet_access_cost_type,
      cleaning_practices_description,
    });
    if (!channexRes) {
      return cb(new Error('Channex Hotel Policy not created'));
    }
    if (channexRes) {
      policy.channexId = channexRes;
      policy.uniqueId = channexRes;
    }
    return cb();
  },
  beforeUpdate: async function (policy, cb) {
    let {
      title,
      currency,
      is_adults_only,
      max_count_of_guests,
      checkin_time,
      checkout_time,
      internet_access_type,
      internet_access_cost,
      internet_access_coverage,
      parking_type,
      parking_reservation,
      parking_is_private,
      pets_policy,
      pets_non_refundable_fee,
      pets_refundable_deposit,
      smoking_policy,
      checkin_from_time,
      checkin_to_time,
      checkout_from_time,
      checkout_to_time,
      channexId,
      self_checkin_checkout,
      infant_max_age, //new
      children_max_age, // new
      parking_cost_type,
      parking_cost,
      internet_access_cost_type,
      cleaning_practices_description,
    } = policy;
    let channexRes = await sails.helpers.updateChannexHotelPolicy.with({
      title,
      currency,
      is_adults_only,
      max_count_of_guests,
      checkin_time,
      checkout_time,
      internet_access_type,
      internet_access_cost,
      internet_access_coverage,
      parking_type,
      parking_reservation,
      parking_is_private,
      pets_policy,
      pets_non_refundable_fee,
      pets_refundable_deposit,
      smoking_policy,
      checkin_from_time,
      checkin_to_time,
      checkout_from_time,
      checkout_to_time,
      policyChannexId: channexId,
      self_checkin_checkout,
      infant_max_age, //new
      children_max_age, // new
      parking_cost_type,
      parking_cost,
      internet_access_cost_type,
      cleaning_practices_description,
    });
    if (!channexRes) {
      return cb(new Error('Channex hotel policy not updated'));
    }
    return cb();
  },
  validateCreatePolicyData: async (data) => {
    let rules = {
      title: 'string|required',
      currency: 'string|required',
      is_adults_only: 'boolean',
      max_count_of_guests: 'required|numeric',
      checkin_time: 'required|string',
      checkout_time: 'required|string',
      internet_access_type: 'required|string',
      internet_access_cost: 'numeric',
      internet_access_coverage: 'string',
      parking_type: 'string|required',
      parking_reservation: 'string',
      parking_is_private: 'boolean',
      pets_policy: 'string|required',
      pets_non_refundable_fee: 'numeric|required',
      pets_refundable_deposit: 'numeric|required',
      smoking_policy: 'string|required',
      propertyChannexId: 'string|required',
      checkin_from_time: 'string|required',
      checkin_to_time: 'string|required',
      checkout_from_time: 'string|required',
      checkout_to_time: 'string|required',
      self_checkin_checkout: 'boolean|required',
      infant_max_age: 'numeric', //new
      children_max_age: 'numeric', // new
      parking_cost_type: 'string',
      parking_cost: 'numeric',
      internet_access_cost_type: 'string',
      cleaning_practices_description: 'string',
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
