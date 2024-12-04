const axios = require('axios');
module.exports = {
  friendlyName: 'Create channex property',

  description: '',

  inputs: {
    title: {
      type: 'string',
      required: true,
    },
    currency: {
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
    zip_code: {
      type: 'string',
    },
    country_code: {
      type: 'string',
      required: true,
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    latitude: {
      type: 'number',
    },
    longitude: {
      type: 'number',
    },
    timezone: {
      type: 'string',
      required: true,
    },
    property_type: {
      type: 'string',
      required: true,
    },
    group_id: {
      type: 'string',
      required: true,
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
    min_stay_type: {
      type: 'string',
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
    description: {
      type: 'string',
    },
    extra_information: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
    logo_url: {
      type: 'string',
    },
    facilities: {
      type: 'json',
      columnType: 'array',
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
        process.env.CHANNEX_ENDPOINT + `/properties`,
        {
          property: {
            title: inputs.title,
            currency: inputs.currency,
            email: inputs.email,
            phone: inputs.phone,
            zip_code: inputs.zip_code,
            country: inputs.country_code,
            state: inputs.state,
            city: inputs.city,
            address: inputs.address,
            longitude: inputs.longitude,
            latitude: inputs.latitude,
            timezone: inputs.timezone,
            property_type: inputs.property_type,
            group_id: inputs.group_id,
            facilities: inputs.facilities || [],
            settings: {
              allow_availability_autoupdate_on_confirmation:
                inputs.allow_availability_autoupdate_on_confirmation,
              allow_availability_autoupdate_on_modification:
                inputs.allow_availability_autoupdate_on_modification,
              allow_availability_autoupdate_on_cancellation:
                inputs.allow_availability_autoupdate_on_cancellation,
              min_stay_type: inputs.min_stay_type,
              min_price: inputs.min_price || null,
              max_price: inputs.max_price || null,
              state_length: inputs.state_length || null,
              cut_off_time: inputs.cut_off_time,
              cut_off_days: inputs.cut_off_days || null,
            },
            content: {
              description: inputs.description,
              important_information: inputs.extra_information,
            },
            logo_url: inputs.logo_url || null,
            website: inputs.website || null,
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
        return exits.success(false);
      });
  },
};
