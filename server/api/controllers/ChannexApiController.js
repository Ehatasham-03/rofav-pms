/**
 * ChannexApiController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'ChannexApiController';
module.exports = {
  createOneTimeAccessToken: async (req, res) => {
    try {
      let data = _.pick(req.body, [
        'propertyChannexId',
        'groupChannexId',
        'username',
      ]);
      if (!data.propertyChannexId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      let checkExisting = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Exists,
        });
      }
      let checkExistingGroup = await Group.findOne({
        channexId: data.groupChannexId,
      });
      if (!checkExistingGroup) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Group does not exist',
        });
      }
      if (!data.username) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Username is required',
        });
      }
      let accessToken =
        await sails.helpers.generateChannexOneTimeAccessToken.with({
          propertyChannexId: data.propertyChannexId,
          groupChannexId: data.groupChannexId,
          username: data.username,
        });
      if (!accessToken) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Data not found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: accessToken,
        success: 'One time access token data',
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
