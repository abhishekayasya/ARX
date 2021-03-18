const signup = {
  messages: [
    {
      code: 'WAG_W_REG_1046',
      message: 'Single match not found.Please enter your address details.',
      type: 'WARN'
    }
  ]
};
const signup1 = {
  messages: [
    {
      code: 'WAG_W_REG_1047',
      message: 'Single match not found.Please enter your address details.',
      type: 'WARN'
    }
  ]
};
const FormData = {
  firstName: 'test name',
  lastName: 'test last',
  dateOfBirth: '02/06/1993',
  phoneNumber: '9375934857',
  phoneType: 'Cell',
  login: 'user1testing12367@test.com',
  password: 'user2',
  securityQuestionCode: '4',
  securityQuestionAnswer: 'test quest',
  declaration: 'test...'
};
const checkemail = { userNameExist: false };
const checkemail1 = {
  messages: [
    {
      code: 'WAG_I_CREDENTIALS_1020',
      message: 'login.jsp',
      type: 'INFO'
    }
  ]
};
const checkPassword = {
  messages: [
    {
      code: 'WAG_I_CREDENTIALS_1020',
      message: 'Password validation is success',
      type: 'INFO'
    }
  ]
};
const checkPassword_error = {
  messages: [
    {
      code: 'WAG_W_CREDENTIALS_1013',
      message: 'Your password must contain both numbers and letters.',
      type: 'WARN'
    },
    {
      code: 'WAG_W_CREDENTIALS_1011',
      message: 'Password needs to have a minimum of 8 characters.',
      type: 'WARN'
    }
  ]
};

export { signup,signup1, FormData, checkPassword, checkPassword_error, checkemail, checkemail1 };
