/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },
  "POST /register-owner": "UserController.registerOwner",
  "POST /login": "AuthController.login",
  "POST /verify-user": "AuthController.verifyUser",
  "POST /forgot-password": "AuthController.forgotPassword",
  "POST /reset-password": "AuthController.resetPassword",
  "POST /change-password/:id": "AuthController.changePassword",

  /**
   * Property Routes
   */
  "GET /property/:groupId": "PropertyController.getProperty",
  "POST /property": "PropertyController.createProperty",
  "PATCH /property/:propertyId": "PropertyController.updateProperty",
  "DELETE /property/:propertyId": "PropertyController.deleteProperty",

  /**
   * User Routes
   */

  "GET /users/:groupId": "UserController.getUserList",
  "GET /user/:id": "UserController.getUser",
  "POST /user": "UserController.createUser",
  "PATCH /user/:userId": "UserController.updateUser",
  "DELETE /user/:userId": "UserController.deleteUser",
  "POST /upload-profile-image": "UserController.uploadUserLogo",

  /**
   * Tax Routes
   */
  "POST /tax": "TaxController.create",
  "GET /tax/:propertyId": "TaxController.getTaxList",
  "DELETE /tax/:taxUniqueId": "TaxController.deleteTax",

  /**
   * Tax set Routes
   */
  "POST /tax-set": "TaxSetController.create",
  "GET /tax-set/:propertyId": "TaxSetController.getTaxSetList",
  "DELETE /tax-set/:taxSetUniqueId": "TaxSetController.deleteTaxSet",

  "POST /upload-logo/:propertyId": "PropertyController.uploadPropertyLogo",
  "POST /delete-file": "PropertyController.deleteFile",
  "GET /property-images/:propertyId": "PropertyController.getPropertyFiles",
  "POST /upload-files/:propertyId": "PropertyController.uploadPropertyFiles",
  "POST /hotel-policy": "HotelPolicyController.createHotelPolicy",
  "PATCH /hotel-policy/:id": "HotelPolicyController.updateHotelPolicy",
  "GET /hotel-policy/:policyChannexId": "HotelPolicyController.getHotelPolicy",

  "POST /cancel-policy": "CancelPolicyController.createCancelPolicy",
  "PATCH /cancel-policy/:id": "CancelPolicyController.updateCancelPolicy",
  "DELETE /cancel-policy/:id": "CancelPolicyController.deleteCancelPolicy",
  "GET /cancel-policy/:propertyId": "CancelPolicyController.get",

  "POST /room-type": "RoomTypeController.create",
  "PATCH /room-type/:id": "RoomTypeController.update",
  "DELETE /room-type/:id": "RoomTypeController.delete",
  "GET /room-type/:groupId": "RoomTypeController.get",
  "POST /upload-room-files/:roomId": "RoomTypeController.uploadRoomFiles",
  "GET /room-images/:roomId": "RoomTypeController.getRoomFiles",
  "GET /room-type/:id/details": "RoomTypeController.getById",

  "POST /rate-plan": "RatePlansController.create",
  "PATCH /rate-plan/:id": "RatePlansController.update",
  "DELETE /rate-plan/:id": "RatePlansController.delete",
  "GET /rate-plan/:roomTypeId": "RatePlansController.get",
  "GET /rate-plan/:id/details": "RatePlansController.getById",
  "GET /rate-plan/property/:propertyChannexId":
    "RatePlansController.getByPropertyId",
  "GET /rate-plan/property/:propertyId/channex":
    "RatePlansController.getFromChannex",
  "GET /rate-plan-by-room-type/:roomTypeChannexId":
    "RatePlansController.getByRoomType",

  "POST /room": "RoomsController.createAndUpdate",
  "DELETE /room/:id": "RoomsController.delete",
  "GET /room/:roomTypeId": "RoomsController.getRoomsList",

  "POST /inventory": "InventoryController.get",
  "POST /restrictions": "RestrictionsController.get",
  "POST /availability": "AvailabilityController.updateAvailability",
  "POST /restriction": "RestrictionsController.updateRestriction",

  "POST /one-time-access-token":
    "ChannexApiController.createOneTimeAccessToken",

  "POST /create-webhook": "BookingController.createWebhook",
  "POST /webhook": "BookingController.webhook",
  "GET /bookings/:propertyChannexId": "BookingController.getBookingsList",
  "GET /bookings/:bookingId/details": "BookingController.getBookingDetails",
  "GET /acknowledge-revision/:revision_id":
    "BookingController.acknowledgeBookingRevision",

  "POST /checkin": "CheckInController.create",
  "PATCH /checkin/:id": "CheckInController.update",
  "GET /checkin/:bookingId": "CheckInController.getByBookingId",
  "GET /current-checkin/:bookingId": "CheckInController.getCurrentByBookingId",
  "POST /upload-booking-file/:bookingId": "CheckInController.uploadCheckInFile",

  "POST /create-guest": "BookingGuestsController.createGuest",
  "PATCH /guest/:id": "BookingGuestsController.updateGuest",

  "GET /guests/:bookingId": "BookingGuestsController.getBookingGuests",
  "POST /upload-booking-additional-file/:bookingId":
    "BookingController.uploadBookingAdditionalDocuments",
  "GET /booking-images/:bookingId": "BookingController.getBookingFiles",
  "GET /property-room-type/:id": "RoomTypeController.getByPropertyChannexId",
  "GET /booking-ongoing/:propertyChannexId":
    "BookingController.getBookingsListInHouse",
  "GET /booking-history/:propertyChannexId":
    "BookingController.getBookingsListHistory",
  "POST /change-request": "CheckInController.changeRequest",
  "GET /print-grc/:bookingId": "BookingGuestsController.printGrc",

  /*  */
  /*  */
  /*  */
  /*  */
  /*  */
  /*  */

  // FAIZAN KHAN
  /* AUTO CREATE MAIN CATEGORIES */

  "POST /auto/createMainCategories":
    "MaterialsManagement/AutoCategoriesCreate/CreateMaterialsManagementCategoriesController.createMaterialManagementCategories",

  /* Categories Related Routes */

  "POST /createMainCategories":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.createMainCategory",
  "POST /createSubCategories":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.createSubCategory",
  "GET /getMainCategories":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.getMainCategories",
  "GET /getSubCategories":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.getSubCategories",
  "PUT /updateMainCategory/":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.updateMainCategory",
  "DELETE /deleteMainCategory/":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.deleteMainCategory",
  "PUT /updateSubCategory/":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.updateSubCategory",
  "DELETE /deleteSubCategory/":
    "MaterialsManagement/ManageMaterialCategories/CategoriesController.deleteSubCategory",

  /* Purchase Related Routes */

  "POST /purchase":
    "MaterialsManagement/InventoryManagement/CreatePurchaseOrderController.create",
  "GET /purchase":
    "MaterialsManagement/InventoryManagement/CreatePurchaseOrderController.find",
  "DELETE /purchase":
    "MaterialsManagement/InventoryManagement/CreatePurchaseOrderController.delete",
  "PUT /purchase":
    "MaterialsManagement/InventoryManagement/CreatePurchaseOrderController.update",

  /* In House Inventory Routes */

  "GET /inhouse":
    "MaterialsManagement/InHouse/InHouseManagementController.find",
  "POST /inhouse/damage":
    "MaterialsManagement/InHouse/InHouseManagementController.moveToDamagedItems",

  /* Damage Related Routes */

  "GET /damage":
    "MaterialsManagement/DamageItems/MaterialManagementDamagedItemsController.find",
  "PUT /damage":
    "MaterialsManagement/DamageItems/MaterialManagementDamagedItemsController.update",

  /* Inventory Related Routes */ // WILL HAVE TO CREATE A NEW ROUTE FOR THIS
  "POST /createInventory":
    "MaterialsManagement/InventoryManagement/InventoryManagementController.create",
  "GET /getInventory":
    "MaterialsManagement/InventoryManagement/InventoryManagementController.find",
  "DELETE /deleteInventory":
    "MaterialsManagement/InventoryManagement/InventoryManagementController.delete",
  "PUT /updateInventory":
    "MaterialsManagement/InventoryManagement/InventoryManagementController.update",

  /* Vendors Related Routes */

  "POST /createVendor":
    "MaterialsManagement/Vendors/VendorsManagementController.createVendor",
  "GET /getVendors":
    "MaterialsManagement/Vendors/VendorsManagementController.getVendors",
  "PUT /updateVendor":
    "MaterialsManagement/Vendors/VendorsManagementController.updateVendor",
  "DELETE /deleteVendor":
    "MaterialsManagement/Vendors/VendorsManagementController.deleteVendor",

  /* Market Management Routes */
  "POST /createMarketItems":
    "MaterialsManagement/MarketManagement/MarketManagementController.createMarketItems",
  "GET /getMarketItems":
    "MaterialsManagement/MarketManagement/MarketManagementController.getMarketItems",
  "PUT /updateMarketItem":
    "MaterialsManagement/MarketManagement/MarketManagementController.updateMarketItem",
  "DELETE /deleteMarketItem":
    "MaterialsManagement/MarketManagement/MarketManagementController.deleteMarketItem",

  /* Laundry Price Related Routes */

  "POST /laundary/price":
    "MaterialsManagement/Laundry/Prices/LaundryPriceListController.createPriceList",
  "GET /laundary/price":
    "MaterialsManagement/Laundry/Prices/LaundryPriceListController.getPriceLists",
  "DELETE /laundary/price":
    "MaterialsManagement/Laundry/Prices/LaundryPriceListController.deletePriceList",
  "PUT /laundary/price":
    "MaterialsManagement/Laundry/Prices/LaundryPriceListController.updatePriceList",

  /* Items Related Routes */ // PROBARLY NOT BEING USED FOR NOW

  "POST /createItems": "ItemManagementController.createItems",
  "GET /getItems": "ItemManagementController.getItems",
  "DELETE /deleteItem": "ItemManagementController.deleteItem",
  "PUT /updateItem": "ItemManagementController.updateItem",

  /* Kitchen Related Routes */
  "POST /createKitchenUtilizationEntry": "KitchenUtilizationController.create",
  "GET /getKitchenUtilizationEntry": "KitchenUtilizationController.find",
  "GET /getKitchenUtilizationEntry/graph":
    "KitchenUtilizationController.findGraph",
  "GET /getKitchenUtilizationEntry/graph/detailed":
    "KitchenUtilizationController.findGraphDetailed",
  "GET /getKitchenUtilizationEntry/graph":
    "KitchenUtilizationController.findSimplifiedGraph",

  /* Laundry Related Routes */
  "POST /laundry/out":
    "MaterialsManagement/Laundry/LaundryManagementController.createOut",
  "POST /laundry/in":
    "MaterialsManagement/Laundry/LaundryManagementController.createIn",
  "GET /laundry":
    "MaterialsManagement/Laundry/LaundryManagementController.find",

  /* House Keeping Related Routes */
  "POST /createHouseKeepingUtilizationEntry":
    "HouseKeepingManagementController.create",
  "GET /getHouseKeepingUtilizationEntries":
    "HouseKeepingManagementController.find",
  "GET /getHouseKeepingUtilizationEntries/graph/detailed":
    "HouseKeepingManagementController.findGraphDetailed",
  "GET /getHouseKeepingUtilizationEntries/graph":
    "HouseKeepingManagementController.findSimplifiedGraph",

  /* Electronics Related Routes */
  "POST /createPurchesElectronics":
    "ElectronicsManagementController.createPurchase",
  "POST /createElectronicUtilizationEntry":
    "ElectronicsManagementController.createUtilization",
  "GET /getElectronicsPurchases":
    "ElectronicsManagementController.findPurchases",
  "GET /getElectronicsUtilizations":
    "ElectronicsManagementController.findUtilizations",
  "GET /getElectronicsUtilizations/graph/detailed":
    "ElectronicsManagementController.findGraphDetailed",
  "GET /getElectronicsUtilizations/graph":
    "ElectronicsManagementController.findSimplifiedGraph",

  /* Room Kits Routes */

  "POST /roomKits": "MaterialsManagement/RoomKits/RoomKitsController.create",
  "GET /roomKits": "MaterialsManagement/RoomKits/RoomKitsController.find",
  "DELETE /roomKits": "MaterialsManagement/RoomKits/RoomKitsController.delete",
  "PUT /roomKits": "MaterialsManagement/RoomKits/RoomKitsController.update",
  "PUT /roomkits/update/addItem":
    "MaterialsManagement/RoomKits/RoomKitsController.addItem",
  "PUT /roomkits/update/removeItem":
    "MaterialsManagement/RoomKits/RoomKitsController.removeItem",

  /* KSR Kitchen Service Request ROUTES */

  /* Dish Main Category Related Routes */

  "POST /ksr/createDishMainCategory":
    "DishMainCategoryController.createDishMainCategory",
  "PUT /ksr/updateDishMainCategory":
    "DishMainCategoryController.updateDishMainCategory",
  "DELETE /ksr/deleteDishMainCategory":
    "DishMainCategoryController.deleteDishMainCategory",
  "GET /ksr/getDishMainCategories":
    "DishMainCategoryController.getDishMainCategories",

  /* KSR Table Related Routes */
  "POST /ksr/createKsrTable": "KSRTableController.createTable",
  "GET /ksr/getKsrTables": "KSRTableController.getTable",
  "DELETE /ksr/deleteKsrTable": "KSRTableController.deleteTable",

  /* KSR Dish Inventory Related Routes */

  "POST /ksr/createDishInventory": "KSRDishInventoryController.create",
  "GET /ksr/getDishInventories": "KSRDishInventoryController.get",
  "DELETE /ksr/deleteDishInventory": "KSRDishInventoryController.delete",
  "PUT /ksr/updateDishInventory": "KSRDishInventoryController.update",

  /* KSR Restaurant Management Routes */

  "POST /ksr/createRestaurant": "KSRRestaurantsManagementController.create",
  "GET /ksr/getRestaurants": "KSRRestaurantsManagementController.fetch",
  "DELETE /ksr/deleteRestaurant": "KSRRestaurantsManagementController.delete",

  /* KSR Order Routes */

  "POST /ksr/createOrder": "KSROrderController.create",
  "GET /ksr/getOrders": "KSROrderController.find",
  "GET /ksr/receipt": "KSROrderController.ksrOrderReceipt",
  "GET /ksr/download/excel": "KSROrderController.KsrOrdersDownloadExcel",

  //Employee Management Routes

  /* Employee Designation Related Routes */
  "POST /designation":
    "EmployeeManagement/EmployeeManagementController.createDesignation",
  "GET /designations":
    "EmployeeManagement/EmployeeManagementController.fetchDesignation",

  /* Employee Management Routes */
  "POST /employee":
    "EmployeeManagement/EmployeeManagementController.createEmployee",
  "GET /employees":
    "EmployeeManagement/EmployeeManagementController.fetchEmployees",
  "PUT /employee":
    "EmployeeManagement/EmployeeManagementController.updateEmployee",
  "DELETE /employee":
    "EmployeeManagement/EmployeeManagementController.deleteEmployee",

  /* Tax Management Routes */
  "POST /createTaxItem": "TaxManagementController.create",
  "GET /getTaxItems": "TaxManagementController.find",
  "PUT /updateTaxItem": "TaxManagementController.update",
  "DELETE /deleteTaxItem": "TaxManagementController.delete",

  // Payroll Management

  "POST /payroll": "PayrollManagement/PayrollManagementController.create",
  "GET /payroll": "PayrollManagement/PayrollManagementController.find",
  "DELETE /payroll": "PayrollManagement/PayrollManagementController.delete",
  "PUT /payroll": "PayrollManagement/PayrollManagementController.update",

  // Banquet Management

  /* Configuration */

  // Banquet Suitable routes
  "POST /banquet/configuration/suitable":
    "Banquet/Configuration/BanquetConfigurationController.createSuitable",
  "GET /banquet/configuration/suitable":
    "Banquet/Configuration/BanquetConfigurationController.fetchSuitable",
  "DELETE /banquet/configuration/suitable":
    "Banquet/Configuration/BanquetConfigurationController.deleteSuitable",

  // Banquet Facilities routes
  "POST /banquet/configuration/facilities ":
    "Banquet/Configuration/BanquetConfigurationController.createFacilities",
  "GET /banquet/configuration/facilities":
    "Banquet/Configuration/BanquetConfigurationController.fetchFacilities",
  "DELETE /banquet/configuration/facilities":
    "Banquet/Configuration/BanquetConfigurationController.deleteFacilities",

  // Banquet Types routes
  "POST /banquet/configuration/types":
    "Banquet/Configuration/BanquetConfigurationController.createTypes",
  "GET /banquet/configuration/types":
    "Banquet/Configuration/BanquetConfigurationController.fetchTypes",
  "DELETE /banquet/configuration/types":
    "Banquet/Configuration/BanquetConfigurationController.deleteTypes",

  /* Plan Management */

  // Banquet Food Plans routes
  "POST /banquet/plans/food":
    "Banquet/Plans/BanquetPlansController.createFoodPlan",
  "GET /banquet/plans/food":
    "Banquet/Plans/BanquetPlansController.fetchFoodPlans",
  "DELETE /banquet/plans/food":
    "Banquet/Plans/BanquetPlansController.deleteFoodPlan",
  "POST /banquet/plans/food/dish":
    "Banquet/Plans/BanquetPlansController.createDish",
  "DELETE /banquet/plans/food/dish":
    "Banquet/Plans/BanquetPlansController.deleteDish",

  // Banquet Halls routes
  "POST /banquet/halls": "Banquet/Halls/BanquetHallsController.createHall",
  "GET /banquet/halls": "Banquet/Halls/BanquetHallsController.fetchHalls",
  "PUT /banquet/halls": "Banquet/Halls/BanquetHallsController.updateHall",
  "DELETE /banquet/halls": "Banquet/Halls/BanquetHallsController.deleteHall",

  //Booking routes
  "POST /banquet/booking": "Banquet/Booking/BanquetBookingController.create",
  "GET /banquet/booking": "Banquet/Booking/BanquetBookingController.find",
  "PUT /banquet/booking": "Banquet/Booking/BanquetBookingController.update",
  "DELETE /banquet/booking": "Banquet/Booking/BanquetBookingController.delete",

  /* DUTY ROASTER */

  // Responsibility Routes

  "POST /dutyroaster/responsibility":
    "DutyRoaster/DutyRoasterManagementController.createResponsibilities",
  "GET /dutyroaster/responsibilities":
    "DutyRoaster/DutyRoasterManagementController.fetchResponsibilities",
  "DELETE /dutyroaster/responsibility":
    "DutyRoaster/DutyRoasterManagementController.deleteResponsibilities",

  //Shift Routes
  "POST /dutyroaster/shift":
    "DutyRoaster/DutyRoasterManagementController.createShift",
  "GET /dutyroaster/shift":
    "DutyRoaster/DutyRoasterManagementController.fetchShift",
  "DELETE /dutyroaster/shift":
    "DutyRoaster/DutyRoasterManagementController.deleteShift",

  //Duty Roaster Routes
  "POST /dutyroaster": "DutyRoaster/DutyRoasterManagementController.create",
  "GET /dutyroaster": "DutyRoaster/DutyRoasterManagementController.find",
  "PUT /dutyroaster": "DutyRoaster/DutyRoasterManagementController.update",
  "DELETE /dutyroaster": "DutyRoaster/DutyRoasterManagementController.delete",

  /* Hotel Config */

  "POST /hotelconfig": "HotelConfig/HotelConfigController.create",
  "GET /hotelconfig": "HotelConfig/HotelConfigController.get",
  "DELETE /hotelconfig": "HotelConfig/HotelConfigController.delete",
  "PUT /hotelconfig": "HotelConfig/HotelConfigController.update",

  "POST /create-booking/manual": "BookingController.createManualBooking",
  "GET /no-show/:booking_id": "CheckInController.noShow",
  "POST /checkout/:booking_id": "CheckInController.checkout",
  "POST /cancel-booking/:booking_id": "CheckInController.cancelBooking",

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
