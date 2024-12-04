const axios = require("axios");

module.exports = {
  friendlyName: "Get channex inventory data",

  description: "",

  inputs: {
    startDate: {
      type: "string",
    },
    endDate: {
      type: "string",
    },
    propertyChannexId: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "Channex inventory data",
    },
  },

  fn: async function (inputs, exits) {
    let { propertyChannexId, startDate, endDate } = inputs;
    let filter = {
      date: {},
    };

    let restrictions = `rate,stop_sell,closed_to_arrival,closed_to_departure,min_stay_arrival,min_stay_through,min_stay,max_stay,availability,stop_sell_manual,max_availability,availability_offset`;

    await axios
      .get(
        process.env.CHANNEX_ENDPOINT +
          `/availability?filter[date][gte]=${startDate}&filter[date][lte]=${endDate}&filter[restrictions]=${restrictions}&filter[property_id]=${propertyChannexId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "user-api-key": process.env.CHANNEX_API_KEY,
          },
        }
      )
      .then(async (result) => {
        console.log("result", result.data);
        if (!result.data) {
          return exits.success(false);
        }
        let data = result.data.data;
        let roomTypesChannexId = Object.keys(data);
        let roomTypeData = await RoomType.find({
          channexId: roomTypesChannexId,
        });
        let formattedData = [];
        if (roomTypeData && roomTypeData.length) {
          roomTypeData.map((e) => {
            let item = {
              id: e.uniqueId,
              channexId: e.channexId,
              name: e.title,
              availability: [],
            };
            let dates = Object.keys(data[e.channexId]);
            if (dates && dates.length) {
              dates.map((date) => {
                item.availability.push({
                  [date]: data[e.channexId][date],
                });
              });
            }
            formattedData.push(item);
          });
        }
        console.log(formattedData);
        return exits.success(formattedData);
      })
      .catch((err) => {
        console.log("err", err.response);
        return exits.success(false);
      });
  },
};
