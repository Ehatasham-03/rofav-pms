/**
 * TaxController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'TaxController';
module.exports = {
  /**
   * @function create
   * @description Create a new tax
   */
  create: async (req, res) => {
    sails.log.info(`${FileName} -  create`);
    let data = _.pick(req.body, [
      'title',
      'logic',
      'type',
      'rate',
      'currency',
      'is_inclusive',
      'propertyUniqueId',
      'applicable_after',
      'applicable_before',
      'max_nights',
      'skip_nights',
    ]);
    console.log(data);
    let result = await Tax.validateCreateTaxData(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let existingProperty = await Property.findOne({
        uniqueId: data.propertyUniqueId,
      });
      if (!existingProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      data.uniqueId = sails.config.constants.uuidv4();
      data.propertyChannexId = existingProperty.channexId;
      data.property = existingProperty.id;
      data.group_id = req.user.groupUniqueId;

      let tax = await Tax.create({ ...data }).fetch();
      if (!tax) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Not_Created,
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: messages.Tax.Created,
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

  /**
   * @function getTaxList
   * @description tax list by group/company
   */
  getTaxList: async (req, res) => {
    sails.log.info(`${FileName} -  getTaxList`);
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

      let existingTaxes = await Tax.find({
        where: {
          propertyChannexId: checkExisting.channexId,
        },
        limit: limit,
        skip: (page - 1) * limit,
      }).populate('property');
      if (!existingTaxes) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Not_Found,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingTaxes || [],
        success: messages.Tax.Details,
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

  /**
   * Delete tax
   */

  deleteTax: async (req, res) => {
    try {
      let taxId = req.params.taxUniqueId;
      if (!taxId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Not_Found,
        });
      }
      let checkExisting = await Tax.findOne({ uniqueId: taxId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Not_Found,
        });
      }
      let deleteChannexTax = await sails.helpers.deleteChannexTax.with({
        channexId: checkExisting.channexId,
      });
      if (!deleteChannexTax) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Assigned_To_Tax_Set,
        });
      }
      let deletedTax = await Tax.destroyOne({ uniqueId: taxId });
      if (!deletedTax) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Not_Delete,
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.Tax.Deleted,
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
