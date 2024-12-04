/**
 * InventoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = "InventoryController";
module.exports = {
  /**
   * Get inventory data
   */
  get: async (req, res) => {
    try {
      let data = _.pick(req.body, ["startDate", "endDate", "propertyId"]);
      if (!data.propertyId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: "",
          error: messages.Property.Not_Exists,
        });
      }
      let checkExisting = await Property.findOne({ uniqueId: data.propertyId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: "",
          error: messages.Property.Not_Exists,
        });
      }
      let inventory = await sails.helpers.getChannexInventoryData.with({
        propertyChannexId: checkExisting.channexId,
        startDate: data.startDate || "",
        endDate: data.endDate || "",
      });
      if (!inventory) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: "",
          error: "Data not found",
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: inventory,
        success: "Inventory Data",
      });
    } catch (error) {
      sails.log.error(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: "",
        error: error.toString(),
      });
    }
  },
};
