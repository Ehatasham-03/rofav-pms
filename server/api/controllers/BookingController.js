/**
 * BookingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'BookingController';
module.exports = {
  createWebhook: async (req, res) => {
    try {
      let data = _.pick(req.body, ['propertyChannexId']);
      let verifyProperty = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!verifyProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      let createdWebhook = await sails.helpers.createChannexWebhook.with({
        property_id: verifyProperty.channexId,
      });
      if (!createdWebhook) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Webhook not created',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: createdWebhook,
        success: 'Webhook created successfully',
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

  webhook: async (req, res) => {
    try {
      let data = _.pick(req.body, ['event', 'payload']);
      if (data.event == 'booking') {
        let propertyChannexId = data.payload.property_id;
        let verifyProperty = await Property.findOne({
          channexId: propertyChannexId,
        });
        const payload = data.payload;
        if (verifyProperty) {
          if (payload.revision_id) {
            let revisionData = await sails.helpers.getChannexRevisionData.with({
              revision_id: payload.revision_id,
            });
            let verifyExistingBooking = await Booking.findOne({
              booking_id: payload.booking_id,
            });
            if (verifyExistingBooking) {
              delete revisionData.id;
              let updatedBooking = await Booking.updateOne(
                {
                  booking_id: revisionData.booking_id,
                },
                {
                  ...revisionData,
                  is_acknowledged: false,
                }
              );
              let updatedCustomer = await Customer.updateOne(
                {
                  bookingChannexId: revisionData.booking_id,
                },
                revisionData.customer
              ).fetch();
              // Delete previous existing Data and create new Data for following updated booking
              let deletedRooms = await BookingRooms.destroy({
                bookingChannexId: revisionData.booking_id,
              });
              let deletedCancelPenalties = await BookingCancelPenalties.destroy(
                { bookingChannexId: revisionData.booking_id }
              );
              let deletedDaysBreakdown = await BookingDayBreakdown.destroy({
                bookingChannexId: revisionData.booking_id,
              });
              let deletedPromotions = await BookingPromotions.destroy({
                bookingChannexId: revisionData.booking_id,
              });
              let deletedTaxes = await BookingTaxes.destroy({
                bookingChannexId: revisionData.booking_id,
              });
              let deletedGuests = await BookingGuests.destroy({
                bookingChannexId: revisionData.booking_id,
              });
              let deletedServices = await BookingServices.destroy({
                bookingChannexId: revisionData.booking_id,
              });

              // Create Again with newly updated data
              revisionData.rooms.forEach(async (one) => {
                let createdRoom = await BookingRooms.create({
                  ...one,
                  bookingChannexId: revisionData.booking_id,
                  propertyChannexId,
                }).fetch();
                let cancelPenaltyDataToCreate = one.cancel_penalties
                  ? one.cancel_penalties.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: revisionData.booking_id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (cancelPenaltyDataToCreate.length) {
                  let createdCancelPenalties =
                    await BookingCancelPenalties.createEach(
                      cancelPenaltyDataToCreate
                    ).fetch();
                }
                let dayBreakdownDataToCreate = one.days_breakdown
                  ? one.days_breakdown.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: revisionData.booking_id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (dayBreakdownDataToCreate.length) {
                  let createdDayBreakdown =
                    await BookingDayBreakdown.createEach(
                      dayBreakdownDataToCreate
                    ).fetch();
                }
                let promotionDataToCreate = one.promotion
                  ? one.promotion.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: revisionData.booking_id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (promotionDataToCreate.length) {
                  let createdPromotion = await BookingPromotions.createEach(
                    promotionDataToCreate
                  ).fetch();
                }

                let guestDataToCreate = one.guests
                  ? one.guests.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: revisionData.booking_id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (guestDataToCreate.length) {
                  let createdGuests = await BookingGuests.createEach(
                    guestDataToCreate
                  ).fetch();
                }
                let taxesDataToCreate = one.taxes
                  ? one.taxes.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: revisionData.booking_id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (taxesDataToCreate.length) {
                  let createdTaxes = await BookingTaxes.createEach(
                    taxesDataToCreate
                  ).fetch();
                }
                let servicesDataToCreate = one.services
                  ? one.services.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: revisionData.booking_id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (servicesDataToCreate.length) {
                  let createdServices = await BookingServices.createEach(
                    servicesDataToCreate
                  ).fetch();
                }
              });
            } else {
              let bookingData = await sails.helpers.getChannexBookingData.with({
                booking_id: payload.booking_id,
              });
              console.log(bookingData);
              delete bookingData.id;
              let createdBooking = await Booking.create({
                ...bookingData,
                is_acknowledged: false,
              }).fetch();
              bookingData.id = bookingData.booking_id;
              let createdCustomer = await Customer.create({
                ...bookingData.customer,
                bookingChannexId: bookingData.id,
                propertyChannexId,
              }).fetch();
              bookingData.rooms.forEach(async (one) => {
                let createdRoom = await BookingRooms.create({
                  ...one,
                  bookingChannexId: bookingData.id,
                  propertyChannexId,
                }).fetch();
                let cancelPenaltyDataToCreate = one.cancel_penalties
                  ? one.cancel_penalties.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: bookingData.id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (cancelPenaltyDataToCreate.length) {
                  let createdCancelPenalties =
                    await BookingCancelPenalties.createEach(
                      cancelPenaltyDataToCreate
                    ).fetch();
                }
                let dayBreakdownDataToCreate = one.days_breakdown
                  ? one.days_breakdown.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: bookingData.id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (dayBreakdownDataToCreate.length) {
                  let createdDayBreakdown =
                    await BookingDayBreakdown.createEach(
                      dayBreakdownDataToCreate
                    ).fetch();
                }
                let promotionDataToCreate = one.promotion
                  ? one.promotion.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: bookingData.id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (promotionDataToCreate.length) {
                  let createdPromotion = await BookingPromotions.createEach(
                    promotionDataToCreate
                  ).fetch();
                }

                let guestDataToCreate = one.guests
                  ? one.guests.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: bookingData.id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (guestDataToCreate.length) {
                  let createdGuests = await BookingGuests.createEach(
                    guestDataToCreate
                  ).fetch();
                }
                let taxesDataToCreate = one.taxes
                  ? one.taxes.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: bookingData.id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (taxesDataToCreate.length) {
                  let createdTaxes = await BookingTaxes.createEach(
                    taxesDataToCreate
                  ).fetch();
                }
                let servicesDataToCreate = one.services
                  ? one.services.map((e) => {
                      return {
                        ...e,
                        bookingChannexId: bookingData.id,
                        propertyChannexId,
                        bookingRoomId: createdRoom.id,
                      };
                    })
                  : [];
                if (servicesDataToCreate.length) {
                  let createdServices = await BookingServices.createEach(
                    servicesDataToCreate
                  ).fetch();
                }
              });
            }
          } else {
            let bookingData = await sails.helpers.getChannexBookingData.with({
              booking_id: payload.booking_id,
            });
            console.log(bookingData);
            delete bookingData.id;
            let createdBooking = await Booking.create({
              ...bookingData,
              is_acknowledged: false,
            }).fetch();
            bookingData.id = bookingData.booking_id;
            let createdCustomer = await Customer.create({
              ...bookingData.customer,
              bookingChannexId: bookingData.id,
              propertyChannexId,
            }).fetch();
            bookingData.rooms.forEach(async (one) => {
              let createdRoom = await BookingRooms.create({
                ...one,
                bookingChannexId: bookingData.id,
                propertyChannexId,
              }).fetch();
              let cancelPenaltyDataToCreate = one.cancel_penalties
                ? one.cancel_penalties.map((e) => {
                    return {
                      ...e,
                      bookingChannexId: bookingData.id,
                      propertyChannexId,
                      bookingRoomId: createdRoom.id,
                    };
                  })
                : [];
              if (cancelPenaltyDataToCreate.length) {
                let createdCancelPenalties =
                  await BookingCancelPenalties.createEach(
                    cancelPenaltyDataToCreate
                  ).fetch();
              }
              let dayBreakdownDataToCreate = one.days_breakdown
                ? one.days_breakdown.map((e) => {
                    return {
                      ...e,
                      bookingChannexId: bookingData.id,
                      propertyChannexId,
                      bookingRoomId: createdRoom.id,
                    };
                  })
                : [];
              if (dayBreakdownDataToCreate.length) {
                let createdDayBreakdown = await BookingDayBreakdown.createEach(
                  dayBreakdownDataToCreate
                ).fetch();
              }
              let promotionDataToCreate = one.promotion
                ? one.promotion.map((e) => {
                    return {
                      ...e,
                      bookingChannexId: bookingData.id,
                      propertyChannexId,
                      bookingRoomId: createdRoom.id,
                    };
                  })
                : [];
              if (promotionDataToCreate.length) {
                let createdPromotion = await BookingPromotions.createEach(
                  promotionDataToCreate
                ).fetch();
              }

              let guestDataToCreate = one.guests
                ? one.guests.map((e) => {
                    return {
                      ...e,
                      bookingChannexId: bookingData.id,
                      propertyChannexId,
                      bookingRoomId: createdRoom.id,
                    };
                  })
                : [];
              if (guestDataToCreate.length) {
                let createdGuests = await BookingGuests.createEach(
                  guestDataToCreate
                ).fetch();
              }
              let taxesDataToCreate = one.taxes
                ? one.taxes.map((e) => {
                    return {
                      ...e,
                      bookingChannexId: bookingData.id,
                      propertyChannexId,
                      bookingRoomId: createdRoom.id,
                    };
                  })
                : [];
              if (taxesDataToCreate.length) {
                let createdTaxes = await BookingTaxes.createEach(
                  taxesDataToCreate
                ).fetch();
              }
              let servicesDataToCreate = one.services
                ? one.services.map((e) => {
                    return {
                      ...e,
                      bookingChannexId: bookingData.id,
                      propertyChannexId,
                      bookingRoomId: createdRoom.id,
                    };
                  })
                : [];
              if (servicesDataToCreate.length) {
                let createdServices = await BookingServices.createEach(
                  servicesDataToCreate
                ).fetch();
              }
            });
          }
        }
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        success: 'Data received successfully',
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

  getBookingsList: async (req, res) => {
    try {
      let data = {
        propertyChannexId: req.params.propertyChannexId,
      };
      let verifyProperty = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!verifyProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      let query = `SELECT DISTINCT *
      FROM Booking 
      WHERE checkInDate = 0 AND no_show = 0 AND status != 'cancel' AND property_id = '${verifyProperty.channexId}';
      `;
      let bookings = await sails.sendNativeQuery(query);
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: bookings.recordset || [],
        success: 'Booking data fetched successfully',
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

  getBookingDetails: async (req, res) => {
    try {
      let data = {
        bookingId: req.params.bookingId,
      };
      let verifyBooking = await Booking.findOne({
        booking_id: data.bookingId,
      });
      if (!verifyBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found',
        });
      }
      let customerData = await Customer.findOne({
        bookingChannexId: verifyBooking.booking_id,
      });
      let roomsData = await BookingRooms.find({
        bookingChannexId: verifyBooking.booking_id,
      });
      roomsData.forEach(async (one) => {
        one.guest = await BookingGuests.find({
          bookingRoomId: one.id,
        });
        one.cancel_penalties = await BookingCancelPenalties.find({
          bookingRoomId: one.id,
        });
        one.days_breakdown = await BookingDayBreakdown.find({
          bookingRoomId: one.id,
        });
        one.promotion = await BookingPromotions.find({
          bookingRoomId: one.id,
        });
        one.services = await BookingServices.find({
          bookingRoomId: one.id,
        });
        one.taxes = await BookingTaxes.find({
          bookingRoomId: one.id,
        });
      });
      let guests = await BookingGuests.find({
        bookingChannexId: verifyBooking.booking_id,
      });

      let bookingImages = await Images.find({
        booking: verifyBooking.booking_id,
        description: 'Booking Additional File',
      });

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {
          booking: {
            ...verifyBooking,
            customer: customerData,
            rooms: roomsData,
            guests,
            bookingImages,
          },
        },
        success: 'Booking data fetched successfully',
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

  acknowledgeBookingRevision: async (req, res) => {
    try {
      let revision_id = req.params.revision_id;
      let result = await sails.helpers.channexAcknowledgeBookingRevision.with({
        revision_id,
      });
      let updateBooking = await Booking.updateOne({
        revision_id,
      }).set({ is_acknowledged: true });
      if (!result) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking revision not acknowledged',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: result,
        success: 'Booking revision acknowledged successfully',
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

  uploadBookingAdditionalDocuments: async (req, res) => {
    try {
      let owner = req.user.uniqueId;
      let bookingId = req.params.bookingId;
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

          console.log(req.file('files'));

          const contentType =
            req.file('files')._files[0].stream.headers['content-type'];
          const fileName = req.file('files')._files[0].stream.filename;
          let docPath = `${owner}/Booking/${bookingId}/Additional_Documents/file_${Math.floor(
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
            description: 'Booking Additional File',
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

  getBookingFiles: async (req, res) => {
    try {
      let bookingId = req.params.bookingId;
      if (!bookingId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found',
        });
      }
      let checkExisting = await Booking.findOne({ booking_id: bookingId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found',
        });
      }
      let bookingImages = await Images.find({
        booking: bookingId,
        description: 'Booking Additional File',
      });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: bookingImages,
        success: 'Booking images data',
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

  getBookingsListInHouse: async (req, res) => {
    try {
      let data = {
        propertyChannexId: req.params.propertyChannexId,
      };
      let verifyProperty = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!verifyProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      let query = `SELECT DISTINCT b.*
      FROM Booking b
      JOIN Checkin c ON b.booking_id = c.booking_id
      WHERE c.checkoutDate = 0 AND b.no_show = 0 AND b.status != 'cancel' AND b.property_id = '${verifyProperty.channexId}';
      `;
      let bookings = await sails.sendNativeQuery(query);
      // let bookings = await Booking.find({
      //   property_id: verifyProperty.channexId,
      // });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: bookings.recordset || [],
        success: 'Booking data fetched successfully',
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

  getBookingsListHistory: async (req, res) => {
    try {
      let data = {
        propertyChannexId: req.params.propertyChannexId,
      };
      let verifyProperty = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!verifyProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      let query = `SELECT DISTINCT *
      FROM Booking
      WHERE (checkoutDate > 0 OR no_show = 1 OR status='cancel') AND property_id = '${verifyProperty.channexId}';
      `;
      let bookings = await sails.sendNativeQuery(query);
      // let bookings = await Booking.find({
      //   property_id: verifyProperty.channexId,
      // });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: bookings.recordset || [],
        success: 'Booking data fetched successfully',
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

  createManualBooking: async (req, res) => {
    try {
      let data = _.pick(req.body, [
        'amount',
        'arrival_date',
        'departure_date',
        'property_id',
        'status',
        'is_acknowledged',
        'is_manual',
        'room_type_id',
        'propertyChannexId',
        'occupancy',
        'rate_plan_id',
        'booking_type',
        'company_name',
        'company_address',
        'company_gst',
        'discount_amount',
        'discount_percent',
        'room_count',
        'guests',
      ]);
      data.discount_amount = Number(data.discount_amount);
      data.discount_percent = Number(data.discount_percent);

      data.booking_id = sails.config.constants.uuidv4();
      data.booking_room_id = sails.config.constants.uuidv4();
      data.ota_name = 'RofabsWeb';

      let result = await Booking.validateManualBookingData(data);
      console.log(result);
      if (result['hasError']) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Required_Field_Missing,
        });
      }
      data.checkin_date = data.arrival_date;
      data.checkout_date = data.departure_date;

      let createdBooking = await Booking.create({ ...data }).fetch();
      if (!createdBooking) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not created',
        });
      }
      data.bookingChannexId = createdBooking.booking_id;
      let createdBookingRoom = await BookingRooms.create({ ...data }).fetch();
      if (!createdBookingRoom) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking room not created',
        });
      }
      let guestDataToCreate = [];
      data.guests.forEach((one) => {
        guestDataToCreate.push({
          name: one.guest_name,
          email: one.guest_email,
          phone: one.guest_phone,
          bookingChannexId: data.bookingChannexId,
          propertyChannexId: data.propertyChannexId,
        });
      });
      let createdGuest = await BookingGuests.createEach(
        guestDataToCreate
      ).fetch();
      if (!createdGuest) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Guest data not created',
        });
      }

      // check for availability
      let inventory = await sails.helpers.getChannexInventoryData.with({
        propertyChannexId: createdBooking.property_id,
        startDate: createdBooking.arrival_date,
        endDate: createdBooking.departure_date,
      });
      if (!inventory) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Inventory data not found. Checkin Failed',
        });
      }
      console.log(inventory);
      
      let roomTypeInventoryData = inventory.find(
        (e) => e.channexId == data.room_type_id
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
          property_id: createdBooking.property_id,
          room_type_id: data.room_type_id,
          date: Object.keys(roomTypeInventoryData.availability[i])[0],
          availability:
            Object.values(roomTypeInventoryData.availability[i])[0] - 1,
        });
        if (Object.values(roomTypeInventoryData.availability[i])[0] - 1 < 0) {
          availabilityFlag = false;
          break;
        }
      }
      if (availabilityFlag) {
        let channexAvailability =
          await sails.helpers.updateChannexAvailability.with({
            data: dataToUpdate,
          });
      }
      ///////////////////////////////////////////////////////////////
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'Manual booking data created successfully',
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
