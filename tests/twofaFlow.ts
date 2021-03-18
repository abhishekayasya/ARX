const userInfo = {
  basicProfile: {
    securityQuestion: 'Where was your wedding reception held?'
  },
  email: 'j***uto@yopmail.com',
  phone: [{ number: '(***) ***-8901 (home)', priority: '0', type: 'home' }],
  securityQuestions: [
    { question: 'in what city or town was your first job?', qcode: 22 }
  ]
};

const securityQuestions = {
  securityQuestions: [
    {
      code: '4',
      question: 'What was your favorite place to visit as a child?'
    },
    { code: '5', question: 'Who was your childhood hero?' },
    { code: '6', question: 'Who was your best friend in grade school?' },
    { code: '10', question: 'What model was your first car?' },
    { code: '14', question: 'On what street was your childhood home?' },
    { code: '15', question: 'What was your childhood nickname?' },
    { code: '16', question: 'Who was your favorite childhood friend?' },
    { code: '17', question: 'What is your oldest sibling\'s middle name?' },
    { code: '18', question: 'What school did you attend for sixth grade?' },
    { code: '19', question: 'What was the name of your first stuffed toy?' },
    { code: '20', question: 'In what city does your nearest sibling live?' },
    { code: '21', question: 'When is your oldest sibling\'s birthday?' },
    { code: '22', question: 'In what city or town was your first job?' },
    { code: '23', question: 'Where was your wedding reception held?' }
  ]
};

const deviceInfo = {
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
  webdriver: 'not available',
  language: 'en-GB',
  colorDepth: 24,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  screenResolution: [900, 1440],
  availableScreenResolution: [877, 1440],
  timezoneOffset: -330,
  timezone: 'Asia/Calcutta',
  sessionStorage: true,
  localStorage: true,
  indexedDb: true,
  addBehavior: false,
  openDatabase: true,
  cpuClass: 'not available',
  platform: 'MacIntel',
  plugins: '937443c9086571637dcb77e2e3767335',
  canvas: 'f963c55bfc0765ebab7ce37fd9ca1b8c',
  webgl: 'c8fc43e2813114e79745aac3632673ea',
  webglVendorAndRenderer: 'Intel Inc.~Intel(R) Iris(TM) Plus Graphics 655',
  adBlock: false,
  hasLiedLanguages: false,
  hasLiedResolution: false,
  hasLiedOs: false,
  hasLiedBrowser: false,
  touchSupport: [0, false, false],
  fonts: '42c346bcd309c782183648db40d17e81',
  audio: '124.04345808873768'
};

const autheticateRes = {
  messages: [
    { code: 'WAG_I_PROFILE_2004', message: 'Login success', type: 'INFO' }
  ],
  links: [{ rel: 'redirect', href: '/youraccount/default.jsp' }]
};

const autheticateRes_1011 = {
  messages: [
    { code: 'WAG_I_LOGIN_1011', message: 'Login success', type: 'INFO' }
  ],
  links: [{ rel: 'redirect', href: '/youraccount/default.jsp' }]
};

const autheticateRes_invalid = {
  messages: [
    { code: 'WAG_I_LOGIN_10000', message: 'Login success', type: 'INFO' }
  ],
  links: [{ rel: 'redirect', href: '/youraccount/default.jsp' }]
};

const autheticateRes_reject = {
  messages: [
    { code: 'WAG_I_LOGIN_10000', message: 'Login success', type: 'INFO' }
  ]
};

const autheticateRes_reject_2039 = {
  messages: [{ code: 'WAG_E_PROFILE_2039', message: 'Error', type: 'ERROR' }]
};

const headerresponse = {
  pat_id: '1ØũſŽěŚŴì÷G*3',
  auth_ind: 'Y',
  hipaa_ind: 'Y',
  rx_user: 'Y'
};

const statusResponse = { insuranceOnFile: 'No' };

export {
  userInfo,
  securityQuestions,
  deviceInfo,
  autheticateRes,
  headerresponse,
  statusResponse,
  autheticateRes_1011,
  autheticateRes_invalid,
  autheticateRes_reject,
  autheticateRes_reject_2039
};
