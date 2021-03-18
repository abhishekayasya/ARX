export const autheticateRes_valid = {
  CONSENT_PROMPT_IND: 'Y',
  messages: [
    { code: 'WAG_I_LOGIN_10000', message: 'Login success', type: 'INFO' }
  ]
};
export const autheticateRes_invalid = {
  CONSENT_PROMPT_IND: 'Y1',
  _body: {
    CONSENT_PROMPT_IND: 'Y',
    messages: [
      {
        code: 'WAG_I_CONSENT_SUCCESS_1001 ',
        message: 'Login success',
        type: 'INFO',
        CONSENT_PROMPT_IND: 'Y'
      }
    ]
  }
};
export const autheticateRes_invalid2 = {
  CONSENT_PROMPT_IND: 'Y1',
  messages: [
    {
      code: 'WAG_I_CONSENT_SUCCESS_1001',
      message: 'Login success',
      type: 'INFO'
    }
  ]
};
export const autheticateRes_invalid3 = {
  CONSENT_PROMPT_IND: 'Y',
  messages: [{ code: '123 ', message: 'Login success', type: 'INFO' }]
};
export const autheticateRes_reject = {
  status: 500,
  messages: [
    { code: 'WAG_I_LOGIN_10000', message: 'Login success', type: 'INFO' }
  ]
};
