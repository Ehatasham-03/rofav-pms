/**
 * RoomsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'RoomsController';
module.exports = {
  createAndUpdate: async (req, res) => {
    try {
      let data = _.pick(req.body, ['propertyId', 'roomTypeId', 'roomsData']);
      if (!data.propertyId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      if (!data.roomTypeId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      let existingProperty = await Property.findOne({
        uniqueId: data.propertyId,
      });
      if (!existingProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      let existingRoomType = await RoomType.findOne({
        uniqueId: data.roomTypeId,
      });
      if (!existingRoomType) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      if (!Array.isArray(data.roomsData)) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Invalid data format',
        });
      }
      for (let i = 0; i < data.roomsData.length; i++) {
        let result = await Rooms.validateRoomData(data.roomsData[i]);
        if (result['hasError']) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: result['errors'],
          });
        }
      }
      let dataToCreate = [];
      let dataToUpdate = [];
      data.roomsData.forEach((el) => {
        if (el.uniqueId) {
          dataToUpdate.push({
            ...el,
            propertyId: existingProperty.uniqueId,
            roomTypeId: existingRoomType.uniqueId,
            property: existingProperty.id,
            roomType: existingRoomType.id,
          });
        } else {
          dataToCreate.push({
            ...el,
            uniqueId: sails.config.constants.uuidv4(),
            propertyId: existingProperty.uniqueId,
            roomTypeId: existingRoomType.uniqueId,
            property: existingProperty.id,
            roomType: existingRoomType.id,
          });
        }
      });
      if (dataToCreate.length > 0) {
        let createdData = await Rooms.createEach(dataToCreate).fetch();
        console.log(createdData);
      }
      if (dataToUpdate.length > 0) {
        dataToUpdate.forEach(async (el) => {
          let updatedData = await Rooms.updateOne(
            { uniqueId: el.uniqueId },
            el
          );
          console.log(updatedData);
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'Room Data updated successfully',
        error: '',
      });
    } catch (error) {
      console.log(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: '',
        error: error.toString(),
      });
    }
  },

  /**
   * Delete Room
   */

  delete: async (req, res) => {
    try {
      let id = req.params.id;
      if (!id) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room not found',
        });
      }
      let checkExisting = await Rooms.findOne({ uniqueId: id });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room not found',
        });
      }
      let deletedRoom = await Rooms.destroyOne({ uniqueId: id });
      if (!deletedRoom) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room not deleted',
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'Room deleted successfully',
      });
    } catch (error) {
      sails.log.error(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: '',
        error: error.toString(),
      });
    }
  },

  getRoomsList: async (req, res) => {
    sails.log.info(`${FileName} -  getRoomsList`);
    try {
      let roomTypeId = req.params.roomTypeId || '';

      let checkExisting = await RoomType.findOne({ uniqueId: roomTypeId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room type not found',
        });
      }

      let existingRooms = await Rooms.find({
        where: {
          roomTypeId: checkExisting.uniqueId,
        },
      })
        .populate('property')
        .populate('roomType');
      if (!existingRooms) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Rooms not  found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRooms || [],
        success: 'Rooms details',
        error: '',
      });
    } catch (error) {
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: '',
        error: error.toString(),
      });
    }
  },
};
