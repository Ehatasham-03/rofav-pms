// api/models/KsrOrders.js
module.exports = {
  tableName: "KsrOrders",
  primaryKey: "orderId",

  attributes: {
    id: {
      type: "number",
      autoIncrement: true,
      columnName: "id",
    },
    orderId: {
      type: "string",
      required: true,
      unique: true,
    },
    propertyId: {
      type: "string",
      required: true,
    },
    restaurantId: {
      model: "KsrRestaurants",
    },
    stewardId: {
      model: "Employee",
    },
    subTotal: {
      type: "number",
      required: true,
    },
    totalPrice: {
      type: "number",
      required: true,
    },
    taxesList: {
      model: "TaxesList",
    },
    products: {
      collection: "KsrOrderProducts",
      via: "orderId",
    },
    typeOfSale: {
      type: "string",
      required: true,
    },
    tableNumber: {
      type: "string",
    },
    roomNumber: {
      type: "string",
    },
    guests: {
      type: "string",
    },
    deliveryPartner: {
      type: "string",
    },
    discounts: {
      type: "boolean",
      defaultsTo: false,
    },
    discountAmount: {
      type: "number",
    },
    discountType: {
      type: "string",
    },
  },
};
