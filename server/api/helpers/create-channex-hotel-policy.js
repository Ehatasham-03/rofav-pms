const axios = require('axios');
const { InternetAccessType, InternetAccessCoverage, ParkingType } =
  sails.config.constants;
module.exports = {
  friendlyName: 'Create channex hotel policy',

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
      // required: true,
      allowNull: true,
    },
    parking_type: {
      type: 'string',
      isIn: [ParkingType.ON_SITE, ParkingType.NEARBY, ParkingType.NONE],
      required: true,
    },
    parking_reservation: {
      type: 'string',
      allowNull: true,
      // required: true,
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

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    await axios
      .post(
        process.env.CHANNEX_ENDPOINT + `/hotel_policies`,
        {
          hotel_policy: {
            title: inputs.title,
            currency: inputs.currency,
            is_adults_only: inputs.is_adults_only,
            max_count_of_guests: inputs.max_count_of_guests,
            checkin_time: inputs.checkin_time,
            checkout_time: inputs.checkout_time,
            internet_access_type: inputs.internet_access_type,
            internet_access_cost: inputs.internet_access_cost || null,
            internet_access_coverage: inputs.internet_access_coverage,
            parking_type: inputs.parking_type,
            parking_reservation: inputs.parking_reservation || 'not_available',
            parking_is_private: inputs.parking_is_private,
            pets_policy: inputs.pets_policy,
            pets_non_refundable_fee: inputs.pets_non_refundable_fee,
            pets_refundable_deposit: inputs.pets_refundable_deposit,
            smoking_policy: inputs.smoking_policy,
            checkin_from_time: inputs.checkin_from_time,
            checkin_to_time: inputs.checkin_to_time,
            checkout_from_time: inputs.checkout_from_time,
            checkout_to_time: inputs.checkout_to_time,
            property_id: inputs.propertyChannexId,
            self_checkin_checkout: inputs.self_checkin_checkout,
            infant_max_age: inputs.infant_max_age || 0, //new
            children_max_age: inputs.children_max_age || 0, // new
            parking_cost_type: inputs.parking_cost_type || null,
            parking_cost: inputs.parking_cost || 0,
            internet_access_cost_type: inputs.internet_access_cost_type || null,
            cleaning_practices_description:
              inputs.cleaning_practices_description || '',
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
        // console.log('err', err.response);
        console.log('err', err.response.data.errors.details);
        return exits.success(false);
      });
  },
};
