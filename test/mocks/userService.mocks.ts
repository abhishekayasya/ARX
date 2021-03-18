import { ProfileModel } from '@app/models/profile.model';

export const u_info = {
  basicProfile: {
    login: 'digicathritn1806@yopmail.com',
    email: 'kannan.x.srinivasan@walgreens.com',
    firstName: 'Digicathritn',
    lastName: 'Digicathritn',
    dateOfBirth: '02/06/1988',
    homeAddress: {
      street1: '49 SURYA ENCLAVE  TRIMULGHERRY, ',
      city: 'HYDERABAD',
      state: 'TX',
      zipCode: '500010'
    },
    phone: [
      {
        number: '9176480955',
        phoneId: '50003800001',
        priority: 'P',
        type: 'home'
      },
      {
        number: '2340973249',
        phoneId: '50003800002',
        priority: 'A1',
        type: 'work'
      },
      {
        number: '9176480934',
        phoneId: '50003800003',
        priority: 'A2',
        type: 'cell'
      }
    ],
    gender: 'Female',
    memberSince: '2019-09-30 07:07:53:490',
    userType: 'RX_AUTH',
    securityQuestion: 'What was your favorite place to visit as a child?',
    registrationDate: '2019-09-30 07:07:53:490',
    createdUser: 'ACS_REG'
  },
  profileId: '11950421547',
  acctStatus: 'ACTIVE'
};

export const jsonUsr: ProfileModel = {
  basicProfile: {
    dateOfBirth: '01-01-2000',
    email: 'adff.@afsdf.com',
    userName: 'sdaff',
    login: 'dgg',
    lastName: 'ghfd',
    firstName: 'gfhdfg',
    gender: 'gfghdf',
    memberSince: '',
    oldEmail: 'fgdh@hgsdg.com',
    phone: [
      {
        number: '1234567899',
        phoneId: 'h',
        priority: 'high',
        type: 'home'
      }
    ],
    securityQuestion: 'tryert',
    userType: ''
  },
  profileId: 'dsfgsd',
  regType: 'fgdh'
};

export const memberData = {
  _body: {
    messages: [
      {
        code: 'WAG_I_FA_1010',
        message: 'No family members',
        type: 'INFO'
      }
    ],
    adminProfiles: [
      {
        firstName: 'Digicaone',
        lastName: 'Digicaone',
        profileId: '11949784148',
        emailId: 'manisolamen7@outlook.com'
      }
    ]
  },
  status: 200,
  ok: true,
  statusText: 'OK',
  headers: {
    'cache-control': [
      'no-cache',
      ' no-store',
      ' max-age=0',
      ' must-revalidate'
    ],
    'content-type': ['application/json;charset=UTF-8'],
    date: ['Wed', ' 27 Nov 2019 07:47:23 GMT'],
    expires: ['0'],
    pragma: ['no-cache'],
    server: ['nginx/1.16.1'],
    status: ['200'],
    'x-content-type-options': ['nosniff'],
    'x-envoy-upstream-service-time': ['42'],
    'x-oneagent-js-injection': ['true'],
    'x-wag-acs': ['q01'],
    'x-xss-protection': ['1; mode=block']
  },
  type: 2,
  url:
    'https://ngarx.photon.com/api/familymgmt/csrf-disabled/members/fullaccess'
};
