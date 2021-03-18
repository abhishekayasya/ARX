/**
 * Contains key names for local and session storage.
 */
export const KEYS = {
    // flag to show insurance success message on account home and my prescriptions page.
    insurance_success_flag : 'insurance_success_flag',

    // This flag is stored in local store after checking insurance status.
    // This can be resued if we need to check if user has insurance information on file,
    // and additional service call is not needed to fetch insurance status.
    insurance_key_available: 'insuranceOnData',

    buyout : {
      // flag to show insurance success message when a buyout user is updating
      // insurance and have nothing to unlock.
      only_insurance_flag: 'buytout_only_insurance'
    },

    // flag to show harmony redirect success message on account home.
    harmony_success_flag: 'harmony_success_flag',
    harmony_failure_flag: 'harmony_failure_flag',

    // flag to show reset password flow
    reset_flow_flag: 'reset_flow_flag',

    // Flag to store Specialty refill reminder state in local store
    sp_rr_state_flag: 'sp_rr_state',

    review_page_refresh: 'review_page_refresh'
  };
