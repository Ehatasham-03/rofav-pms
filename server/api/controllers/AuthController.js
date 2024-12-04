/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ResponseCodes = sails.config.constants.ResponseCodes;
const messages = sails.config.messages;
const FileName = 'AuthController';
const fs = require('fs-extra');
module.exports = {
  /**
   * @function login
   * @description Login user for web admin panel
   */
  login: async (req, res) => {
    sails.log.info(`${FileName} -  login`);

    let data = _.pick(req.body, ['email', 'password']);
    try {
      let { hasError, errors, user } = await User.validateUserLogin(data);

      if (hasError) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: errors,
        });
      }
      user = await User.findOne({
        email: user.email,
      }).populate('group');
      if (!user.is_verified) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.User.Verify,
        });
      }
      if (!user.isActive) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.User.InvalidUserId,
        });
      }
      const tempToken = JwtService.issue({ uniqueId: user.uniqueId });
      user.token = tempToken;
      user = _.omit(user, [
        'password',
        'password_reset_token',
        'company_name',
        'is_verified',
      ]);
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: user,
        error: '',
        success: messages.LoggedIn,
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
   * @function verifyUser
   * @description verify user after creation
   */
  verifyUser: async (req, res) => {
    try {
      let { token } = _.pick(req.body, ['token']);
      if (!token) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          error: messages.Missing_Verification_Token,
        });
      }
      let checkExistence = await User.findOne({
        password_reset_token: token,
      });

      if (!checkExistence) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          error: messages.Invalid_Token,
        });
      }
      let updatedUser = await User.updateOne({
        password_reset_token: token,
      }).set({ is_verified: true, password_reset_token: '' });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.User.Verified,
      });
    } catch (error) {
      // console.log(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        error: error,
        message: error.msg,
      });
    }
  },

  /**
   * @function forgotPassword
   * @description send email to user with reset password link
   */
  forgotPassword: async (req, res) => {
    try {
      let { email } = _.pick(req.body, ['email']);
      if (!email) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          error: messages.EmailRequired,
        });
      }
      let checkExistence = await User.findOne({
        email,
      });

      if (!checkExistence) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          error: messages.User.NotFound,
        });
      }
      const token = JwtService.issue({ email: checkExistence.email });
      let updatedUser = await User.updateOne({
        email,
      }).set({ password_reset_token: token });
      let mail = await sails.helpers.mailSender.with({
        mailTo: [updatedUser.email],
        mailSubject: 'Forgot Password',

        mailBody: `
        <p>Reset Password link : ${
          `${process.env.Frontend_Reset_Password_Link}?token=` +
          updatedUser.password_reset_token
        }</p>
        `,
      });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.Forgot_Password_Link,
      });
    } catch (error) {
      console.log(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        error: error,
        message: error.msg,
      });
    }
  },

  /**
   * @function resetPassword
   * @description Reset User Password
   */
  resetPassword: async (req, res) => {
    try {
      let { password, token } = _.pick(req.body, ['password', 'token']);
      let { hasError, errors } = await User.validateResetPasswordData({
        password: password,
        token: token,
      });
      if (hasError) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Required_Field_Missing,
        });
      }
      let checkExistence = await User.findOne({
        password_reset_token: token,
      });

      if (!checkExistence) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          error: messages.Invalid_Token,
        });
      }

      let updatedUser = await User.updateOne({
        password_reset_token: token,
      }).set({ password_reset_token: '', password });
      let mail = await sails.helpers.mailSender.with({
        mailTo: [updatedUser.email],
        mailSubject: 'Password Reset Successful',

        mailBody: `
        <p>Password : ${password}</p>
        `,
      });
      return res.status(ResponseCodes.OK).json({
        status: ResponseCodes.OK,
        data: {},
        success: messages.Reset_Success,
      });
    } catch (error) {
      console.log(error);
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
        status: ResponseCodes.INTERNAL_SERVER_ERROR,
        error: error,
        message: error.msg,
      });
    }
  },

  /**
   * @function changePassword
   * @description Change User Password
   */
  ChangePassword: async (req, res) => {
    try {
      let userId = req.params.id;
      let data = _.pick(req.body, ['currentPassword', 'newPassword']);

      let { hasError, errors } = await User.validateChangePasswordData(data);
      if (hasError) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Required_Field_Missing,
        });
      }
      let existingUser = await User.findOne({ uniqueId: userId });
      if (!existingUser) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.User.InvalidUserId,
        });
      }
      let compareFlag = await User.comparePassword(
        data.currentPassword,
        existingUser
      );
      if (!compareFlag) {
        return res.status(ResponseCodes.BAD_REQUEST).json({
          status: ResponseCodes.BAD_REQUEST,
          data: '',
          error: messages.Invalid_Old_Password,
        });
      }
      let user = await User.updateOne(
        { uniqueId: userId },
        { password: data.newPassword }
      );
      if (user) {
        return res.status(ResponseCodes.OK).json({
          status: ResponseCodes.OK,
          data: {},
          error: '',
          success: messages.Changed_Password,
        });
      }
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
