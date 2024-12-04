/**
 * CheckInController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'CheckInController';
module.exports = {
  /**
   * @function create
   * @description Create a new checkin
   */
  create: async (req, res) => {
    sails.log.info(`${FileName} -  create`);
    let data = _.pick(req.body, [
      'checkInDate',
      'roomType',
      'roomNo',
      'checkOutDate',
      'booking_id',
      'kits_provided',
      'complimentary_provided',
      'no_show',
      'is_room_changed',
      'changedRoomType',
      'is_complimentary_upgrade',
      'notes',
    ]);
    let result = await CheckIn.validateCheckInData(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let existingCheckIn = await CheckIn.find({
        booking_id: data.booking_id,
        changedRoomType: data.changedRoomType,
        roomType: data.roomType,
      });
      if (existingCheckIn && existingCheckIn.length) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Checkin data already exist for the provided booking',
        });
      }
      let existingBooking = await Booking.findOne({
        booking_id: data.booking_id,
      });
      if (!existingBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found. Checkin Failed',
        });
      }

      let existingRoom = await Rooms.findOne({
        uniqueId: data.roomNo,
      });
      if (!existingRoom) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room not found. Checkin Failed',
        });
      }
      // check for availability
      if (data.roomType !== data.changedRoomType) {
        let inventory = await sails.helpers.getChannexInventoryData.with({
          propertyChannexId: existingBooking.property_id,
          startDate: existingBooking.arrival_date,
          endDate: existingBooking.departure_date,
        });
        if (!inventory) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: 'Inventory data not found. Checkin Failed',
          });
        }
        let roomTypeInventoryData = inventory.find(
          (e) => e.channexId == data.changedRoomType
        );
        if (!roomTypeInventoryData) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: 'Inventory room type data not found. Checkin Failed',
          });
        }
        let availabilityFlag = true;
        let dataToUpdate = [];
        for (let i = 0; i < roomTypeInventoryData.availability.length; i++) {
          dataToUpdate.push({
            property_id: existingBooking.property_id,
            room_type_id: data.changedRoomType,
            date: Object.keys(roomTypeInventoryData.availability[i])[0],
            availability:
              Object.values(roomTypeInventoryData.availability[i])[0] - 1,
          });
          if (Object.values(roomTypeInventoryData.availability[i])[0] - 1 < 0) {
            availabilityFlag = false;
            break;
          }
          let checkInData = null;
          if (availabilityFlag) {
            let updatedRoomStatus = await Rooms.updateOne(
              { uniqueId: data.roomNo },
              { status: 'occupied' }
            );
            console.log(dataToUpdate);

            let channexAvailability =
              await sails.helpers.updateChannexAvailability.with({
                data: dataToUpdate,
              });
            checkInData = await CheckIn.create({ ...data }).fetch();
          }
        }
      } else {
        let updatedRoomStatus = await Rooms.updateOne(
          { uniqueId: data.roomNo },
          { status: 'occupied' }
        );
        checkInData = await CheckIn.create({ ...data }).fetch();
      }

      let updatedBooking = await Booking.updateOne(
        { booking_id: data.booking_id },
        { checkInData: data.checkInDate }
      );

      if (!checkInData) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'CheckIn failed',
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: 'Checkin successful',
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
    let checkInId = req.params.id;
    let data = _.pick(req.body, [
      'checkInDate',
      'roomType',
      'roomNo',
      'checkOutDate',
      'booking_id',
      'kits_provided',
      'complimentary_provided',
      'no_show',
      'is_room_changed',
      'changedRoomType',
      'is_complimentary_upgrade',
      'notes',
    ]);

    try {
      let existingCheckIn = await CheckIn.find({
        id: checkInId,
        roomType: data.roomType,
      });
      if (!existingCheckIn && existingCheckIn.length) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Checkin data not found',
        });
      }
      let existingRoom = await Rooms.findOne({
        uniqueId: data.roomNo,
      });
      if (!existingRoom) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room not found. Checkin Failed',
        });
      }
      if (!data.checkOutDate) {
        let updatedRoomStatus = await Rooms.updateOne(
          { uniqueId: data.roomNo },
          { status: 'occupied' }
        );
      }
      if (existingCheckIn.roomNo !== data.roomNo || data.checkOutDate) {
        let updatedOldRoomStatus = await Rooms.updateOne(
          { uniqueId: existingCheckIn.roomNo },
          { status: 'available' }
        );
      }
      let checkInData = await CheckIn.updateOne({ id: checkInId }, { ...data });
      if (!checkInData) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'CheckIn not updated',
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: 'Checkin updated successful',
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

  getByBookingId: async (req, res) => {
    sails.log.info(`${FileName} -  getByBookingId`);
    let booking_id = req.params.bookingId;

    try {
      let existingCheckIn = await CheckIn.find({
        where: { booking_id: booking_id },
        sort: 'createdAt DESC',
      });
      if (!existingCheckIn) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Checkin data not found',
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingCheckIn,
        success: 'Checkin data',
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

  getCurrentByBookingId: async (req, res) => {
    sails.log.info(`${FileName} -  getCurrentByBookingId`);
    let booking_id = req.params.bookingId;

    try {
      let existingCheckIn = await CheckIn.find({
        booking_id: booking_id,
        checkOutDate: 0,
      });
      if (!existingCheckIn) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Checkin data not found',
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingCheckIn,
        success: 'Checkin data',
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

  uploadCheckInFile: async (req, res) => {
    try {
      let owner = req.user.uniqueId;
      let bookingId = req.params.bookingId;
      return req.file('file').upload(
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
              error: 'Files not found',
            });
          }

          if (!files.length) {
            return res.status(ResponseCodes.BAD_REQUEST).json({
              status: ResponseCodes.BAD_REQUEST,
              data: '',
              error: 'files not found',
            });
          }

          const contentType =
            req.file('file')._files[0].stream.headers['content-type'];
          const fileName = req.file('file')._files[0].stream.filename;
          let docPath = `${owner}/Booking/${bookingId}/file_${Math.floor(
            Date.now()
          )}_${fileName}`;

          console.log('tttt', fileName, docPath);

          let uploadedFile = await sails.helpers.aws.s3Upload(
            files[0].fd,
            docPath,
            process.env.AWS_BUCKET,
            contentType
          );
          if (!uploadedFile) {
            return res.status(ResponseCodes.BAD_REQUEST).json({
              status: ResponseCodes.BAD_REQUEST,
              data: '',
              error: 'Fil not uploaded',
            });
          }

          let createdImage = await Images.create({
            url: uploadedFile,
            author: owner,
            description: 'Booking File',
            kind: 'photo',
            booking: bookingId,
          }).fetch();

          return res.status(ResponseCodes.OK).json({
            status: ResponseCodes.OK,
            data: createdImage,
            success: 'Booking file uploaded',
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

  changeRequest: async (req, res) => {
    sails.log.info(`${FileName} -  create`);
    let data = _.pick(req.body, [
      'checkInDate',
      'roomType',
      'roomNo',
      'checkOutDate',
      'booking_id',
      'kits_provided',
      'complimentary_provided',
      'no_show',
      'is_room_changed',
      'changedRoomType',
      'is_complimentary_upgrade',
      'notes',
    ]);
    let result = await CheckIn.validateCheckInData(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let existingCheckIn = await CheckIn.find({
        booking_id: data.booking_id,
        roomType: data.roomType,
        checkOutDate: data.checkOutDate,
      });
      let existingBooking = await Booking.findOne({
        booking_id: data.booking_id,
      });
      if (!existingBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found. Checkin Failed',
        });
      }
      let existingRoom = await Rooms.findOne({
        uniqueId: data.roomNo,
      });
      if (!existingRoom) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room not found. Checkin Failed',
        });
      }

      // check for availability
      let inventory = await sails.helpers.getChannexInventoryData.with({
        propertyChannexId: existingBooking.property_id,
        startDate: existingBooking.arrival_date,
        endDate: existingBooking.departure_date,
      });
      if (!inventory) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Inventory data not found. Checkin Failed',
        });
      }
      let roomTypeInventoryData = inventory.find(
        (e) => e.channexId == data.changedRoomType
      );
      if (!roomTypeInventoryData) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Inventory room type data not found. Checkin Failed',
        });
      }
      let availabilityFlag = true;
      let dataToUpdate = [];
      for (let i = 0; i < roomTypeInventoryData.availability.length; i++) {
        dataToUpdate.push({
          property_id: existingBooking.property_id,
          room_type_id: data.changedRoomType,
          date: Object.keys(roomTypeInventoryData.availability[i])[0],
          availability:
            Object.values(roomTypeInventoryData.availability[i])[0] - 1,
        });
        if (Object.values(roomTypeInventoryData.availability[i])[0] - 1 < 0) {
          availabilityFlag = false;
          break;
        }
      }
      //

      if (availabilityFlag) {
        console.log('dataToUpdate', dataToUpdate);
        let channexAvailability =
          await sails.helpers.updateChannexAvailability.with({
            data: dataToUpdate,
          });
        // check for addition to previous room type

        let previousRoomTypeInventoryData = inventory.find(
          (e) => e.channexId == existingCheckIn[0].changedRoomType
        );
        if (!previousRoomTypeInventoryData) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: 'Inventory room type data not found. Checkin Failed',
          });
        }
        let previousDataToUpdate = [];
        for (
          let i = 0;
          i < previousRoomTypeInventoryData.availability.length;
          i++
        ) {
          previousDataToUpdate.push({
            property_id: existingBooking.property_id,
            room_type_id: existingCheckIn[0].changedRoomType,
            date: Object.keys(previousRoomTypeInventoryData.availability[i])[0],
            availability:
              Object.values(previousRoomTypeInventoryData.availability[i])[0] +
              1,
          });
        }

        console.log('previousDataToUpdate', previousDataToUpdate);
        let previousChannexAvailability =
          await sails.helpers.updateChannexAvailability.with({
            data: previousDataToUpdate,
          });
        //
        if (existingCheckIn && existingCheckIn.length) {
          let updateExisting = await CheckIn.update(
            {
              booking_id: data.booking_id,
              roomType: data.roomType,
              checkOutDate: 0,
            },
            { checkOutDate: data.checkOutDate }
          );
          let updateRoomStatus = await Rooms.update(
            { uniqueId: existingCheckIn[0].roomNo },
            { status: 'available' }
          );
        }

        let updatedRoomStatus = await Rooms.updateOne(
          { uniqueId: data.roomNo },
          { status: 'occupied' }
        );
        delete data.checkOutDate;

        let checkInData = await CheckIn.create({ ...data }).fetch();
        if (!checkInData) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: 'CheckIn failed',
          });
        }
        return res.status(ResponseCodes.CREATED).json({
          status: ResponseCodes.CREATED,
          data: {},
          success: 'Checkin successful',
          error: '',
        });
      } else {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'CheckIn failed',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: '',
        error: error.toString(),
      });
    }
  },

  noShow: async (req, res) => {
    try {
      let booking_id = req.params.booking_id || '';
      let existingBooking = await Booking.findOne({
        booking_id: booking_id,
      });
      if (!existingBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found. No show process failed',
        });
      }
      let roomsData = await BookingRooms.find({
        bookingChannexId: existingBooking.booking_id,
      });
      let inventory = await sails.helpers.getChannexInventoryData.with({
        propertyChannexId: existingBooking.property_id,
        startDate: existingBooking.arrival_date,
        endDate: existingBooking.departure_date,
      });
      if (!inventory) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Inventory data not found. Checkin Failed',
        });
      }
      roomsData.forEach(async (one) => {
        // check for addition to previous room type

        let previousRoomTypeInventoryData = inventory.find(
          (e) => e.channexId == one.room_type_id
        );
        if (!previousRoomTypeInventoryData) {
          return;
        }
        let previousDataToUpdate = [];
        for (
          let i = 0;
          i < previousRoomTypeInventoryData.availability.length;
          i++
        ) {
          previousDataToUpdate.push({
            property_id: existingBooking.property_id,
            room_type_id: one.room_type_id,
            date: Object.keys(previousRoomTypeInventoryData.availability[i])[0],
            availability:
              Object.values(previousRoomTypeInventoryData.availability[i])[0] +
              1,
          });
        }

        console.log('previousDataToUpdate', previousDataToUpdate);
        let previousChannexAvailability =
          await sails.helpers.updateChannexAvailability.with({
            data: previousDataToUpdate,
          });
        //
      });
      let updatedBooking = await Booking.updateOne(
        { booking_id },
        { no_show: true }
      );
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'No show update successful',
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

  checkout: async (req, res) => {
    try {
      let data = _.pick(req.body, ['checkOutDate']);
      let booking_id = req.params.booking_id || '';
      let existingBooking = await Booking.findOne({
        booking_id: booking_id,
      });
      if (!existingBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found. No show process failed',
        });
      }
      let roomsData = await BookingRooms.find({
        bookingChannexId: existingBooking.booking_id,
      });
      let inventory = await sails.helpers.getChannexInventoryData.with({
        propertyChannexId: existingBooking.property_id,
        startDate: existingBooking.arrival_date,
        endDate: existingBooking.departure_date,
      });
      if (!inventory) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Inventory data not found. Checkin Failed',
        });
      }
      roomsData.forEach(async (one) => {
        // check for addition to previous room type
        let existingCheckIn = await CheckIn.find({
          booking_id: data.booking_id,
          roomType: one.room_type_id,
          checkOutDate: 0,
        });
        if (existingCheckIn && existingCheckIn.length) {
          let previousRoomTypeInventoryData = inventory.find(
            (e) => e.channexId == one.room_type_id
          );
          if (!previousRoomTypeInventoryData) {
            return;
          }
          let previousDataToUpdate = [];
          for (
            let i = 0;
            i < previousRoomTypeInventoryData.availability.length;
            i++
          ) {
            previousDataToUpdate.push({
              property_id: existingBooking.property_id,
              room_type_id: one.room_type_id,
              date: Object.keys(
                previousRoomTypeInventoryData.availability[i]
              )[0],
              availability:
                Object.values(
                  previousRoomTypeInventoryData.availability[i]
                )[0] + 1,
            });
          }

          console.log('previousDataToUpdate', previousDataToUpdate);
          let previousChannexAvailability =
            await sails.helpers.updateChannexAvailability.with({
              data: previousDataToUpdate,
            });
          //
          let getExistingCheckIn = CheckIn.find({
            booking_id: booking_id,
            roomType: one.room_type_id,
            checkOutDate: 0,
          });
          if (getExistingCheckIn && getExistingCheckIn.length) {
            getExistingCheckIn.forEach(async (checkIn) => {
              let updatedRoomStatus = await Rooms.updateOne(
                { uniqueId: checkIn.roomNo },
                { status: 'available' }
              );
            });
          }
          await CheckIn.update(
            {
              booking_id: booking_id,
              roomType: one.room_type_id,
              checkOutDate: 0,
            },
            { checkOutDate: data.checkOutDate }
          );

          let updatedBooking = await Booking.updateOne(
            { booking_id },
            { checkOutDate: data.checkOutDate }
          );
        }
      });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'Checkout successful',
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

  cancelBooking: async (req, res) => {
    try {
      let booking_id = req.params.booking_id || '';
      let data = _.pick(req.body, ['cancel_policy']);
      let existingBooking = await Booking.findOne({
        booking_id: booking_id,
      });
      if (!existingBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found. No show process failed',
        });
      }
      let roomsData = await BookingRooms.find({
        bookingChannexId: existingBooking.booking_id,
      });
      let inventory = await sails.helpers.getChannexInventoryData.with({
        propertyChannexId: existingBooking.property_id,
        startDate: existingBooking.arrival_date,
        endDate: existingBooking.departure_date,
      });
      if (!inventory) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Inventory data not found. Checkin Failed',
        });
      }
      roomsData.forEach(async (one) => {
        // check for addition to previous room type

        let previousRoomTypeInventoryData = inventory.find(
          (e) => e.channexId == one.room_type_id
        );
        if (!previousRoomTypeInventoryData) {
          return;
        }
        let previousDataToUpdate = [];
        for (
          let i = 0;
          i < previousRoomTypeInventoryData.availability.length;
          i++
        ) {
          previousDataToUpdate.push({
            property_id: existingBooking.property_id,
            room_type_id: one.room_type_id,
            date: Object.keys(previousRoomTypeInventoryData.availability[i])[0],
            availability:
              Object.values(previousRoomTypeInventoryData.availability[i])[0] +
              1,
          });
        }

        console.log('previousDataToUpdate', previousDataToUpdate);
        let previousChannexAvailability =
          await sails.helpers.updateChannexAvailability.with({
            data: previousDataToUpdate,
          });
        //
      });
      let updatedBooking = await Booking.updateOne(
        { booking_id },
        { cancel_policy: data.cancel_policy, status: 'cancel' }
      );
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'Booking cancelled successful',
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
};
