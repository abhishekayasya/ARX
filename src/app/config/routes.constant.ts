export const ROUTES = {
  login: {
    route: "login",
    name: "Login",
    absoluteRoute: "/login",
    module: "../pages/auth/auth.module#AuthModule"
  },
  max_attempts: {
    route: "maximum-attempts-reached",
    name: "Max Attempts Reached",
    absoluteRoute: "/maximum-attempts-reached"
  },
  sso: {
    route: "sso",
    name: "SSO",
    absoluteRoute: "/login/sso",
    module: ""
  },
  forgotUsername: {
    route: "forgot-username",
    name: "Forgot Username",
    absoluteRoute: "/login/forgot-username",
    module: "",
    public_route: "retrieve-username",
    publicUrl: "/retrieve-username"
  },
  contact_us: {
    route: "contact-us",
    name: "ContactUs",
    absoluteRoute: "/login/contact-us",
    publicUrl: "business/contact-us",
    module: ""
  },
  HDRxrequest: {
    route: "HDRxrequest",
    name: "HDRxrequest",
    absoluteRoute: "/HDRxrequest",
    publicUrl: "HDRxrequest",
    module: ""
  },
  usernameSent: {
    route: "username-sent",
    name: "Username Sent",
    absoluteRoute: "/login/forgot-username/username-sent",
    module: "",
    public_route: "retrieve-username-confirmation",
    publicUrl: "/retrieve-username-confirmation"
  },
  forgotPassword: {
    route: "password",
    name: "Forgot Password",
    absoluteRoute: "/password",
    module: "../pages/reset-password/reset-password.module#ResetPasswordModule"
  },
  forgotPasswordCheck: {
    route: "reset",
    name: "Forgot Password",
    absoluteRoute: "/password/reset",
    module: ""
  },
  sendSecurityCode: {
    route: "send-security-code",
    name: "Send Security Code",
    absoluteRoute: "/password/send-security-code",
    module: ""
  },
  submitSecurityCode: {
    route: "submit-security-code",
    name: "Submit Security Code",
    absoluteRoute: "/password/submit-security-code",
    module: ""
  },
  newPassword: {
    route: "new-password",
    name: "New Password",
    absoluteRoute: "/password/new-password",
    module: ""
  },
  registration: {
    route: "register",
    name: "Registration",
    absoluteRoute: "/register",
    module: "../pages/registration/registration.module#RegistrationModule"
  },
  address: {
    route: "address",
    name: "Address",
    absoluteRoute: "/register/address",
    module: ""
  },
  identity: {
    route: "identity",
    name: "Identity",
    absoluteRoute: "/register/identity",
    module: ""
  },
  consent: {
    route: "consent",
    name: "Consent",
    absoluteRoute: "/register/consent",
    module: ""
  },
  hippa: {
    route: "hipaa",
    name: "Hippa",
    absoluteRoute: "/register/hipaa",
    module: ""
  },
  insurance: {
    route: "insurance",
    name: "Insurance",
    absoluteRoute: "/register/insurance",
    module: ""
  },
  success: {
    route: "success",
    name: "Success",
    absoluteRoute: "/register/success",
    module: ""
  },
  logout: {
    route: "logout",
    name: "Logout",
    absoluteRoute: "/logout",
    module: ""
  },
  account: {
    route: "myaccount",
    name: "My Account",
    absoluteRoute: "/myaccount",
    module: "../pages/my-account/my-account.module#MyAccountModule"
  },
  refill: {
    route: "manageprescriptions",
    name: "Refill",
    absoluteRoute: "/manageprescriptions",
    module: "../pages/refill/refill.module#RefillModule"
  },
  status: {
    route: "orderstatus",
    name: "Status",
    absoluteRoute: "/orderstatus",
    module: "../pages/status/status.module#StatusModule"
  },
  status_enhanced: {
    route: "order-status-enhanced",
    name: "Status Enhanced",
    absoluteRoute: "/order-status-enhanced",
    module: "../pages/status-enhanced/status-enhanced.module#StatusEnhancedModule"
  },
  checkout_hd: {
    route: "home-delivery-checkout",
    name: "Home delivery checkout",
    absoluteRoute: "/home-delivery-checkout",
    module:
      "../pages/checkout/home_delivery/home_delivery.module#Home_deliveryModule",
    children: {
      address_book: {
        route: "address-book",
        name: "Home delivery address book",
        absoluteRoute: "/home-delivery-checkout/address-book"
      },
      edit_address: {
        route: "edit-address",
        name: "Home delivery edit address",
        absoluteRoute: "/home-delivery-checkout/edit-address"
      },
      add_address: {
        route: "add-address",
        name: "Home delivery add address",
        absoluteRoute: "/home-delivery-checkout/add-address"
      },
      confirmation: {
        route: "confirmation",
        name: "Home delivery confirmation",
        absoluteRoute: "/home-delivery-checkout/confirmation"
      }
    }
  },
  checkout_sp: {
    route: "specialty-checkout",
    name: "Speciality checkout",
    absoluteRoute: "/specialty-checkout",
    module:
      "../pages/checkout/specialty-checkout/specialty-checkout.module#SpecialtyCheckoutModule",
    children: {
      address_book: {
        route: "address-book",
        name: "Speciality address book",
        absoluteRoute: "/specialty-checkout/address-book"
      },
      edit_address: {
        route: "edit-address",
        name: "Speciality edit address",
        absoluteRoute: "/specialty-checkout/edit-address"
      },
      add_address: {
        route: "add-address",
        name: "Speciality add address",
        absoluteRoute: "/specialty-checkout/add-address"
      },
      confirmation: {
        route: "confirmation",
        name: "Speciality confirmation",
        absoluteRoute: "/specialty-checkout/confirmation"
      },
      add_payment: {
        route: "add-payment",
        name: "Speciality add payment",
        absoluteRoute: "/specialty-checkout/add-payment"
      },
      update_payment: {
        route: "update-payment",
        name: "Speciality add payment",
        absoluteRoute: "/specialty-checkout/update-payment"
      }
    }
  },
  checkout_combined: {
    route: "combined-checkout",
    name: "Combo checkout",
    absoluteRoute: "/combined-checkout",
    module:
      "../pages/checkout/combined-checkout/combined-checkout.module#CombinedCheckoutModule",
    children: {
      home_delivery: {
        route: "home-delivery",
        name: "combo HD",
        absoluteRoute: "/combined-checkout/home-delivery"
      },
      specialty: {
        route: "specialty",
        name: "combo speciality",
        absoluteRoute: "/combined-checkout/specialty"
      },
      confirmation: {
        route: "confirm",
        name: "combo confirmation",
        absoluteRoute: "/combined-checkout/confirm"
      }
    }
  },
  checkout_default: {
    route: "checkout",
    name: "Empty checkout",
    absoluteRoute: "/checkout",
    module:
      "../pages/checkout/checkout_default/default_checkout.module#DefaultCheckModule"
  },
  orderSuccess: {
    route: "success",
    name: "Order Success",
    absoluteRoute: "/submitorder/success",
    module: ""
  },
  personalInfo: {
    route: "personalinfo",
    name: "Personal Information",
    absoluteRoute: "/myaccount/personalinfo",
    module: "../pages/my-account/my-account.module#MyAccountModule"
  },

  securityIformation: {
    route: "securityinfo",
    name: "Security Information",
    absoluteRoute: "/securityinfo",
    module: "../pages/security-info/security-info.module#SecurityInfoModule",
    children: {
      userinfo: {
        route: "userinfo",
        name: "Notification Detail",
        absoluteRoute: "/securityinfo/userinfo"
      },
      security_question: {
        route: "securityquestion",
        name: "Notification Detail",
        absoluteRoute: "/securityinfo/securityquestion"
      },
      verify: {
        route: "verify-identity",
        name: "Notification Detail",
        absoluteRoute: "/securityinfo/verify-identity"
      },
      two_fa: {
        route: "two_fa",
        name: "two fa",
        absoluteRoute: "/securityinfo/two_fa"
      },
      code_sent: {
        route: "code_sent",
        name: "code sent",
        absoluteRoute: "/securityinfo/code_sent"
      },
      security_question_2fa: {
        route: "security_question_2fa",
        name: "Notification Detail",
        absoluteRoute: "/securityinfo/security_question_2fa"
      }
    }
  },

  account_insurance: {
    route: "insurance",
    name: "Insurance Management",
    absoluteRoute: "/myaccount/insurance",
    module: ""
  },

  account_health: {
    route: "health-history",
    name: "Health Management",
    absoluteRoute: "/myaccount/health-history",
    module: ""
  },
  account_notifications: {
    route: "notifications",
    name: "Notifications",
    absoluteRoute: "/notifications",
    module: "../pages/notifications/notifications.module#NotificationsModule",
    children: {
      detail: {
        route: "detail",
        name: "Notification Detail",
        absoluteRoute: "/notifications/detail"
      }
    }
  },
  expressPay: {
    route: "expresspay",
    name: "Express Pay",
    absoluteRoute: "/myaccount/expresspay",
    module: "../pages/my-account/my-account.module#MyAccountModule"
  },

  usps_verification: {
    route: "usps-verification",
    name: "USPS Verification",
    absoluteRoute: "/usps-verification",
    module: ""
  },
  speciality_refill_reminder: {
    route: "specialty-refill-checkout",
    name: "Speciality refill reminder",
    absoluteRoute: "/specialty-refill-checkout",
    module:
      "../pages/refill-reminder/refill-reminder.module#RefillReminderModule"
  },

  harmony_entry: {
    route: "harmony-entry",
    name: "Harmony Entry",
    absoluteRoute: "/harmony-entry",
    module: "../pages/harmony/harmony.module#HarmonyModule"
  },

  home_delivery_refill_reminder: {
    route: "home-delivery-refill-checkout",
    name: "Home delivery refill reminder",
    absoluteRoute: "/home-delivery-refill-checkout",
    module:
      "../pages/HD-refill-reminder/HD-refill-reminder.module#HD_RefillReminderModule",
    children: {
      address_book: {
        route: "address-book",
        name: "Home delivery address book",
        absoluteRoute: "/home-delivery-refill-checkout/address-book"
      },
      edit_address: {
        route: "edit-address",
        name: "Home delivery edit address",
        absoluteRoute: "/home-delivery-refill-checkout/edit-address"
      },
      add_address: {
        route: "add-address",
        name: "Home delivery add address",
        absoluteRoute: "/home-delivery-refill-checkout/add-address"
      },
      confirmation: {
        route: "confirmation",
        name: "Home delivery confirmation",
        absoluteRoute: "/home-delivery-refill-checkout/confirmation"
      }
    }
  },
  verify_identity: {
    route: "verify-identity",
    name: "verify-identity",
    absoluteRoute: "/verify-identity",
    module: ""
  },
  verify_option: {
    route: "verify-option",
    name: "verify-option",
    absoluteRoute: "/verify-option",
    module: ""
  },

  family_management: {
    route: "family-management",
    name: "Family management",
    absoluteRoute: "/family-management",
    module: "../pages/family-manage/family-manage.module#FamilyManageModule",
    children: {
      manage_access: {
        route: "manage-access",
        name: "Manage Access",
        absoluteRoute: "/family-management/manage-access",
        module: ""
      },
      health_update: {
        route: "health-and-insurance",
        name: "Manage Access",
        absoluteRoute: "/family-management/health-and-insurance"
      },
      adult: {
        add: {
          route: "add-adult",
          name: "Add Adult form",
          absoluteRoute: "/family-management/add-adult"
        },
        search_additional: {
          route: "search-adult",
          name: "Search adult by additional info",
          absoluteRoute: "/family-management/search-adult"
        },
        invite: {
          route: "invite-adult",
          name: "Invite an adult",
          absoluteRoute: "/family-management/invite-adult"
        },
        child_found: {
          route: "proposed_under_18",
          name: "Child found",
          absoluteRoute: "/family-management/proposed_under_18"
        }
      },
      child: {
        add: {
          route: "add-child",
          name: "Add Child form",
          absoluteRoute: "/family-management/add-child"
        },
        invite: {
          route: "invite-child",
          name: "Invite a child",
          absoluteRoute: "/family-management/invite-child"
        },
        confirm: {
          route: "confirm-child",
          name: "Child found",
          absoluteRoute: "/family-management/confirm-child"
        }
      },

      invite: {
        route: "account-invite",
        name: "Account invite landing page",
        absoluteRoute: "/family-management/account-invite"
      },
      verify: {
        route: "member-verify",
        name: "Verification page for adult invite",
        absoluteRoute: "/family-management/member-verify"
      }
    }
  },

  buyout: {
    route: "buyout-user",
    name: "Buyout User",
    absoluteRoute: "/buyout-user",
    module: "../pages/buyout/buyout.module#BuyoutModule",
    children: {
      insurance: {
        route: "insurance-info",
        name: "Insurance",
        absoluteRoute: "/buyout-user/insurance-info"
      },
      health: {
        route: "health-info",
        name: "Health",
        absoluteRoute: "/buyout-user/health-info"
      },
      ppp_auth: {
        route: "ppp-auth",
        name: "PPP Auth",
        absoluteRoute: "/buyout-user/ppp-auth"
      }
    }
  },

  missing_insurance: {
    route: "missing-insurance",
    name: "Missing insurance Information",
    absoluteRoute: "/myaccount/missing-insurance",
    module: "../pages/my-account/my-account.module#MyAccountModule"
  },

  clinical_assessment: {
    route: "clinical-assessment",
    name: "Clinical Assessment",
    absoluteRoute: "/clinical-assessment",
    module:
      "../pages/clinical-assessment/clinical-assessment.module#ClinicalAssessmentModule"
  },
  hd_prescription: {
    route: "new-home-delivery-prescription",
    name: "New Home delivery prescription",
    absoluteRoute: "/new-home-delivery-prescription",
    module:
      "../pages/HD-Prescription/hd-prescription.module#HdPrescriptionModule",
    children: {
      prescription: {
        route: "prescription",
        name: "New Home delivery prescription",
        absoluteRoute: "/new-home-delivery-prescription/prescription"
      },
      address_book: {
        route: "address-book",
        name: "New Home delivery prescription address book",
        absoluteRoute: "/new-home-delivery-prescription/address-book"
      },
      edit_address: {
        route: "edit-address",
        name: "New Home delivery prescription edit address",
        absoluteRoute: "/new-home-delivery-prescription/edit-address"
      },
      add_address: {
        route: "add-address",
        name: "New Home delivery prescription add address",
        absoluteRoute: "/new-home-delivery-prescription/add-address"
      },
      review: {
        route: "review",
        name: "New Home delivery prescription review",
        absoluteRoute: "/new-home-delivery-prescription/review"
      },
      confirmation: {
        route: "confirmation",
        name: "New Home delivery prescription confirmation",
        absoluteRoute: "/new-home-delivery-prescription/confirmation"
      },
      confirmation_pca: {
        route: "confirmation-pca",
        name: "PCA New Home delivery prescription confirmation",
        absoluteRoute: "/new-home-delivery-prescription/confirmation-pca"
      },
      enroll_insurance: {
        route: "enroll-insurance",
        name: "Home delivery enrollinsurance",
        absoluteRoute: "/new-home-delivery-prescription/enroll-insurance"
      },
      account_insurance: {
        route: "insurance-lean",
        name: "Insurance Management",
        absoluteRoute: "/new-home-delivery-prescription/insurance-lean"
      },
      new_prescription_patient_info: {
        route: "prescription-pca",
        name: "PatientInfo",
        absoluteRoute: "/new-home-delivery-prescription/prescription-pca"
      }
    }
  },
  hd_transfer: {
    route: "transfer-home-delivery-prescription",
    name: "transfer Home delivery prescription",
    absoluteRoute: "/transfer-home-delivery-prescription",
    module: "../pages/HD-Transfer/hd-transfer.module#Hd_TransferModule",
    children: {
      prescription: {
        route: "prescription",
        name: "transfer  Home delivery prescription",
        absoluteRoute: "/transfer-home-delivery-prescription/prescription"
      },
      prescription_pca: {
        route: "prescription-pca",
        name: "PCA transfer  Home delivery prescription",
        absoluteRoute: "/transfer-home-delivery-prescription/prescription-pca"
      },
      review: {
        route: "review",
        name: "transfer Home delivery prescription review",
        absoluteRoute: "/transfer-home-delivery-prescription/review"
      },
      confirmation: {
        route: "confirmation",
        name: "home delivery transfer prescription confirmation ",
        absoluteRoute: "/transfer-home-delivery-prescription/confirmation"
      },
      confirmation_pca: {
        route: "confirmation-pca",
        name: "home delivery transfer prescription confirmation for PCA",
        absoluteRoute: "/transfer-home-delivery-prescription/confirmation-pca"
      },
      enroll_insurance: {
        route: "enroll-insurance",
        name: "Home delivery enrollinsurance",
        absoluteRoute: "/transfer-home-delivery-prescription/enroll-insurance"
      },
      account_insurance: {
        route: "insurance-lean",
        name: "Insurance Management",
        absoluteRoute: "/transfer-home-delivery-prescription/insurance-lean"
      }
    }
  }
};
