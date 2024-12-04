/**
 * RoomTypeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'RoomTypeController';
module.exports = {
  /**
   * @function create
   * @description Create a new room
   */
  create: async (req, res) => {
    sails.log.info(`${FileName} -  create`);
    let data = _.pick(req.body, [
      'propertyId',
      'title',
      'count_of_rooms',
      'occ_adults',
      'occ_children',
      'occ_infants',
      'default_occupancy',
      'facilities',
      'room_kind',
      'capacity',
      'description',
    ]);
    let result = await RoomType.validateCreateRoomTypes(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let existingRoomByTitle = await RoomType.findOne({ title: data.title });
      if (existingRoomByTitle) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Cannot create Room Type. Dupicate title',
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
      data.uniqueId = sails.config.constants.uuidv4();
      data.propertyChannexId = existingProperty.channexId;
      data.property = existingProperty.id;
      data.group_id = req.user.groupUniqueId;

      let room = await RoomType.create({ ...data }).fetch();
      if (!room) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Created,
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: messages.Room.Created,
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
  update: async (req, res) => {
    sails.log.info(`${FileName} -  update`);
    let id = req.params.id;
    let data = _.pick(req.body, [
      'propertyId',
      'title',
      'count_of_rooms',
      'occ_adults',
      'occ_children',
      'occ_infants',
      'default_occupancy',
      'facilities',
      'room_kind',
      'capacity',
      'description',
    ]);
    let result = await RoomType.validateCreateRoomTypes(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let checkExisting = await RoomType.findOne({ uniqueId: id });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      let existingRoomByTitle = await RoomType.findOne({
        title: data.title,
        uniqueId: { '!=': id },
      });
      if (existingRoomByTitle) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Cannot update Room Type. Dupicate title',
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
      data.propertyChannexId = existingProperty.channexId;
      data.property = existingProperty.id;
      data.channexId = checkExisting.channexId;

      let room = await RoomType.updateOne({ uniqueId: id }, { ...data });
      if (!room) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Updated,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.Room.Updated,
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
          error: messages.Room.Not_Found,
        });
      }
      let checkExisting = await RoomType.findOne({ uniqueId: id });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      let deleteChannexTax = await sails.helpers.deleteChannexRoom.with({
        channexId: checkExisting.channexId,
      });
      if (!deleteChannexTax) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Delete,
        });
      }
      let deletedRoom = await RoomType.destroyOne({ uniqueId: id });
      if (!deletedRoom) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Delete,
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.Room.Deleted,
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

  uploadRoomFiles: async (req, res) => {
    try {
      let owner = req.user.uniqueId;
      let property = req.params.roomId;
      return req.file('files').upload(
        {
          adapter: require('skipper-disk'),
          maxBytes: 1073741824,
        },
        async function onUploadComplete(err, files) {
          if (err) {
            sails.log.error(err);
            return res.status(ResponseCodes.BAD_REQUEST).json({
              status: ResponseCodes.BAD_REQUEST,
              data: '',
              error: err.toString(),
            });
          }
          if (_.isEmpty(files)) {
            return res.status(ResponseCodes.BAD_REQUEST).json({
              status: ResponseCodes.BAD_REQUEST,
              data: '',
              error: 'Room images not found',
            });
          }

          if (!files.length) {
            return res.status(ResponseCodes.BAD_REQUEST).json({
              status: ResponseCodes.BAD_REQUEST,
              data: '',
              error: 'Room images not found',
            });
          }
          for (let i = 0; i < files.length; i++) {
            const contentType =
              req.file('files')._files[i].stream.headers['content-type'];
            const fileName = req.file('files')._files[i].stream.filename;
            let docPath = `${owner}/Room/${property}/file_${Math.floor(
              Date.now()
            )}_${fileName}`;

            let uploadedFile = await sails.helpers.aws.s3Upload(
              files[i].fd,
              docPath,
              process.env.AWS_BUCKET,
              contentType
            );
            if (uploadedFile) {
              let createdImage = await Images.create({
                url: uploadedFile,
                author: owner,
                description: 'Room Image',
                kind: 'photo',
                room: property,
              }).fetch();
            }
          }
          return res.status(ResponseCodes.OK).json({
            status: ResponseCodes.OK,
            data: '',
            success: 'Room file uploaded',
          });
        }
      );
    } catch (error) {
      sails.log.error(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: '',
        error: error.toString(),
      });
    }
  },

  get: async (req, res) => {
    sails.log.info(`${FileName} -  get`);
    try {
      let groupId = req.params.groupId || '';
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;

      let checkExisting = await Group.findOne({ uniqueId: groupId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Group not found',
        });
      }

      let existingRoomtypes = await RoomType.find({
        where: {
          group_id: checkExisting.channexId,
        },
        limit: limit,
        skip: (page - 1) * limit,
      }).populate('property');
      if (!existingRoomtypes) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRoomtypes || [],
        success: messages.Room.Details,
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

  getRoomFiles: async (req, res) => {
    try {
      let roomId = req.params.roomId;
      if (!roomId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      let checkExisting = await RoomType.findOne({ uniqueId: roomId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      let roomImages = await Images.find({
        room: roomId,
        description: 'Room Image',
      });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: roomImages,
        success: 'Room Images',
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

  getById: async (req, res) => {
    sails.log.info(`${FileName} -  get`);
    try {
      let roomTypeId = req.params.id || '';

      let existingRoomtypes = await RoomType.findOne({
        where: {
          uniqueId: roomTypeId,
        },
      }).populate('property');
      if (!existingRoomtypes) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRoomtypes,
        success: messages.Room.Details,
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
  getByPropertyChannexId: async (req, res) => {
    sails.log.info(`${FileName} -  get`);
    try {
      let propertyChannexId = req.params.id || '';

      let existingProperty = await Property.findOne({
        where: {
          channexId: propertyChannexId,
        },
      });
      if (!existingProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Property not found',
        });
      }
      let roomTypes = await RoomType.find({
        propertyChannexId: existingProperty?.channexId,
      });

      for (let i = 0; i < roomTypes.length; i++) {
        roomTypes[i].rooms = await Rooms.find({
          where: {
            roomTypeId: roomTypes[i].uniqueId,
          },
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: roomTypes,
        success: messages.Room.Details,
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
