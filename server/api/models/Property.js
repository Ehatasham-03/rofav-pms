/**
 * Property.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      required: true,
    },
    titleSearch: {
      type: 'string',
    },
    currency: {
      type: 'string',
      required: true,
    },
    property_type: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    phone: {
      type: 'string',
    },
    website: {
      type: 'string',
    },

    address: {
      type: 'string',
    },
    landmark: {
      type: 'string',
    },
    country_code: {
      type: 'string',
      required: true,
    },
    timezone: {
      type: 'string',
      required: true,
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    zip_code: {
      type: 'string',
    },
    latitude: {
      type: 'number',
    },
    longitude: {
      type: 'number',
    },

    description: {
      type: 'string',
    },
    extra_information: {
      type: 'string',
    },
    photos: {
      type: 'json',
      columnType: 'array',
    },

    min_stay_type: {
      type: 'string',
    },
    allow_availability_autoupdate: {
      type: 'boolean',
      defaultsTo: false,
    },
    allow_availability_autoupdate_on_cancellation: {
      type: 'boolean',
      defaultsTo: false,
    },
    allow_availability_autoupdate_on_confirmation: {
      type: 'boolean',
      defaultsTo: false,
    },
    allow_availability_autoupdate_on_modification: {
      type: 'boolean',
      defaultsTo: false,
    },
    cut_off_days: {
      type: 'number',
    },
    cut_off_time: {
      type: 'string',
    },
    max_price: {
      type: 'number',
    },
    min_price: {
      type: 'number',
    },
    state_length: {
      type: 'number',
    },
    is_active: {
      type: 'boolean',
      defaultsTo: true,
    },
    logo_url: {
      type: 'string',
    },
    default_cancellation_policy_id: {
      type: 'string',
    },
    hotel_policy_id: {
      type: 'string',
    },
    acc_channels_count: {
      type: 'number',
    },
    default_tax_set_id: {
      type: 'string',
    },
    location_precision: {
      type: 'string',
    },
    property_category: {
      type: 'string',
    },
    permissions: {
      type: 'json',
      columnType: 'array',
    },
    facilities: {
      type: 'json',
      columnType: 'array',
    },
    parking_available: {
      type: 'boolean',
      defaultsTo: false,
    },
    couple_friendly: {
      type: 'boolean',
      defaultsTo: false,
    },
    group_id: {
      type: 'string',
      required: true,
    },
    channexId: {
      type: 'string',
    },
    is_sync: {
      type: 'boolean',
      defaultsTo: false,
    },
    hotel_policy_id: {
      type: 'string',
    },
    hotel_policy: {
      model: 'hotelPolicy',
    },
  },
  beforeCreate: async function (property, cb) {
    if (property.title) {
      property.titleSearch = property.title.toLowerCase();
    }
    let {
      title,
      currency,
      email,
      phone,
      zip_code,
      country_code,
      city,
      state,
      address,
      latitude,
      longitude,
      timezone,
      property_type,
      group_id,
      allow_availability_autoupdate,
      allow_availability_autoupdate_on_cancellation,
      allow_availability_autoupdate_on_confirmation,
      allow_availability_autoupdate_on_modification,
      min_stay_type,
      cut_off_days,
      cut_off_time,
      max_price,
      min_price,
      state_length,
      description,
      extra_information,
      website,
      logo_url,
      facilities,
    } = property;
    let channexRes = await sails.helpers.createChannexProperty.with({
      title,
      currency,
      email,
      phone,
      zip_code,
      country_code,
      city,
      state,
      address,
      latitude,
      longitude,
      timezone,
      property_type,
      group_id,
      allow_availability_autoupdate,
      allow_availability_autoupdate_on_cancellation,
      allow_availability_autoupdate_on_confirmation,
      allow_availability_autoupdate_on_modification,
      min_stay_type,
      cut_off_days,
      cut_off_time,
      max_price,
      min_price,
      state_length,
      description,
      extra_information,
      website,
      logo_url,
      facilities,
    });
    if (channexRes) {
      property.channexId = channexRes;
      property.is_sync = true;
    }
    return cb();
  },
  beforeUpdate: async function (property, cb) {
    if (property.title) {
      property.titleSearch = property.title.toLowerCase();
    }
    let {
      title,
      currency,
      email,
      phone,
      zip_code,
      country_code,
      city,
      state,
      address,
      latitude,
      longitude,
      timezone,
      property_type,
      group_id,
      allow_availability_autoupdate,
      allow_availability_autoupdate_on_cancellation,
      allow_availability_autoupdate_on_confirmation,
      allow_availability_autoupdate_on_modification,
      min_stay_type,
      cut_off_days,
      cut_off_time,
      max_price,
      min_price,
      state_length,
      description,
      extra_information,
      website,
      logo_url,
      channexId,
      facilities,
      hotel_policy_id,
    } = property;
    if (title) {
      let channexRes = await sails.helpers.updateChannexProperty.with({
        channexId,
        title,
        currency,
        email,
        phone,
        zip_code,
        country_code,
        city,
        state,
        address,
        latitude,
        longitude,
        timezone,
        property_type,
        group_id,
        allow_availability_autoupdate,
        allow_availability_autoupdate_on_cancellation,
        allow_availability_autoupdate_on_confirmation,
        allow_availability_autoupdate_on_modification,
        min_stay_type,
        cut_off_days,
        cut_off_time,
        max_price,
        min_price,
        state_length,
        description,
        extra_information,
        website,
        logo_url,
        facilities,
        hotel_policy_id,
      });
      if (channexRes) {
        property.is_sync = true;
      } else {
        property.is_sync = false;
      }
      console.log(channexRes);
    }
    return cb();
  },
  validateCreatePropertyData: async (data, create = false) => {
    let rules = {
      title: 'required|string',
      currency: 'required|string',
      property_type: 'required|string',
      email: 'required|string',
      phone: 'string',
      website: 'string',
      address: 'string',
      landmark: 'string',
      country_code: 'required|string',
      timezone: 'required|string',
      city: 'string',
      state: 'string',
      zip_code: 'string',
      latitude: 'numeric',
      longitude: 'numeric',
      description: 'string',
      extra_information: 'string',
      photos: 'array',
      min_stay_type: 'string',
      allow_availability_autoupdate: 'boolean',
      allow_availability_autoupdate_on_cancellation: 'boolean',
      allow_availability_autoupdate_on_confirmation: 'boolean',
      allow_availability_autoupdate_on_modification: 'boolean',
      cut_off_days: 'integer',
      cut_off_time: 'string',
      max_price: 'numeric',
      min_price: 'numeric',
      state_length: 'integer',
      logo_url: 'string',
      default_cancellation_policy_id: 'string',
      hotel_policy_id: 'string',
      acc_channels_count: 'integer',
      default_tax_set_id: 'string',
      location_precision: 'string',
      property_category: 'string',
      permissions: 'array',
      facilities: 'array',
      parking_available: 'boolean',
      couple_friendly: 'boolean',
      group_id: 'required|string',
    };

    if (!create) {
      rules.channexId = 'required|string';
    }

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
