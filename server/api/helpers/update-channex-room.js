const axios = require('axios');

module.exports = {
  friendlyName: 'Update channex room',

  description: '',

  inputs: {
    roomId: {
      type: 'string',
      required: true,
    },
    propertyChannexId: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      required: true,
    },
    count_of_rooms: {
      type: 'number',
      required: true,
    },
    occ_adults: {
      type: 'number',
      required: true,
    },
    occ_children: {
      type: 'number',
      required: true,
    },
    occ_infants: {
      type: 'number',
      required: true,
    },
    default_occupancy: {
      type: 'number',
      required: true,
    },
    facilities: {
      type: 'json',
      columnType: 'array',
    },
    room_kind: {
      type: 'string',
      required: true,
    },
    capacity: {
      type: 'number',
      allowNull: true,
    },
    description: {
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
      .put(
        process.env.CHANNEX_ENDPOINT + `/room_types/${inputs.roomId}`,
        {
          room_type: {
            property_id: inputs.propertyChannexId,
            title: inputs.title,
            count_of_rooms: inputs.count_of_rooms,
            occ_adults: inputs.occ_adults,
            occ_children: inputs.occ_children,
            occ_infants: inputs.occ_infants,
            default_occupancy: inputs.default_occupancy,
            facilities: inputs.facilities || [],
            room_kind: inputs.room_kind,
            capacity: inputs.capacity || null,
            content: {
              description: inputs.description,
            },
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
        // console.log('err', err.response.data.errors.details);
        return exits.success(false);
      });
  },
};
