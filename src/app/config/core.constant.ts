export const CoreConstants = {
  RESOURCE: {
    checkLogin: '/account/csrf-disabled/userNameCheck',
    login: '/profile/csrf-disabled/arxLogin',
    forgotUsername: '/profile/csrf-disabled/retrieveUser',
    resetPassword: '/profile/csrf-disabled/resetPassword',
    sendCode: '/profile/csrf-disabled/resetPassword/sendcode',
    submitCode: '/profile/csrf-disabled/validate/pincode',
    checkPassword: '/register/csrf-disabled/common/PasswordRule',
    saveNewPassword: '/profile/csrf-disabled/resetPassword',
    authenticateCode: '/profile/csrf-disabled/authenticate'
  },

  USERDATA: {
    login: '',
    phone: []
  },

  RESETPASSWORD: {
    status: false,
    message: '',
    messageType: '',
    login: '',
    codeMessage: '',
    responseMessage: '',
    emailMessage:
      // tslint:disable-next-line: max-line-length
      'If your account is valid, a security code has been sent to your email. Please allow two minutes for your code to arrive. If necessary, you can request up to <5> more codes.',
    phoneMessage:
      // tslint:disable-next-line: max-line-length
      'If your account is valid, a security code was sent via text to your phone ending in <1234>. Please allow two minutes for your code to arrive. If necessary, you can request up to <5> more codes.',
    emailMessageSuccess: 'email',
    phoneMessageSuccess: 'phone'
  },

  PATTERN: {
    EMAIL: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    NAME: '^[-a-zA-Z ]+$',
    PHONE: '^(.*[0-9]){10}$'
  }
};
