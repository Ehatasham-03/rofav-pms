/**
 * HotelPolicyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'HotelPolicyController';
module.exports = {
  /**
   * Create Hotel Policy
   */

  createHotelPolicy: async (req, res) => {
    try {
      let policyData = _.cloneDeep(req.body);

      let result = await HotelPolicy.validateCreatePolicyData(policyData);
      if (result['hasError']) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          // error: messages.Required_Field_Missing,
          error: result['errors'],
        });
      }
      let verifyProperty = await Property.findOne({
        channexId: policyData.propertyChannexId,
      });
      if (!verifyProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      policyData.uniqueId = sails.config.constants.uuidv4();
      let createdPolicy = await HotelPolicy.create(policyData).fetch();
      if (!createdPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Created,
        });
      }
      delete verifyProperty.id;
      let updatedProperty = await Property.updateOne(
        { channexId: createdPolicy.propertyChannexId },
        {
          ...verifyProperty,
          hotel_policy_id: createdPolicy.channexId,
          hotel_policy: createdPolicy.id,
        }
      );
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: createdPolicy,
        success: messages.Property.Created,
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

  /**
   * Update Hotel Policy
   */

  updateHotelPolicy: async (req, res) => {
    try {
      let policyId = req.params.id || '';
      let policyData = _.cloneDeep(req.body);

      let verifyPolicy = await HotelPolicy.findOne({ uniqueId: policyId });
      if (!verifyPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.HotelPolicy.Not_Found,
        });
      }

      let result = await HotelPolicy.validateCreatePolicyData(policyData);
      if (result['hasError']) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          // error: messages.Required_Field_Missing,
          error: result['errors'],
        });
      }
      let verifyProperty = await Property.findOne({
        channexId: policyData.propertyChannexId,
      });
      if (!verifyProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      policyData.channexId = verifyPolicy.channexId;
      let updatedPolicy = await HotelPolicy.updateOne(
        { uniqueId: policyId },
        policyData
      );
      if (!updatedPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Created,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: updatedPolicy,
        success: messages.Property.Created,
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

  getHotelPolicy: async (req, res) => {
    sails.log.info(`${FileName} -  getUser`);
    try {
      let hotelPolicyId = req.params.policyChannexId || '';

      let existingPolicy = await HotelPolicy.findOne({
        channexId: hotelPolicyId,
      });
      if (!existingPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.HotelPolicy.NotFound,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingPolicy,
        success: messages.HotelPolicy.Details,
        error: '',
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
