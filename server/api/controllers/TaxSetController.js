/**
 * TaxSetController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'TaxSetController';
module.exports = {
  /**
   * @function create
   * @description Create a new tax set
   */
  create: async (req, res) => {
    sails.log.info(`${FileName} -  create`);
    let data = _.pick(req.body, [
      'title',
      'propertyUniqueId',
      'currency',
      'taxes',
      'associated_rate_plan_ids',
    ]);
    console.log(data);
    let result = await TaxSet.validateCreateTaxSetData(data);
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
      let taxChannexIds = [];
      if (data.taxes && data.taxes.length) {
        data.taxes.forEach((one) => {
          taxChannexIds.push(one.id);
        });
      }
      console.log(taxChannexIds);
      let taxIds = [];
      let existingTaxes = [];
      let taxes = await Tax.find({ channexId: taxChannexIds });
      if (taxes && taxes.length) {
        taxes.forEach((one) => {
          taxIds.push(one.id);
          existingTaxes.push({
            id: one.channexId,
          });
        });
      }
      data.taxes = existingTaxes;
      data.tax = taxIds;
      data.uniqueId = sails.config.constants.uuidv4();
      data.propertyChannexId = existingProperty.channexId;
      data.property = existingProperty.id;
      data.group_id = req.user.groupUniqueId;

      console.log(data);

      let tax = await TaxSet.create({ ...data }).fetch();
      if (!tax) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.TaxSet.Not_Created,
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: messages.TaxSet.Created,
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
   * @function getTaxSetList
   * @description tax set list by group/company
   */
  getTaxSetList: async (req, res) => {
    sails.log.info(`${FileName} -  getTaxSetList`);
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

      let existingTaxSets = await TaxSet.find({
        where: {
          propertyChannexId: checkExisting.channexId,
        },
        limit: limit,
        skip: (page - 1) * limit,
      })
        .populate('property')
        .populate('tax');
      if (!existingTaxSets) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.TaxSet.Not_Found,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingTaxSets || [],
        success: messages.TaxSet.Details,
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

  deleteTaxSet: async (req, res) => {
    try {
      let taxSetId = req.params.taxSetUniqueId;
      if (!taxSetId) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.TaxSet.Not_Found,
        });
      }
      let checkExisting = await TaxSet.findOne({ uniqueId: taxSetId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Tax.Not_Found,
        });
      }
      let deleteChannexTaxSet = await sails.helpers.deleteChannexTaxSet.with({
        channexId: checkExisting.channexId,
      });
      if (!deleteChannexTaxSet) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.TaxSet.Assigned_To_Tax_Set,
        });
      }
      let deletedTaxSet = await TaxSet.destroyOne({ uniqueId: taxSetId });
      if (!deletedTaxSet) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.TaxSet.Not_Delete,
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.TaxSet.Deleted,
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
