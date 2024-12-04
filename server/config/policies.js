/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  AuthController: {
    ChangePassword: ['AuthenticateUser'],
  },
  PropertyController: {
    createProperty: ['AuthenticateOwner'],
    updateProperty: ['AuthenticateOwner'],
    deleteProperty: ['AuthenticateOwner'],
    getProperty: ['AuthenticateOwner'],
    uploadPropertyLogo: ['AuthenticateOwner'],
    getPropertyFiles: ['AuthenticateOwner'],
    uploadPropertyFiles: ['AuthenticateOwner'],
  },
  UserController: {
    getUserList: ['AuthenticateOwner'],
    getUser: ['AuthenticateUser'],
    createUser: ['AuthenticateOwner'],
    updateUser: ['AuthenticateUser'],
    deleteUser: ['AuthenticateOwner'],
    uploadUserLogo: ['AuthenticateUser'],
  },
  TaxController: {
    create: ['AuthenticateOwner'],
    getTaxList: ['AuthenticateOwner'],
    deleteTax: ['AuthenticateOwner'],
  },
  TaxSetController: {
    create: ['AuthenticateOwner'],
    getTaxSetList: ['AuthenticateOwner'],
    deleteTaxSet: ['AuthenticateOwner'],
  },
  HotelPolicyController: {
    createHotelPolicy: ['AuthenticateOwner'],
    updateHotelPolicy: ['AuthenticateOwner'],
    getHotelPolicy: ['AuthenticateOwner'],
  },
  CancelPolicyController: {
    createCancelPolicy: ['AuthenticateOwner'],
    updateCancelPolicy: ['AuthenticateOwner'],
    deleteCancelPolicy: ['AuthenticateOwner'],
    get: ['AuthenticateOwner'],
  },
  RoomTypeController: {
    create: ['AuthenticateOwner'],
    update: ['AuthenticateOwner'],
    delete: ['AuthenticateOwner'],
    uploadRoomFiles: ['AuthenticateOwner'],
    get: ['AuthenticateOwner'],
    getRoomFiles: ['AuthenticateOwner'],
    getById: ['AuthenticateOwner'],
    getByPropertyChannexId: ['AuthenticateOwner'],
  },
  RatePlansController: {
    create: ['AuthenticateOwner'],
    update: ['AuthenticateOwner'],
    delete: ['AuthenticateOwner'],
    get: ['AuthenticateOwner'],
    getById: ['AuthenticateOwner'],
    getByPropertyId: ['AuthenticateOwner'],
    getFromChannex: ['AuthenticateOwner'],
  },
  RoomsController: {
    createAndUpdate: ['AuthenticateOwner'],
    delete: ['AuthenticateOwner'],
  },
  InventoryController: {
    get: ['AuthenticateOwner'],
  },
  RestrictionsController: {
    get: ['AuthenticateOwner'],
    updateRestriction: ['AuthenticateOwner'],
  },
  AvailabilityController: {
    updateAvailability: ['AuthenticateOwner'],
  },
  ChannexApiController: {
    createOneTimeAccessToken: ['AuthenticateOwner'],
  },
  BookingController: {
    createWebhook: ['AuthenticateOwner'],
    getBookingDetails: ['AuthenticateOwner'],
    getBookingsList: ['AuthenticateOwner'],
    acknowledgeBookingRevision: ['AuthenticateOwner'],
    uploadBookingAdditionalDocuments: ['AuthenticateOwner'],
    getBookingsListHistory: ['AuthenticateOwner'],
    getBookingsListInHouse: ['AuthenticateOwner'],
    createManualBooking: ['AuthenticateOwner'],
  },
  CheckInController: {
    create: ['AuthenticateOwner'],
    update: ['AuthenticateOwner'],
    getByBookingId: ['AuthenticateOwner'],
    uploadCheckInFile: ['AuthenticateOwner'],
    noShow: ['AuthenticateOwner'],
    checkout: ['AuthenticateOwner'],
    cancelBooking: ['AuthenticateOwner'],
  },
  BookingGuestsController: {
    createGuest: ['AuthenticateOwner'],
    getBookingGuests: ['AuthenticateOwner'],
    updateGuest: ['AuthenticateOwner'],
  },
};
