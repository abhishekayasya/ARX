import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { MyAccountContext } from '@app/pages/my-account/components/home/my-account.context';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES, Microservice, KEYS } from '@app/config';
import { NotificationService } from '@app/core/services/notification.service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
import { LinklistModel } from '@app/models/linklist.model';
import { LinkModel } from '@app/models/link.model';

import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { SITEKEY } from '../../../../config/siteKey.constant';

declare var pageContext: MyAccountContext;

@Component({
  templateUrl: './home.component.html',
  selector: 'arxrf-myaccount',
  styleUrls: ['./home.component.scss']
})
export class AccountHomeComponent implements OnInit {
  loaderState = true;
  insuranceStatus: string;
  isGoToExternalLinkModalVisible = false;
  externalLinkToRedirect: string;
  gaEventResourceUrl: string;
  SITEKEY = SITEKEY;
  isBuyoutUnlock: boolean;

  showDefaultLinks = false;

  accountLinks: LinklistModel;
  prescriptionLinks: LinklistModel;

  modalContent = <
    {
      title: string;
      description: string;
      okText: string;
      cancelText: string;
      link: string;
    }
  >{};

  ROUTES = ROUTES;
  siteKey: string;

  constructor(
    private _router: Router,
    public userService: UserService,
    public _common: CommonUtil,
    private _http: HttpClientService,
    private _route: ActivatedRoute,
    public notifications: NotificationService,
    private _httpService: HttpClientService,
    public appContext: AppContext,
    private contentService: JahiaContentService,
    private _gaService: GaService
  ) {
    this.notifications.updateUnreadCount();
    this.siteKey = this.appContext.sitekey;
    localStorage.removeItem(KEYS.reset_flow_flag);
  }

  ngOnInit(): void {
    this.initializeLinksLayout();

    this.checkUserState();
    this.getInsuranceStatus();
    this._common.addNaturalBGColor();
    this.userService.callRefreshToken(); //refresh token to fix the issue on max-age of 86s
  }

  gotoMessages() {
    this.fireMessagesGAEvent();
    this._common.navigate(this.ROUTES.account_notifications.absoluteRoute);
  }

  getInsuranceStatus() {
    const activeMemId = this.userService.getActiveMemberId();

    const requestData = {
      fId: ''
    };

    if (activeMemId === this.userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemId;
    }

    this._httpService
      .postData(Microservice.user_insurance_status, requestData)
      .subscribe(
        response => {
          this.insuranceStatus = response.insuranceOnFile;
          localStorage.setItem('insuranceOnData', response.insuranceOnFile);
        },
        () => {
          this.insuranceStatus = 'No';
        }
      );
  }

  goToExternalLink(event, resource) {
    // this.fireExternalGAEventLinks(resource);
    event.preventDefault();
    this.isGoToExternalLinkModalVisible = true;
    const url = `${this.appContext.walgreensBaseUrl}${resource}`;
    this.externalLinkToRedirect = url;
    this.gaEventResourceUrl = resource;

    this.modalContent = {
      title: 'For this, we\'ll send you to Walgreens.com',
      description: '',
      cancelText: 'Cancel',
      okText: 'Continue',
      link: url
    };
  }

  redirectModalUpdate(event: boolean) {
    // fire GA evernt
    this.fireCloselModalGaEvent(event);

    if (!event) {
      this.isGoToExternalLinkModalVisible = false;
    }
  }

  fireRedirectionHandlerGaEvent(link) {
    const url =
      link.externalUrl && link.externalUrl !== ''
        ? link.externalUrl
        : link.pageUrl;

    if (url === ROUTES.personalInfo.absoluteRoute) {
      // Fire Personal info link GA Event
      this.firePersonalInfoLinkGAEvent();
    } else if (url === ROUTES.securityIformation.absoluteRoute) {
      // Fire Security info link GA Event
      this.fireSecurityInfoLinkGAEvent();
    } else if (url === '/update-notifications') {
      // Fire Email and notification link GA Event
      this.fireEmailsNotificationLinkGAEvent();
    } else if (url === ROUTES.account_insurance.absoluteRoute) {
      // Fire Insurance info link GA Event
      this.fireInsuranceInfiLinkGAEvent();
    } else if (url === ROUTES.account_health.absoluteRoute) {
      // Fire Health history link GA Event
      this.fireHealthHistoryLinkGAEvent();
    } else if (url === ROUTES.expressPay.absoluteRoute) {
      // Fire Express pay link GA Event
      this.fireExpressPayLinkGAEvent();
    } else if (
      url.indexOf('payments') > -1 ||
      url.indexOf('pharmacy/report/rxprint') > -1
    ) {
      // Fire Prescriptions recored/ Make a payment GA Event
      this.fireExternalGAEventLinks(url);
    } else if (url.indexOf(ROUTES.family_management.absoluteRoute) > -1) {
      // Fire Family management link GA Event
      this.fireFamilyAccManagementGAEventLinks();
    }
  }

  redirectionHandler(link: LinkModel) {
    // Fire GA Event on Myaccount Page
    this.fireRedirectionHandlerGaEvent(link);
    if (link.showModel && link.model) {
      this.isGoToExternalLinkModalVisible = true;
      this.modalContent = {
        title: link.model.title,
        description: link.model.description,
        cancelText: link.model.linkText,
        okText: link.model.buttonText,
        link:
          link.externalUrl && link.externalUrl !== ''
            ? link.externalUrl
            : link.pageUrl
      };
    } else if (link.openInNewWindow && !link.showModel) {
      window.open(
        link.externalUrl && link.externalUrl !== ''
          ? link.externalUrl
          : link.pageUrl
      );
    } else if (!link.openInNewWindow && !link.showModel) {
      window.location.href =
        link.externalUrl && link.externalUrl !== ''
          ? link.externalUrl
          : link.pageUrl;
    }
  }

