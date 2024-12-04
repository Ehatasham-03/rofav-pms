/**
 * CancelPolicyController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'CancelPolicyController';
module.exports = {
  /**
   * Create Cancel Policy
   */

  createCancelPolicy: async (req, res) => {
    try {
      let policyData = _.cloneDeep(req.body);

      let result = await CancelPolicy.validateCreateCancelPolicyData(
        policyData
      );
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
      let createdPolicy = await CancelPolicy.create(policyData).fetch();
      if (!createdPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Created,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: createdPolicy,
        success: messages.CancelPolicy.Created,
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
   * Update Cancel Policy
   */

  updateCancelPolicy: async (req, res) => {
    try {
      let policyId = req.params.id || '';
      let policyData = _.cloneDeep(req.body);

      let verifyPolicy = await CancelPolicy.findOne({ uniqueId: policyId });
      if (!verifyPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Found,
        });
      }

      let result = await CancelPolicy.validateCreateCancelPolicyData(
        policyData
      );
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
      let updatedPolicy = await CancelPolicy.updateOne(
        { uniqueId: policyId },
        policyData
      );
      if (!updatedPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Updated,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: updatedPolicy,
        success: messages.CancelPolicy.Updated,
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
   * Delete Cancel Policy
   */

  deleteCancelPolicy: async (req, res) => {
    try {
      let policyId = req.params.id;
      if (!policyId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Found,
        });
      }
      let checkExisting = await CancelPolicy.findOne({ uniqueId: policyId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Found,
        });
      }
      let deleteChannexCancelPolicy =
        await sails.helpers.deleteChannexCancelPolicy.with({
          channexId: checkExisting.channexId,
        });
      if (!deleteChannexCancelPolicy) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Set_As_Default,
        });
      }
      let deletedCancel = await CancelPolicy.destroyOne({ uniqueId: policyId });
      if (!deletedCancel) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Delete,
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.CancelPolicy.Deleted,
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

  get: async (req, res) => {
    sails.log.info(`${FileName} -  get`);
    try {
      let propertyId = req.params.propertyId || '';
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;

      let checkExisting = await Property.findOne({ uniqueId: propertyId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Exists,
        });
      }

      let existingCancelPolicies = await CancelPolicy.find({
        where: {
          propertyChannexId: checkExisting.channexId,
        },
        limit: limit,
        skip: (page - 1) * limit,
      });
      if (!existingCancelPolicies) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.CancelPolicy.Not_Found,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingCancelPolicies || [],
        success: messages.CancelPolicy.Details,
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
