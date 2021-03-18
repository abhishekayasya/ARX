export const REG_MAP = {
  signin_message : {
    default: 'Already have an AllianceRx Walgreens Prime account? <a reg_login_content class="font-weight-bold mt-2 mb-3 mt-md-0 mb-md-0" href="/login">Sign In</a>',
    path: '/register/register_login_message'
  },
  consent : {
    path: '/register/consentcontent'
  },
  additional_info_needed: {
    path: '/register/additional-verification-needed',
    default: {
      "description": '&lt;p&gt;We are currently reviewing your information and will email you when we are ready to verify your registration.&lt;br /&gt;\n&lt;br /&gt;\nIf you do not receive an email within three hours of now or want to try verifying another way, please contact our customer service team at &lt;strong&gt;&lt;a class=&#034;phoneNoColor&#034; href=&#034;tel:8779254738&#034;&gt;877-925-4738&lt;/a&gt;&lt;/strong&gt;. Tell the agent you are calling about additional verification needed for your online account.&lt;/p&gt;',
      "jcr:title": 'Additional verification needed'
    }
  },
  please_call_us: {
    path: '/register/please-call-us',
    default: {
      "description": 'We need additional information to verify your identity.<br><br>Please contact our customer service team at <a class="phoneNoColor" href="8779254738">877-925-4738.</a> <br><br> Tell the agent you are calling about additional verification needed for your online account',
      "jcr: title": 'Please call us'
    }
  }
};
