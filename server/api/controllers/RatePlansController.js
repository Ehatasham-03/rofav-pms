/**
 * RatePlansController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'RatePlansController';
module.exports = {
  create: async (req, res) => {
    sails.log.info(`${FileName} -  create`);
    let data = _.pick(req.body, [
      'title',
      'propertyChannexId',
      'roomTypeChannexId',
      'taxSetChannexId',
      'options',
      'parentRatePlanChannexId',
      'currency',
      'sell_mode',
      'rate_mode',
      'meal_type',
      'auto_rate_settings',
      'inherit_rate',
      'inherit_closed_to_arrival',
      'inherit_closed_to_departure',
      'inherit_stop_sell',
      'inherit_min_stay_arrival',
      'inherit_min_stay_through',
      'inherit_max_stay',
      'inherit_max_sell',
      'inherit_max_availability',
      'inherit_availability_offset',
      'children_fee',
      'infant_fee',
      'max_stay',
      'min_stay_arrival',
      'min_stay_through',
      'closed_to_arrival',
      'closed_to_departure',
      'stop_sell',
      'cancellationPolicyChannexId',
      'pricing_rate_mode',
    ]);
    let result = await RatePlans.validateCreateRatePlans(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let existingRatePlanByTitle = await RatePlans.findOne({
        title: data.title,
        roomTypeChannexId: data.roomTypeChannexId,
      });
      if (existingRatePlanByTitle) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Cannot create Rate Plan. Duplicate title',
        });
      }
      let existingProperty = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!existingProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      data.propertyChannexId = existingProperty.channexId;
      data.property = existingProperty.id;

      let existingCancellationPolicy = null;
      if (data.cancellationPolicyChannexId) {
        existingCancellationPolicy = await CancelPolicy.findOne({
          channexId: data.cancellationPolicyChannexId,
        });
        if (!existingCancellationPolicy) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: 'Cancellation policy not found',
          });
        } else {
          data.cancellation_policy_id = existingCancellationPolicy.channexId;
          data.cancellation_policy = existingCancellationPolicy.id;
        }
      }

      let existingRoomType = await RoomType.findOne({
        channexId: data.roomTypeChannexId,
        propertyChannexId: data.propertyChannexId,
      });
      if (!existingRoomType) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      data.roomTypeChannexId = existingRoomType.channexId;
      data.roomType = existingRoomType.id;

      let existngTaxSet = null;
      // data.taxSetChannexId = null;
      if (data.taxSetChannexId) {
        existngTaxSet = await TaxSet.findOne({
          channexId: data.taxSetChannexId,
          propertyChannexId: data.propertyChannexId,
        });
        if (!existngTaxSet) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: messages.TaxSet.Not_Found,
          });
        } else {
          data.taxSetChannexId = existngTaxSet.channexId;
          data.taxset = existngTaxSet.id;
        }
      }
      let existingRatePlan = null;
      // data.parentRatePlanChannexId = null;
      if (data.parentRatePlanChannexId) {
        existingRatePlan = await RatePlans.findOne({
          channexId: data.parentRatePlanChannexId,
        });
        if (!existingRatePlan) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: messages.RatePlans.Not_Found,
          });
        } else {
          data.parentRatePlanChannexId = existingRatePlan.channexId;
        }
      }
      data.uniqueId = sails.config.constants.uuidv4();
      data.group_id = req.user.groupUniqueId;

      let plan = await RatePlans.create({ ...data }).fetch();
      if (!plan) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Created,
        });
      }
      return res.status(ResponseCodes.CREATED).json({
        status: ResponseCodes.CREATED,
        data: {},
        success: messages.RatePlans.Created,
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

  update: async (req, res) => {
    sails.log.info(`${FileName} -  update`);
    let ratePlanId = req.params.id;
    let data = _.pick(req.body, [
      'title',
      'propertyChannexId',
      'roomTypeChannexId',
      'taxSetChannexId',
      'options',
      'parentRatePlanChannexId',
      'cancellationPolicyChannexId',
      'currency',
      'sell_mode',
      'rate_mode',
      'meal_type',
      'auto_rate_settings',
      'inherit_rate',
      'inherit_closed_to_arrival',
      'inherit_closed_to_departure',
      'inherit_stop_sell',
      'inherit_min_stay_arrival',
      'inherit_min_stay_through',
      'inherit_max_stay',
      'inherit_max_sell',
      'inherit_max_availability',
      'inherit_availability_offset',
      'children_fee',
      'infant_fee',
      'max_stay',
      'min_stay_arrival',
      'min_stay_through',
      'closed_to_arrival',
      'closed_to_departure',
      'stop_sell',
      'pricing_rate_mode',
    ]);
    let result = await RatePlans.validateCreateRatePlans(data);
    if (result['hasError']) {
      return res.status(ResponseCodes.BAD_REQUEST).json({
        status: ResponseCodes.BAD_REQUEST,
        data: '',
        error: result['errors'],
      });
    }

    try {
      let verifyRatePlan = await RatePlans.findOne({ uniqueId: ratePlanId });
      if (!verifyRatePlan) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Found,
        });
      }
      let existingRatePlanByTitle = await RatePlans.findOne({
        title: data.title,
        roomTypeChannexId: data.roomTypeChannexId,
        uniqueId: { '!=': ratePlanId },
      });
      console.log(existingRatePlanByTitle);
      if (existingRatePlanByTitle) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Cannot update Rate Plan. Dupicate title',
        });
      }
      let existingProperty = await Property.findOne({
        channexId: data.propertyChannexId,
      });
      if (!existingProperty) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Property.Not_Found,
        });
      }
      data.propertyChannexId = existingProperty.channexId;
      data.property = existingProperty.id;

      let existingCancellationPolicy = null;
      if (data.cancellationPolicyChannexId) {
        existingCancellationPolicy = await CancelPolicy.findOne({
          channexId: data.cancellationPolicyChannexId,
        });
        if (!existingCancellationPolicy) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: 'Cancellation policy not found',
          });
        } else {
          data.cancellation_policy_id = existingCancellationPolicy.channexId;
          data.cancellation_policy = existingCancellationPolicy.id;
        }
      }

      let existingRoomType = await RoomType.findOne({
        channexId: data.roomTypeChannexId,
        propertyChannexId: data.propertyChannexId,
      });
      if (!existingRoomType) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      data.roomTypeChannexId = existingRoomType.channexId;
      data.roomType = existingRoomType.id;

      let existngTaxSet = null;
      // data.taxSetChannexId = null;
      if (data.taxSetChannexId) {
        existngTaxSet = await TaxSet.findOne({
          channexId: data.taxSetChannexId,
          propertyChannexId: data.propertyChannexId,
        });
        if (!existngTaxSet) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: messages.TaxSet.Not_Found,
          });
        } else {
          data.taxSetChannexId = existngTaxSet.channexId;
          data.taxset = existngTaxSet.id;
        }
      }
      let existingRatePlan = null;
      // data.parentRatePlanChannexId = null;
      if (data.parentRatePlanChannexId) {
        existingRatePlan = await RatePlans.findOne({
          channexId: data.parentRatePlanChannexId,
        });
        if (!existingRatePlan) {
          return res.status(ResponseCodes.BAD_REQUEST).json({
            status: ResponseCodes.BAD_REQUEST,
            data: '',
            error: messages.RatePlans.Not_Found,
          });
        } else {
          data.parentRatePlanChannexId = existingRatePlan.channexId;
        }
      }
      data.group_id = req.user.groupUniqueId;
      data.channexId = verifyRatePlan.channexId;

      let plan = await RatePlans.updateOne(
        { uniqueId: ratePlanId },
        { ...data }
      );
      if (!plan) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Updated,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.RatePlans.Updated,
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

  delete: async (req, res) => {
    try {
      let id = req.params.id;
      if (!id) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Found,
        });
      }
      let checkExisting = await RatePlans.findOne({ uniqueId: id });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Found,
        });
      }
      let deleteChannexRatePlan =
        await sails.helpers.deleteChannexRatePlan.with({
          channexId: checkExisting.channexId,
        });
      if (!deleteChannexRatePlan) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Delete,
        });
      }
      let deletedRatePlan = await RatePlans.destroyOne({ uniqueId: id });
      if (!deletedRatePlan) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.RatePlans.Not_Delete,
        });
      }

      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.RatePlans.Deleted,
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
      let roomTypeId = req.params.roomTypeId || '';
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;

      let checkExisting = await RoomType.findOne({ uniqueId: roomTypeId });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room type not found',
        });
      }

      let existingRatePlans = await RatePlans.find({
        where: {
          roomTypeChannexId: checkExisting.channexId,
        },
        limit: limit,
        skip: (page - 1) * limit,
      })
        .populate('property')
        .populate('roomType')
        .populate('taxset');
      if (!existingRatePlans) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Room.Not_Found,
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRatePlans || [],
        success: messages.Room.Details,
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

  getById: async (req, res) => {
    sails.log.info(`${FileName} -  get`);
    try {
      let ratePlanId = req.params.id || '';

      let existingRatePlan = await RatePlans.findOne({
        where: {
          uniqueId: ratePlanId,
        },
      }).populate('property');
      if (!existingRatePlan) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Rate plan not found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRatePlan,
        success: 'Rate plan',
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

  getByPropertyId: async (req, res) => {
    sails.log.info(`${FileName} -  get`);
    try {
      let propertyChannexId = req.params.propertyChannexId || '';
      let page = req.query.page || 1;
      let limit = req.query.limit || 10;

      let checkExisting = await Property.findOne({
        channexId: propertyChannexId,
      });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Property not found',
        });
      }

      let existingRatePlans = await RatePlans.find({
        where: {
          propertyChannexId: checkExisting.channexId,
        },
      })
        .populate('property')
        .populate('roomType')
        .populate('taxset');
      if (!existingRatePlans) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Rate plans not found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRatePlans || [],
        success: 'Rate plan details',
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

  getFromChannex: async (req, res) => {
    try {
      let data = _.pick(req.params, ['propertyId']);
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
      let channexRatePlans = await sails.helpers.getChannexRatePlanList.with({
        propertyChannexId: checkExisting.channexId,
      });
      if (!channexRatePlans) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Data not found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: channexRatePlans,
        success: 'Channex rate plans Data',
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

  getByRoomType: async (req, res) => {
    sails.log.info(`${FileName} -  getByRoomType`);
    try {
      let roomTypeChannexId = req.params.roomTypeChannexId || '';

      let checkExisting = await RoomType.findOne({
        channexId: roomTypeChannexId,
      });
      if (!checkExisting) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Room Type not found',
        });
      }

      let existingRatePlans = await RatePlans.find({
        where: {
          roomTypeChannexId: checkExisting.channexId,
        },
      })
        .populate('property')
        .populate('roomType')
        .populate('taxset');
      if (!existingRatePlans) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: 'Rate plans not found',
        });
      }
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: existingRatePlans || [],
        success: 'Rate plan details',
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
