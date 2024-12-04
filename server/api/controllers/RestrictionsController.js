/**
 * RestrictionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'RestrictionsController';
module.exports = {
  /**
   * Get restrictions data
   */
  get: async (req, res) => {
    try {
      let data = _.pick(req.body, ['startDate', 'endDate', 'propertyId']);
      if (!data.propertyId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Exists,
        });
      }
      let checkExisting = await Property.findOne({ uniqueId: data.propertyId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Exists,
        });
      }
      let restrictions = await sails.helpers.getChannexRestrictionsData.with({
        propertyChannexId: checkExisting.channexId,
        startDate: data.startDate || '',
        endDate: data.endDate || '',
      });
      if (!restrictions) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Data not found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: restrictions,
        success: 'restrictions Data',
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

  updateRestriction: async (req, res) => {
    try {
      let data = req.body.data;

      let channexRestriction =
        await sails.helpers.updateChannexRestriction.with({
          data,
        });
      if (!channexRestriction) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Restriction not updated',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: channexRestriction,
        success: 'Restriction updated successfully',
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
};
