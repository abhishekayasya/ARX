export const GA = {
  categories: {
    registration: 'Registration',
    checkout_speciality: 'Speciality Checkout',
    checkout_mail: 'HomeDelivery Checkout',
    checkout_combo: 'Combo Checkout',
    manage_prescriptions: 'Manage Prescriptions',
    my_account_personal_info: 'myaccount/personalinfo',
    my_account_express_pay: 'myaccount/expresspay',
    my_account: 'myaccount',
    hd_transfer_prescription:
      '/transfer-home-delivery-prescription/prescription',
    hd_enroll_insurance: 'transfer-home-delivery-prescription/enroll-insurance',
    hd_transfer: 'transfer-home-delivery-prescription/review',
    hd_new_prescription: '/new-home-delivery-prescription/prescription',
    new_rx_prescription_review: 'new-home-delivery-prescription/review',
    health_info_section_specialty_checkout:
      '/specialty-checkout/health information',
    hd_new_prescription_signed_out_state: 'Zero',
    hd_new_prescription_signed_in_state: '',
    hd_transfer_prescription_signed_out_state: 'Zero',
    hd_transfer_prescription_signed_in_state: '',
    hd_new_rx_enroll_insurance:
      'new-home-delivery-prescription/enroll-insurance'
  },

  actions: {
    registration: {
      signup: 'Create Account',
      address: 'Additional Information',
      upgrade: 'Upgrade Account',
      verify_identity: 'Verify Identity',
      consent: 'Consent',
      hipaa: 'Notice of Privacy Practices',
      insurance: 'Enter Insurance Information',
      success: 'Confirmation'
    },
    
    addressInfo: {
      sso: 'SSO - Completed Address Info Page',
      liteReg: 'Lite Reg - Completed Address Info Page',
      fullReg: 'Full Reg - Completed Address Info Page'
    },
    enrollinsurance: {
      patientname: 'Patient name',
      addinsurance: 'Add insurance',
      cancelbutton: 'Cancel'
    },

    checkout_speciality: {
      review: 'Review',
      add_address: 'Add Address',
      add_payment: 'Add Payment',
      edit_address: 'Edit Address',
      update_payment: 'Update Payment',
      submission_cleansed: 'Cleansed Submission',
      submission_unsolicited: 'Unsolicited Submission',
      require_assistance: 'Requires further assistance',
      require_pharmacist_to_contact: 'Requires pharmacist contact'
    },

    checkout_mail: {
      review: 'Review',
      load_address: 'Load Addresses',
      add_address: 'Add Address',
      edit_address: 'Edit Address',
      submission: 'Submission'
    },
    checkout_combo: {
      review_HD: 'HomeDelivery Review',
      load_address_HD: 'HomeDelivery Load Addresses',
      add_address_HD: 'HomeDelivery Add Address',
      edit_address_HD: 'HomeDelivery Edit Address',
      submission_HD: 'HomeDelivery Submission',

      review_speciality: 'Speciality Review',
      add_address_speciality: 'Speciality Add Address',
      add_payment_speciality: 'Speciality Add Payment',
      edit_address_speciality: 'Speciality Edit Address',
      update_payment_speciality: 'Speciality Update Payment',
      submission_cleansed_speciality: 'Speciality Cleansed Submission',
      submission_unsolicited_speciality: 'Speciality Unsolicited Submission'
    },
    hd_transferprescription: {
      removal: 'Delete Rx',
      cancel: 'Cancel',
      patientName: 'Patient name'
    },

    manage_prescriptions: {
      view_address: 'View Address Link',
      search_rx: 'Search Rx',
      pres_name_hyperlink_to_health_history:
        'Prescription Name Hyperlink To Health History',
      drug_image_hyperlink_to_health_history:
        'Drug Image Link To Health History',

      rx_card_hide_prescription: 'Hide Prescription',
      rx_card_unHide_prescription: 'Unhide Prescription',

      auto_refill_button_click: 'Auto Refill Button On Click',
      active_folder_hide_address_link: 'Hide Address Link',
      active_folder_auto_refill_edit_address_link:
        'Active Folder Rx Card | Auto Refill Edit Address Link',

      rx_card_view_status: 'Rx Card View Status',

      sort_by_rx_name: 'Sort By Rx Name',
      sort_by_last_fill: 'Sort By Last Fill',
      sort_by_refills_remaining: 'Sort By Refills Remaining',

      filter_by_a_prescriber: 'Filter By A Prescriber',
      filter_by_specialty_pharmacy: 'Filter By Specialty Pharmacy',
      filter_by_home_delivery_pharmacy: 'Filter By Home Delivery Pharmacy',
      filter_history_link_click: 'Filter History Link',

      request_refill: 'Request Refill',
      health_history_drug_info_overlay_view_full_details:
        'Health History Drug Info Overlay View Full Details',
      health_history_drug_info_overlay_print:
        'Health History Drug Info Overlay Print',
      health_history_drug_info_overlay_close:
        'Health History Drug Info Overlay On Close button Click',
      health_history_drug_info_overlay_Rx_History:
        'Health History Drug Info Overlay | Rx History',
      move_to_active_folder_undo_link: 'Move To Active Folder Undo Link'
    },

    AddPrescription: {
      patientname: 'Patient name',
      removebutton: 'remove',
      addanotherprescription: 'Add another prescription',
      cancelbutton: 'Cancel',
      continuebutton: 'Continue'
    },

    personal_info: {
      edit_info: 'Edit',
      change_family_member: 'Family Member',
      add_family_member: 'Add Manage Family',
      canel_edit_info: 'Cancel',
      save_changes: 'Save Changes',
      add_new_phone_number: 'Add New Phone Number'
    },

    health_info: {
      add_medication: 'Add Medication'
    },

    transfer_rx_info: {
      change_family_member: 'Family Member',
      add_family_member: 'Add Manage Family',
      canel_add_info: 'Cancel',
      save_changes: 'Save Changes',
      add_new_prescription_number: 'Add New Prescription Number'
    },
    hd_newprescription: {
      messagesType: '',
      form_validate: 'Please fill the prescription details',
      exceed_error: 'You have reached the limit of new prescriptions per order'
    },

    new_home_delivery_prescription: {
      add_new_prescription: 'Add another prescription',
      remove_new_prescription: 'Remove prescription',
      new_prescription_cancel_action: 'Cancel',
      new_prescription_continue_action: 'Continue',
      change_active_family_member: 'HD new prescription family member',
      change_doctor_information_action: 'Edit doctor information',
      new_prescription_patient_name: 'Patient name',
      new_prescription_phone_no_speciality_pharmacy:
        'phone number specialty pharmacy',
      new_prescription_fax_form_english: 'prescription fax form English',
      new_prescription_fax_form_spanish: 'prescription fax form Spanish',
      new_prescription_remove_prescription_link: 'remove prescription link',
      new_prescription_checkbox: 'Generic equivalent',
      new_prescription_more_detail_click_action:
        'New HD prescription more details',
      new_prescription_less_detail_click_action:
        'New HD prescription less details',
      new_rx_fax_form_english: 'prescription fax form English',
      new_rx_fax_form_spanish: 'prescription fax form Spanish',
      new_hd_rx_signedout_state: 'Request new prescription',
      new_hd_rx_signedin: 'Landing Page - Signed in state',
      new_hd_rx_remove_rx_modal_confirm_yes: 'Remove prescription',
      new_hd_rx_remove_rx_modal_confirm_no: 'No, go back Remove prescription',
      new_hd_rx_remove_rx_modal_cancel_request: 'Cancel request',
      new_hd_rx_remove_rx_modal_no_goback_request: 'No go back request ',
      new_hd_rx_signed_out_state: 'Request new prescription',
      new_hd_rx_signed_in_state: 'Request new prescription',
      new_hd_rx_phoneno_specialty_pharmacy: 'phone number specialty pharmacy'
    },

    transfer_home_delivery_prescription: {
      add_another_transfer_prescription: 'Add another prescription',
      transfer_prescription_patient_name: 'Patient name',
      remove_transfer_prescription: 'Remove transfer prescription',
      transfer_prescription_cancel_action: 'Cancel link button',
      transfer_prescription_continue_action: 'Continue button',
      transfer_hd_rx_remove_rx_modal_confirm_yes: 'Remove prescription',
      transfer_hd_rx_remove_rx_modal_confirm_no:
        'No, go back remove prescription',
      transfer_hd_rx_remove_rx_modal_cancel_request: 'Cancel request',
      transfer_hd_rx_remove_rx_modal_no_goback_request: 'No go back request ',
      hd_transfer_rx_signed_out_state: 'Request transfer prescription',
      hd_transfer_rx_signed_in_state: 'Request transfer prescription'
    },

    new_hd_rx_enroll_insurance: {
      new_rx_enroll_insurance_fax_form_english: 'prescription fax form English',
      new_rx_enroll_insurance_fax_form_spanish: 'prescription fax form Spanish',
      new_rx_enroll_insurance_patient_name: 'Patient name',
      new_rx_enroll_insurance_add_insurance: 'Add insurance',
      new_rx_enroll_insurance_phone_num_sprx: 'phone number specialty pharmacy',
      new_rx_enroll_insurance_cancel: 'Cancel',
      new_rx_enroll_phoneno_specialty_pharmacy:
        'phone number specialty pharmacy'
    },

    transfer_hd_rx: {
      transfer_hd_rx_signedout: 'Landing Page - Signed out state',
      transfer_hd_rx_signedin: 'Landing Page - Signed in state'
    },

    express_pay: {
      edit_express_pay_card: 'Edit',
      delete_express_pay_card: 'Delete card',
      save_express_pay_card: 'Save card',
      cancel_express_pay_card: 'Cancel'
    },

    my_account: {
      refill_prescriptions_btn: 'refill Rxs',
      check_status_btn: 'check status',
      messages_tab: 'messages',
      personal_info_link: 'personal information',
      security_info_link: 'security',
      emails_notifications_link: 'emails and notifications',
      insurance_info_link: 'insurance information',
      health_history_link: 'health history',
      express_pay_link: 'expresspay',
      prescriptions_records_link: 'prescription records',
      make_a_payment_link: 'make a payment',
      family_acc_management_link: 'family account management',
      change_active_family_member: 'family member',
      add_active_family_member: 'add manage family',
      pres_record_close_action: 'Walgreens.com overlay close',
      pres_record_cancel_action: 'Walgreens.com overlay cancel',
      pres_record_continue_action: 'Walgreens.com overlay continue',
      make_payment_close_action: 'Walgreens.com overlay close',
      make_payment_cancel_action: 'Walgreens.com overlay cancel',
      make_payment_continue_action: 'Walgreens.com overlay continue'
    },
    hd_transfer: {
      all: 'All information is on file',
      zero_state: 'Update Shipping address',
      edit: 'Edit Transfer Prescriptions',
      editShippingAddress: ' Edit Shipping address',
      cancel: 'Cancel',
      cancelReq: 'Cancel request',
      submitRequest: 'Submit request',
      Cancel_Shipping_address: 'Cancel Shipping address',
      Update_Shipping_address: 'Update Shipping address'
    },
    new_rx_prescription_review: {
      edit_prescription: 'Edit New Prescriptions',
      edit_shipping_address: 'Edit Shipping address',
      cancel_request_button: 'Cancel',
      submit_request_button: 'Submit request',
      cancel_address_button: 'Cancel Shipping address',
      update_address_button: 'Update Shipping address',
      add_address_button: 'Add Shipping address',
      modal_open: 'Modal Open',
      remove_modal: 'Remove Modal',
      no_go_back: 'No go back',
      yes_cancel: 'Delete Rx'
    }
  },

  label: {
    hd_refill_reminder: 'Home Delivery Refill Reminder',
    rx_card: 'Rx Card',
    active_folder_rx_card: 'Active Folder Rx Card',
    hidden_folder_rx_card: 'Hidden folder Rx Card',
    active_folder: 'Active Folder',
    hidden_folder: 'Hidden Folder',
    health_history_drug_info_overlay: 'Health History Drug Info Overlay',
    personal_info: 'Personal Info',
    edit_form: 'edit form',
    express_pay: 'ExpressPay',
    prescription_records: 'prescription records',
    make_a_payment: 'make a payment',
    hd_transfer_rx: 'HD Transfer Prescription',
    new_prescription_review: 'Cancel request',

    new_hd_rx: {
      hd_new_rx: 'HD New Prescription',
      hd_new_rx_change_member: 'changed member patient name',
      hd_new_rx_moredetails: 'More Details',
      hd_new_rx_lessdetails: 'Less Details',
      hd_new_rx_patientname: '',
      hd_new_rx_generic_equivalent: 'Generic equivalent',
      hd_new_rx_change_doctor_info: 'Edit doctor information',
      hd_new_rx_remove_rx_modal_confirm_yes: 'Remove prescription ',
      hd_new_rx_remove_rx_modal_confirm_no: 'No, go back remove prescription ',
      hd_new_rx_add_new_prescription: 'Add another prescription',
      hd_new_rx_signed_out_state: 'Request new prescription',
      hd_new_rx_signed_in_state: 'Request new prescription'
    },

    transfer_home_delivery_prescription: {
      express_pay: 'ExpressPay',
      hd_transfer_rx: 'HD Transfer Prescription',
      hd_transfer_rx_change_member: 'changed member patient name',
      hd_transfer_rx_patientname: 'Patient Name',
      hd_transfer_rx_remove_rx_modal_confirm_yes: 'Remove prescription ',
      hd_transfer_rx_remove_rx_modal_confirm_no:
        'No, go back remove prescription ',
      hd_transfer_rx_signed_out_state: 'Request transfer prescription',
      hd_transfer_rx_signed_in_state: 'Request transfer prescription'
    }
  },

  data: {
    new_home_delivery_prescription: {
      changed_active_family_member: 'changedActiveMemberId: ',
      hd_rx_patientname: '',
      hd_rx_generic_equivalent_checkbox: 'Generic equivalent: ',
      hd_rx_change_doctor_info: 'changedDoctorInformation: ',
      hd_new_rx_signed_out_state: 'Guest',
      hd_new_rx_signed_in_state: 'Member',
      hd_new_rx_remove_prescription: 'Delete Rx'
    },

    transfer_home_delivery_prescription: {
      changed_active_family_member: 'changedActiveMemberId: ',
      hd_rx_patientname: '',
      hd_rx_generic_equivalent_checkbox: 'genericEquivalentCheckbox: ',
      hd_rx_change_doctor_info: 'changedDoctorInformation: ',
      hd_transfer_rx_signed_out_state: 'Guest',
      hd_transfer_rx_signed_in_state: 'Member'
    },
    new_hd_rx_enroll_insurance: {
      enroll_insurance_patient_name: 'Patient name'
    }
  },

  dimension: {
    prescription_count: 'PrescriptionCount',
    mail_state: 'HomeDeliveryState',
    speciality_cleansed_state: 'SpecialityCleansedState',
    speciality_unsolicited_state: 'SpecialityUnsolicitedState',
    price: 'TotalPrice'
  }
};

