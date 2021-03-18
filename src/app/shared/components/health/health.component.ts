import { Component, OnInit, Input } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { AppContext } from '@app/core/services/app-context.service';
import { RefillBaseService } from '@app/core/services//refill-base.service';
import { Title } from '@angular/platform-browser';
import { Microservice } from '@app/config';

@Component({
  selector: 'arxrf-myaccount-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit {
  @Input() isBuyout = false;
  loaderState = true;
  loaderOverlay = false;

  ROUTES = ROUTES;

  user: string;
  activeMemberID;
  members;
  showMembersDD = false;

  mode = 'preview';
  sub_success = 'Your information was updated successfully.';
  pageTitle: string;

  showAllergiesSearch = false;

  history = <
    {
      additionalMeds: Array<any>;
      healthConditions: Array<any>;
      drugAllergies: Array<any>;
    }
  >{};

  showConditionsSearch = false;
  showMedicationsSearch = false;
  medText: string;

  constructor(
    private _http: HttpClientService,
    private _message: MessageService,
    private _common: CommonUtil,
    private _userService: UserService,
    private _RefillBaseService: RefillBaseService,
    private _title: Title,
    public appContext: AppContext
  ) {
    this.medText = this.appContext.isSpsite
      ? ""
      : " and Walgreens";
    this._common.removeNaturalBGColor();

    // set currentUser
    if (sessionStorage.getItem(AppContext.CONST.memberActiveKey)) {
      this.activeMemberID = JSON.parse(
        sessionStorage.getItem(AppContext.CONST.memberActiveKey)
      ).active;
    } else {
      if (this._userService.user) {
        this.activeMemberID = this._userService.user.id;
      }
    }

    this.getUserName();

    //if user insurance enroll flow then show insurance added success message
    if (window.sessionStorage.getItem('insurance_enroll_flow')) {
      this.displayInsuranceSuccessMsg();
    }
  }

  ngOnInit(): void {
    this.fetchHealthHistory();
    this.getUserName();
    this.pageTitle = this._title.getTitle();
  }

  isPrimaryAccount(): Boolean {
    return this._userService.user.id === this.activeMemberID;
  }

  fetchHealthHistory() {
    // const url = `/svc/profiles/${this.activeMemberID}/healthhistory`;
    // this._http.getData(url)
    const url = Microservice.health_history_retrieve;
    const requestPayload = {
      flow: 'ARX'
    };

    // For child account we need to add fId as memmber Id
    if (!this.isPrimaryAccount()) {
      requestPayload['fId'] = this.activeMemberID;
    }

    this._http.postData(url, requestPayload).subscribe(
      response => {
        this.loaderState = false;
        this.history = <any>{};
        if (response.message !== undefined) {
          this._message.addMessage(
            new Message(
              response.message.message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else {
          if (!response.healthInfo) {
            this.history.additionalMeds = [];
            this.history.healthConditions = [];
            this.history.drugAllergies = [];
          } else {
            this.history.additionalMeds = response.healthInfo.additionalMeds
              ? response.healthInfo.additionalMeds
              : [];
            this.history.healthConditions = response.healthInfo.healthConditions
              ? response.healthInfo.healthConditions
              : [];
            this.history.drugAllergies = response.healthInfo.drugAllergies
              ? response.healthInfo.drugAllergies
              : [];
          }
        }
      },
      error => {
        this.loaderState = false;
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  /**
   * close allergies search window.
   *
   * @param event
   */
  closeAllergies(event) {
    this.showAllergiesSearch = event;
  }

  updateAllergies(event) {
    this.submitHealthData('Drug Allergies', event);
  }

  /**
   * close conditions search window.
   *
   * @param event
   */
  closeConditions(event) {
    this.showConditionsSearch = event;
  }

  updateConditions(event) {
    this.submitHealthData('Health Conditions', event);
  }

  /**
   * close medications search window.
   *
   * @param event
   */
  closeMedications(event) {
    this.showMedicationsSearch = event;
  }

  updateMedications(event) {
    this.submitHealthData('Medications', event);
  }

  submitHealthData(type: string, list: Array<any>): void {
    this.loaderState = true;
    this.loaderOverlay = true;

    const requestPayload = {
      healthHistoryType: type,
      drugList: []
    };

    if (!this.isPrimaryAccount()) {
      requestPayload['fId'] = this.activeMemberID;
    }

    list.forEach(item => {
      const obj = this._userService.getDrugObj(type, item);
      requestPayload.drugList.push(obj);
    });
    this._http
      .postData(Microservice.health_history_submit, requestPayload)
      .subscribe(
        response => {
          this.loaderState = false;
          this.loaderOverlay = false;
          if (response.message.code === 'WAG_I_HEALTH_HISTORY_SUBMIT_010') {
            // this.mode = 'preview';
            this._message.addMessage(
              new Message(this.sub_success, ARX_MESSAGES.MESSAGE_TYPE.SUCCESS)
            );
            this.updateValuesLocally(type, list);
          } else {
            this._message.addMessage(
              new Message(
                response.message.message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },

        error => {
          this.onsubmitHealthDataError();
        }
      );
  }

  updateValuesLocally(type: string, list: Array<any>): void {
    switch (type) {
      case 'Medications':
        list.forEach(item => {
          if (this.history.additionalMeds === undefined) {
            this.history.additionalMeds = [];
          }
          const found = this.history.additionalMeds.find(
            exist => item.drugId === exist.drugId
          );
          if (found === undefined) {
            this.history.additionalMeds.push(item);
          }
        });
        break;

      case 'Health Conditions':
        list.forEach(item => {
          if (this.history.healthConditions === undefined) {
            this.history.healthConditions = [];
          }
          const found = this.history.healthConditions.find(
            exist => item.drugId === exist.healthConditionCd
          );
          if (found === undefined) {
            this.history.healthConditions.push({
              healthCondition: item.drugName,
              healthConditionCd: item.drugId
            });
          }
        });
        break;

      case 'Drug Allergies':
        list.forEach(item => {
          this.history.drugAllergies = this.history.drugAllergies
            ? this.history.drugAllergies
            : [];
          const found = this.history.drugAllergies.find(
            exist => {
              if (item.allergyCode) {
              return item.allergyCode === exist.allergyCode;
              } else {
                return item.drugId === exist.drugId;
              }
            }
          );
          if (found === undefined) {
            const obj = {
              allergy: item.drugName
            };
            if (item.allergyCode) {
              obj['allergyCode'] = item.allergyCode;
            } else {
              obj['drugId'] = item.drugId;
            }
            this.history.drugAllergies.push(obj);
          }
        });
        break;
    }
  }

  deleteHealthItem(
    id: string,
    type: string,
    index: number,
    allergyCode: string = null
  ): void {
    this.loaderState = true;
    this.loaderOverlay = true;
    let url;
    let request_payload;
    url = Microservice.health_history_delete;
    request_payload = {
      healthHistoryType: `${type}`,
      drugList: [],
      flow: 'ARX'
    };
    request_payload.drugList.push(this._userService.deleteDrugObj(type, id, allergyCode));

    if (!this.isPrimaryAccount()) {
      request_payload['fId'] = this.activeMemberID;
    }

    this._http.postData(url, request_payload).subscribe(
      response => {
        this.loaderState = false;
        this.loaderOverlay = false;

        if (response.message.code === 'WAG_I_HEALTH_HISTORY_DELETE_006') {
          this._message.addMessage(
            new Message(
              response.message.message,
              ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
            )
          );
          this.removeHealthItemFromList(index, type, id, allergyCode);
        } else if (
          response.message.code === 'WAG_E_HEALTH_HISTORY_DELETE_013'
        ) {
          // if drug allergies doesn't exist on server, remove from list
          this.removeHealthItemFromList(index, type, id, allergyCode);
        } else {
          this._message.addMessage(
            new Message(
              response.message.message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      },

      error => {
        this.onsubmitHealthDataError();
      }
    );
  }

  removeHealthItemFromList(index, type, id, allergyCode) {
    switch (type) {
      case 'Medications':
        this.history.additionalMeds = this.history.additionalMeds.filter(
          item => {
            return item.drugId !== id;
          }
        );
        break;

      case 'Health Conditions':
        this.history.healthConditions = this.history.healthConditions.filter(
          item => {
            return item.healthConditionCd !== id;
          }
        );
        break;

      case 'Drug Allergies':
        this.history.drugAllergies = this.history.drugAllergies.filter(item => {
          if (item.allergyCode) {
          return item.allergyCode !== allergyCode;
          } else {
            return item.drugId !== id;
          }
        });
        break;
    }
  }

  updateMember(activeMemberID) {
    this.activeMemberID = activeMemberID;
    this.loaderState = true;
    this.loaderOverlay = true;
    this.fetchHealthHistory();
    this.getUserName();
  }

  getUserName() {
    const members_cache = JSON.parse(localStorage.getItem('members'));
    if (members_cache !== undefined) {
      this.members = members_cache;
      this.showMembersDD = true;
      this.displayUserName();
    } else {
      const url = '/familymgmt/csrf-disabled/members/fullaccess';
      this._http.postData(url, {}).subscribe(response => {
        this.members = response.members;
        // show members dropdown if there are more than 2 members
        if (this.members !== undefined) {
          this.showMembersDD = true;
          this.displayUserName();
        } else {
          this.user =
            this._userService.user.profile.basicProfile.firstName +
            ' ' +
            this._userService.user.profile.basicProfile.lastName;
        }
      });
    }
  }

  displayUserName() {
    for (const key in this.members) {
      if (this.members[key].profileId === this.activeMemberID) {
        this.user =
          this.members[key].firstName + ' ' + this.members[key].lastName;
      }
    }
  }

  displayInsuranceSuccessMsg() {
    this._message.addMessage(
      new Message(
        'Your insurance was added successfully.',
        ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
      )
    );
  }

  onUpdateClick() {
    if (window.sessionStorage.getItem('insurance_enroll_flow')) {
      this._RefillBaseService.initCheckoutRequest();
    } else {
      this.mode = 'preview';
    }
  }

  buyoutContinue(): void {
    if (sessionStorage.getItem("isBuyoutUser") === 'true') {
      sessionStorage.setItem("u_pp_flow", "true");
      this._common.navigate(ROUTES.refill.absoluteRoute);
    } else {
      this._common.navigate(ROUTES.buyout.children.ppp_auth.absoluteRoute);
    }
  }
  onsubmitHealthDataError() {
    this.loaderState = false;
    this.loaderOverlay = false;

    this._message.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }
}