  fireCancelModalGaEvent(redirectAction, link) {
    if (redirectAction) {
      if (link.indexOf('report/rxprint') > -1) {
        // Prescription records Continue button
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.my_account.pres_record_continue_action,
            GA.label.prescription_records
          )
        );
      } else if (link.indexOf('payments') > -1) {
        // Make Payment Continue button
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.my_account.make_payment_continue_action,
            GA.label.make_a_payment
          )
        );
      }
    } else {
      if (link.indexOf('report/rxprint') > -1) {
        // Prescription records Cancel button
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.my_account.pres_record_cancel_action,
            GA.label.prescription_records
          )
        );
      } else if (link.indexOf('payments') > -1) {
        // Make Payment Cancel button
        this._gaService.sendEvent(
          this.gaEvent(
            GA.actions.my_account.make_payment_cancel_action,
            GA.label.make_a_payment
          )
        );
      }
    }
  }

  fireCloselModalGaEvent(action) {
    if (this.modalContent.link.indexOf('report/rxprint') > -1) {
      // Prescription records Close button
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.my_account.pres_record_close_action,
          GA.label.prescription_records
        )
      );
    } else if (this.modalContent.link.indexOf('payments') > -1) {
      // Make Payment Close button
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.my_account.make_payment_close_action,
          GA.label.make_a_payment
        )
      );
    }
  }

  redirectConfirm(event, redirect) {
    event.preventDefault();
    // fire Ga Event
    this.fireCancelModalGaEvent(redirect, this.modalContent.link);

    if (redirect) {
      window.open(this.modalContent.link);
      this.isGoToExternalLinkModalVisible = false;
    } else {
      this.isGoToExternalLinkModalVisible = false;
    }

    this.modalContent = {
      title: '',
      description: '',
      cancelText: '',
      okText: '',
      link: ''
    };
  }

  /**
   * Checking registration state for user and redirecting to specific page
   * if a step is missed.
   */
  checkUserState(): void {}

  getInsuranceStatusToDisplay(): string {
    switch (this.insuranceStatus) {
      case 'No':
        return 'Not on file';

      case 'Pending':
        return 'Pending';

      case 'Yes':
        return 'On file';

      default:
      // doing nothing here
    }
  }

  getInsuranceDescriptionToDisplay(): string {
    switch (this.insuranceStatus) {
      case 'No':
        return 'Insurance is required to refill a Home delivery prescription.';

      case 'Pending':
        return 'It may take up to 48 hours to verify insurance. You can still refill your prescriptions while your insurance is pending.';

      case 'Yes':
        return 'You can now fill your medications with Home delivery pharmacy.';

      default:
      // doing nothing here
    }
  }

  updateInsuranceStatus() {
    this.getInsuranceStatus();
  }

  initializeLinksLayout(): void {
    try {
      if (pageContext) {
        this.initLinksFromJahia();
      } else {
        this.initDefaultLinks();
      }
    } catch (e) {
      this.initDefaultLinks();
    }
  }

  initLinksFromJahia(): void {
    this.contentService.getContent(pageContext.accountLinksContent).subscribe(
      response => {
        this.accountLinks = response;
      },
      error => {
        console.error(error);
      }
    );

    this.contentService
      .getContent(pageContext.prescriptionLinksContent)
      .subscribe(
        response => {
          this.prescriptionLinks = response;
          if(this.appContext.isSpsite) {
            this.prescriptionLinks.links = response.links.filter(link => {
              return (
                link.title == "Health History" ||
                link.title == "Family Account Management"
              );
            });
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  initDefaultLinks(): void {
    this.showDefaultLinks = true;
  }

  // Click events added for links on my account page.
  personalInfoLink() {
    this.firePersonalInfoLinkGAEvent();
  }
  securityInfoLink() {
    this.fireSecurityInfoLinkGAEvent();
  }
  emailsNotificationsLink() {
    this.fireEmailsNotificationLinkGAEvent();
  }
  insuranceInfoLink() {
    this.fireInsuranceInfiLinkGAEvent();
  }
  healthHistoryLink() {
    this.fireHealthHistoryLinkGAEvent();
  }
  expressPayLink() {
    this.fireExpressPayLinkGAEvent();
  }
  fireExternalGAEventLinks(link) {
    if (link.indexOf('pharmacy/report/rxprint') > -1) {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.my_account.prescriptions_records_link)
      );
    } else if (link.indexOf('payments') > -1) {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.my_account.make_a_payment_link)
      );
    }
  }
  familyAccManagementLink() {
    this.fireFamilyAccManagementGAEventLinks();
  }

  fireMessagesGAEvent() {
    this._gaService.sendEvent(this.gaEvent(GA.actions.my_account.messages_tab));
  }
  firePersonalInfoLinkGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.personal_info_link)
    );
  }
  fireSecurityInfoLinkGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.security_info_link)
    );
  }
  fireEmailsNotificationLinkGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.emails_notifications_link)
    );
  }
  fireInsuranceInfiLinkGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.insurance_info_link)
    );
  }
  fireHealthHistoryLinkGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.health_history_link)
    );
  }
  fireExpressPayLinkGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.express_pay_link)
    );
  }
  fireFamilyAccManagementGAEventLinks() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.my_account.family_acc_management_link)
    );
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.my_account;
    event.action = action;
    event.label = label;
    return event;
  }
}