export const TwoFaGA = {
  action: {
    tollFree: 'Toll-free number',
    continue: 'Continue',
    secQuestion: 'Security question verification',
    work: 'Work Phone verification',
    home: 'Home Phone verification',
    cell: 'Cell Phone verification',
    email: 'Email verification',
    back: 'Back to Previous page',
    codeEmail: ' Request a new code',
    maxAttempt: 'Maximum attempts',
    closebutton: 'Invalid code entered',
    codeResent: 'Code resent',
    contactSpecialty: 'Contact Specialty Pharmacy',
    contactHome: 'Contact Home Delivery',
    pca_confirmation: 'Confirm Cancel',
    pca_delete: 'Confirm Delete',
    pca_remove: 'Remove prescription',
    pca_addprescription: 'Add another prescription',
    status: 'Status',
    refill: 'Refills',
    pca_cancel: 'Cancel',
    pca_submit: 'Submit request',
    pca_new_landing: 'New Rx Request',
    pca_transfer_landing: 'Transfer Rx Request',
    pca_generic: 'Generic equivalent',
    confirmCancel: 'Confirm Cancel',
    editPatientInfo: 'Edit Patient Information',
    editPrescriptions: 'Edit Prescriptions',
    editShippingAddress: 'Edit Shipping address',
    cancel: 'Cancel',
    submitRequest: 'Submit request',
    editPrescriptionInfo: 'Edit Prescription Information',
    editDoctorInfo: 'Edit doctor information',
    orderstatus_fam_mem_add: 'Family account management',
    orderstatus_fam_mem_changed: 'Family member changed',
    scheduledelivery: 'Schedule delivery',
    editAddress: 'Edit Address',
    sideEffects: 'Side Effects',
    confirmInformation: 'All health information declared',
    drugAllergies: 'Drug Allergies declared',
    addDrug: 'Add drug allergy',
    addMorePres: 'Add more prescriptions',
    presNotVisible: 'Prescription not visible',
    presChange: 'Prescription Change',
    presQuantity: 'Prescription Quantity',
    insurance: 'Insurance/billing question',
    changeDelivery: 'Change delivery date',
    removePrescription: 'Remove prescription',
    preferredDate: 'Preferred date not available',
    addHealthCondition: 'Add health condition',
    addMedication: 'Additional medication declared',
    addCreditCard: 'Add credit card',
    reqDiffRX: 'Request Different Prescription',
    healthConditionsDeclared: 'Health Conditions declared',
    agreePricingTerms: 'Agree to Pricing & Delivery terms',
    newInsurance: 'New Insurance'
  },
  category: {
    getCode: 'login/verification',
    emailSent: 'login/verification/code-sent-email',
    emailSentError: 'login/verification/code-sent-email/error/',
    emailMaxCodeSent: 'login/verification/code-sent-email/error/max-attempts',
    securityQuestion: 'login/verification/security-question',
    securityQuestionError: 'login/verification/security-question/error',
    codeSent: 'login/verification/code-sent-text',
    codeSentError: 'login/verification/code-sent-text/error',
    phoneMaxCodeSent: 'login/verification/code-sent-text/error/max-attempts',
    secQuesMaxAttempt:
      'login/verification/security-question/error/max-attempts',
    orderStatus: 'orderstatus',
    pca_rx_prescription_review: 'new-home-delivery-prescription/review-pca',
    pca_Prescription: 'new-home-delivery-prescription/prescription-pca',
    manage_prescriptions: 'manageprescriptions',
    pca_Landing: 'HDRxrequest',
    transferReview: 'transfer-home-delivery-prescription/review-pca',
    transfer: 'transfer-home-delivery-prescription/prescription-pca',
    orderstatus_dropdown: 'orderstatus',
    attention_needed: 'orderstatus/attention-needed',
    specialty_checkout: '/specialty-checkout',
    specialty_checkout_Clinical_review: 'specialty-checkout/clinical-review',
    specialty_checkout_confirm_info: 'specialty-checkout/health information',
    furtherAssistReq:
      'specialty-checkout/clinical-review/further-assistance-required',
    speciality_checkout_health_information:
      '/specialty-checkout/health information',

  }
};
