/**
 * BookingGuestsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'BookingGuestsController';
const handlebars = require('handlebars');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
module.exports = {
  /**
   * @function create guest
   * @description Create a new guest
   */
  createGuest: async (req, res) => {
    sails.log.info(`${FileName} -  createGuest`);
    try {
      let data = _.pick(req.body, [
        'email',
        'phone',
        'dob',
        'name',
        'surname',
        'bookingChannexId',
        'propertyChannexId',
        'bookingRoomId',
        'idNumber',
        'idType',
        'issuing_country',
        'issuing_city',
        'id_image',
        'live_image',
        'expiryDate',
        'is_primary',
      ]);

      let result = await BookingGuests.validateGuestData(data);
      if (result['hasError']) {
        console.log(result['errors']);
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Required_Field_Missing,
        });
      }

      let guest = await BookingGuests.create({ ...data }).fetch();

      if (!guest) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Guest not created',
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: messages.User.Created,
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

  updateGuest: async (req, res) => {
    sails.log.info(`${FileName} -  createGuest`);
    try {
      let guestId = req.params.id || '';
      let data = _.pick(req.body, [
        'email',
        'phone',
        'dob',
        'name',
        'surname',
        'bookingChannexId',
        'propertyChannexId',
        'bookingRoomId',
        'idNumber',
        'idType',
        'issuing_country',
        'issuing_city',
        'id_image',
        'live_image',
        'expiryDate',
        'is_primary',
      ]);

      let guest = await BookingGuests.updateOne({ id: guestId }, { ...data });

      if (!guest) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Guest not updated',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: 'Guest updated successfully',
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

  getBookingGuests: async (req, res) => {
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
      let guests = await BookingGuests.find({
        bookingChannexId: verifyBooking.booking_id,
      });

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: guests,
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

  printGrc: async (req, res) => {
    sails.log.info(`${FileName} -  printGrc`);
    try {
      let bookingData = await Booking.findOne({ id: req.params.bookingId });

      if (!bookingData) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Booking not found',
        });
      }
      let primaryGuest = await BookingGuests.find({
        bookingChannexId: bookingData.booking_id,
        is_primary: true,
      });

      if (!primaryGuest || !primaryGuest[0]) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Primary Guest not found',
        });
      }

      let roomsData = await BookingRooms.find({
        bookingChannexId: bookingData.booking_id,
      });

      if (primaryGuest[0]) {
        await fs.readFile(
          'assets/templates/grc.html',
          { encoding: 'utf-8' },
          async (error, html) => {
            if (error)
              return res.status(ResponseCodes.BAD_REQUEST).json({
                status: ResponseCodes.BAD_REQUEST,
                data: '',
                error: error,
              });
            if (html) {
              let template = handlebars.compile(html);
              let guest = primaryGuest[0];
              let roomData = roomsData[0];
              let roomType = await RoomType.findOne({
                channexId: roomData.room_type_id,
              });
              let ratePlan = null;
              if (roomType) {
                ratePlan = await RatePlans.findOne({
                  channexId: roomData.rate_plan_id,
                });
              }

              function calculateNights(startDate, endDate) {
                // Parse the dates
                const start = new Date(startDate);
                const end = new Date(endDate);

                // Calculate the difference in time
                const timeDifference = end - start;

                // Convert time difference from milliseconds to days
                const nights = timeDifference / (1000 * 3600 * 24);

                return nights;
              }

              let replacements = {
                name: guest.name + ' ' + guest.surname,
                email: `${guest.email}`,
                phone: guest.phone,
                fax: '',
                mobile: guest.phone,
                city: `${guest.issuing_city}`,
                address: '',
                country: `${guest.issuing_country}`,
                id_name_number: guest.idType + ' - ' + guest.idNumber,
                arrivalDate: bookingData.arrival_date,
                departureDate: bookingData.departure_date,
                nights: calculateNights(
                  bookingData.arrival_date,
                  bookingData.departure_date
                ),
                roomType: roomType ? roomType.title : '',
                arrivalTime: bookingData.arrival_hour,
                departureTime: '',
                rateType: ratePlan ? ratePlan.title : '',
                paymentType: bookingData.payment_type,
              };
              let pdfName = sails.config.constants.uuidv4();
              let htmlToSend = template(replacements);
              const browser = await puppeteer.launch({
                headless: true,
                executablePath: '',
                args: [
                  '--no-sandbox',
                  '--headless',
                  '--disable-gpu',
                  '--disable-dev-shm-usage',
                ],
              });

              const page = await browser.newPage();
              await page.setContent(htmlToSend);
              page.addStyleTag({ content: '@page {size:A4 landscape}' });
              sails.log.info('here', process.cwd());
              const pdfBuffer = await page.pdf({
                format: 'A4',
              });
              sails.log.info('Buffer', pdfBuffer);
              await page.pdf({
                format: 'A4',
                path: process.cwd() + '/assets/PDF/' + pdfName + '.pdf',
              });
              let filePath = process.cwd() + '/assets/PDF/' + pdfName + '.pdf';
              console.log(filePath);
              if (fs.existsSync(filePath)) {
                sails.log.info(filePath);

                // Getting and setting the content type of the response
                res.set('Content-Type', 'application/pdf');
                res.set('Content-disposition', 'attachment');

                let filestream = fs.createReadStream(filePath);
                filestream.pipe(res);
                await fs.unlink(
                  process.cwd() + '/assets/PDF/' + pdfName + '.pdf',
                  (err) => {
                    if (err) console.log(err);
                    console.log('file deleted successfully');
                  }
                );
              }
            }
          }
        );
      } else {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Primary Guest not found',
        });
      }
    } catch (error) {
      sails.log.error(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: '',
        error: error.toString(),
      });
    }
  },
};
