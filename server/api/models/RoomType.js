/**
 * RoomType.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    uniqueId: {
      type: 'string',
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
    property: {
      model: 'property',
    },
    group_id: {
      type: 'string',
    },
    channexId: {
      type: 'string',
    },
  },
  beforeCreate: async function (room, cb) {
    let channexRes = await sails.helpers.createChannexRoom.with({
      propertyChannexId: room.propertyChannexId,
      title: room.title,
      count_of_rooms: room.count_of_rooms,
      occ_adults: room.occ_adults,
      occ_children: room.occ_children,
      occ_infants: room.occ_infants,
      default_occupancy: room.default_occupancy,
      facilities: room.facilities || [],
      room_kind: room.room_kind,
      capacity: room.capacity || null,
      description: room.description,
    });
    if (!channexRes) {
      return cb(new Error('Channex Room not created'));
    }
    room.uniqueId = channexRes;
    room.channexId = channexRes;
    return cb();
  },
  beforeUpdate: async function (room, cb) {
    let channexRes = await sails.helpers.updateChannexRoom.with({
      roomId: room.channexId,
      propertyChannexId: room.propertyChannexId,
      title: room.title,
      count_of_rooms: room.count_of_rooms,
      occ_adults: room.occ_adults,
      occ_children: room.occ_children,
      occ_infants: room.occ_infants,
      default_occupancy: room.default_occupancy,
      facilities: room.facilities || [],
      room_kind: room.room_kind,
      capacity: room.capacity || null,
      description: room.description,
    });
    if (!channexRes) {
      return cb(new Error('Channex Room not updated'));
    }
    return cb();
  },
  validateCreateRoomTypes: async (data) => {
    let rules = {
      title: 'required|string|max:50',
      propertyId: 'required|string',
      count_of_rooms: 'required|integer|min:0',
      occ_adults: 'required|integer|min:0',
      occ_children: 'required|integer|min:0',
      occ_infants: 'required|integer|min:0',
      default_occupancy: 'required|integer|min:0',
      facilities: 'array',
      room_kind: 'required|string|in:' + 'room' + ',' + 'dorm' + ',',
      capacity: 'integer|min:0',
      description: 'string',
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
