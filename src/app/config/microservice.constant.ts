export const Microservice = {
  drugDetails: '/rx-druginfo/drugdetails',
  prescriptionSearch: '/rx-refillhub/csrf-disabled/prescriptions/search',
  userInfo: '/account/csrf-disabled/userInfo',
  user_unread_count: '/rx-psm/csrf-disabled/unread/count/ARX',
  user_insurance_status: '/rx-settings/csrf-disabled/svc/insurance/status',
  retrieve_insurance: '/rx-settings/csrf-disabled/svc/insurance/retrieve',
  submit_insurance: '/rx-settings/csrf-disabled/svc/insurance/submit',

  mailservice_address_fetch: '/account/csrf-disabled/addresses',
  mailservice_address_delete: '/account/csrf-disabled/addresses/{0}',
  mailservice_address_add: '/account/csrf-disabled/addresses',
  mailservice_address_update: '/account/csrf-disabled/addresses/{0}',

  home_delivery_address_update:
    '/rx-checkout/csrf-disabled/svc/updateusershippingaddress',
  remove_rx: '/rx-checkout/csrf-disabled/svc/removerx',

  fm_search_adult: '/familymgmt/csrf-disabled/members/adult',
  fm_invite_adult: '/familymgmt/csrf-disabled/members/adult',
  fm_invitations: '/familymgmt/csrf-disabled/members/invitations',
  fm_accept_invitation: '/familymgmt/csrf-disabled/members/invitations/{0}',
  fm_delete_invitation: '/familymgmt/csrf-disabled/members/invitations/{0}',
  fm_invite_auth_option: '/rx-profile/csrf-disabled/familyReg/options',

  personal_info_get: '/account/csrf-disabled/userInfo',
  personal_info_submit: '/account/csrf-disabled/userInfo',

  full_access: "/familymgmt/csrf-disabled/members/fullaccess",

  fm_add_child: '/familymgmt/csrf-disabled/members/child',
  fm_confirm_child: '/familymgmt/csrf-disabled/members/child',
  fm_invite_child: '/familymgmt/csrf-disabled/members/child',
  fm_auth_kba: '/rx-profile/csrf-disabled/familyReg/kba/1',
  fm_auth_kba_validate: '/rx-profile/csrf-disabled/familyReg/kba/2',
  fm_auth_phone_validate: '/rx-profile/familyReg/phone',

  security_info_update: '/account/csrf-disabled/userInfo',

  autorefill_toggle: '/rx-refillhub/csrf-disabled/svc/prescriptions/autoRefill',
  autorefill_load: '/rx-refillhub/csrf-disabled/svc/autorefill/load',
  autorefill_save: '/rx-refillhub/csrf-disabled/svc/autorefill/save',
  rxHistory_pop_up: '/rx-status/csrf-disabled/fillhistory',
  hide_unhide_presc: '/rx-refillhub/csrf-disabled/profiles/prescription/{0}',
  refillhub_addtocart: '/rx-refillhub/csrf-disabled/prescription/addtocart',

  buyout_status: '/rx-refillhub/csrf-disabled/buyout/status/ARX',
  buyout_authenticate_rx:
    '/rx-refillhub/csrf-disabled/buyout/authenticateRx/ARX',
  buyout_search: '/rx-refillhub/csrf-disabled/buyout/search/ARX',
  checkout_speciality_address_change:
    '/rx-checkout/csrf-disabled/svc/selectaddress',
  validateaddress: `/rx-checkout/csrf-disabled/svc/validateaddress`,

  get_ccToken: '/rx-creditcard/csrf-disabled/ccToken',
  add_update_cc_sp: '/rx-checkout/csrf-disabled/svc/srxpayments',

  checkout_review: '/rx-checkout/csrf-disabled/svc/review',
  checkout_submit: '/rx-checkout/csrf-disabled/svc/submit',
  checkout_confirm: '/rx-checkout/csrf-disabled/svc/confirmorder',
  scriptmed_linkage: '/rx-settings/csrf-disabled/smLinkage',

  // health history microservice urls
  health_history_retrieve:
    '/rx-settings/csrf-disabled/svc/healthhistory/retrieve',
  health_history_drugsearch:
    '/rx-settings/csrf-disabled/svc/healthhistory/drugsearch',
  newrx_drugsearch: '/productsearch/v1/drugtypeahead?q={0}',
  health_history_medications_drugsearch: 'rx-druginfo/drugcontents/search/{0}',
  health_history_delete:
    '/rx-settings/csrf-disabled/svc/healthhistory/deleteDrugDosage',
  health_history_submit: '/rx-settings/csrf-disabled/svc/healthhistory/submit',

  retrieve_expresspay:
    '/rx-settings/csrf-disabled/svc/expressPay/retrieveCreditCard',
  submit_expresspay:
    '/rx-settings/csrf-disabled/svc/expressPay/submitCreditCard',
  registration_insurance_information:
    '/rx-settings/csrf-disabled/svc/insurance/retrieve',
  profile_UserInfo: '/profile/csrf-disabled/userInfo',
  registration_hipaa: '/rx-profile/csrf-disabled/hipaa',
  registration_consent: '/account/csrf-disabled/commpref/consent',

  authenticate_sendcode: '/profile/csrf-disabled/sendcode',
  productsearch_drugtypeahead: '/productsearch/v1/drugtypeahead?q={0}',
  // stg environment
  hd_new_review_submit: '/arxwp/natpdfgen/natpresc0',
  hd_newRx_confirmation: '/ebm/sendmail/nrxemailconf',
  hd_transfer_review_submit: '/arxwp/natpdfgen/natpresctrx1',
  hd_transferRx_confirmation: '/ebm/sendmail/trxemailconf',
  //harmony
  harmony_entry: '/auth/csrf-disabled/oauth/token',

  //Script Med consent logging
  log_sm_consent: '/arxwp/consent',

  //send registration success confirmation email
  register_success_email: '/ebm/sendmail/newaccount',

  //script med orders
  sm_orders: '/arxwp/order/{0}'

};

