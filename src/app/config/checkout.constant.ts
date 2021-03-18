export const CHECKOUT = {

  session: {
    key: 'ck_info',
    combo_key: 'isCombo',
    hd_key: 'isHD',
    sp_key: 'isSP',
    key_hd_data: 'ck_hd',
    key_sp_data: 'ck_sp',
    key_items_hd: 'ck_items_hd',
    key_items_sp: 'ck_items_sp',
    key_order_state_HD: 'hd_state',
    key_srx_reminder: 'ck_srx_rem',
    key_hd_context: 'ck_hd_context',
    key_sp_context: 'ck_sp_context',
    key_nocard : 'ck_nc',
    key_speciality_addresses: 'speciality_addresses'
  },

  type: {
    HD: 'HOMEDELIVERY',
    SU: 'UNSOLICITED',
    SC: 'CLEANSED',
    HDR: 'mailPlanRefillReminder',
    NEWRX: 'New Rx'
  },

  comboState: {
    mail: 'mail,',
    speciality: 'speciality',
    confirmation: 'confirmation'
  }
};
