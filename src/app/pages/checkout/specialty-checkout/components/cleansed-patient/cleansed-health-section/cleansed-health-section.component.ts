import { Component, Input, OnInit } from "@angular/core";
import { HttpClientService } from "@app/core/services/http.service";
import { PatientModel } from "@app/models/checkout/patient.model";
import { SpecialityService } from "@app/pages/checkout/specialty-checkout/speciality.service";
import { CheckoutService } from "@app/core/services/checkout.service";
import { UserService } from "@app/core/services/user.service";
import { MessageService } from "@app/core/services/message.service";
import { Message } from "@app/models";
import { ARX_MESSAGES, ROUTES, Microservice } from "@app/config";
import { AppContext } from "@app/core/services/app-context.service";
import { GaService } from "@app/core/services/ga-service";
import { GAEvent, GaData, TwoFAEnum } from "@app/models/ga/ga-event";
import { GA, TwoFaGA } from "@app/config/ga-constants";

@Component({
  selector: "arxrf-cleansed-health-section",
  templateUrl: "./cleansed-health-section.component.html",
  styleUrls: ["./cleansed-health-section.component.scss"]
})
// tslint:disable-next-line: class-name
export class cleansedHealthSectionComponent implements OnInit {
  @Input()
  patientData: any;
  @Input()
  payloadIndex;

  profileId: string;
  scriptMedId: any;
  showMedicationsSearch: boolean;
  showAllergiesSearch: boolean;
  showConditionsSearch: boolean;
  user: string;
  meId: any;
  loaderState = false;
  loaderOverlay = false;
  healthinfo_error = "Please confirm to continue";
  healthInfoServiceErr = {
    addMedication: false,
    drugAllergies: false,
    healthConditions: false,
    errMessage: ARX_MESSAGES.ERROR.service_failed
  };
  healthInfo: any = <
    {
      additionalMeds: Array<any>;
      healthConditions: Array<any>;
      drugAllergies: Array<any>;
    }
  >{};

  constructor(
    public appContext: AppContext,
    public speciality: SpecialityService,
    public checkoutService: CheckoutService,
    private _http: HttpClientService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _gaService: GaService
  ) {}

  ngOnInit() {
    const { firstName, lastName } = this._userService.user.profile.basicProfile;
    this.profileId = this.patientData.meId;
    this.fetchHealthHistory();
    this._messageService.healthInfo.subscribe(healthInfo => {
      this.setHealthInfoToCheckout(healthInfo[this.payloadIndex]["healthInfo"]);
    });
    this.scriptMedId = this.speciality.patientsPayload[
      this.payloadIndex
    ].scriptMedId;
    this.meId = this.speciality.patientsPayload[this.payloadIndex].meId;
    this.user = `${firstName} ${lastName}`;
  }

  fetchHealthHistory() {
    const url = Microservice.health_history_retrieve;
    const requestPayload = {
      flow: "ARX"
    };

    if (this.profileId && this.profileId !== undefined) {
      requestPayload["fId"] = this.profileId;
    }

    this._http.postData(url, requestPayload).subscribe(
      response => {
        this.loaderState = false;
        if (response.message !== undefined) {
          this._messageService.addMessage(
            new Message(
              response.message.message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else {
          if (!response.healthInfo) {
            this.healthInfo.additionalMeds = [];
            this.healthInfo.healthConditions = [];
            this.healthInfo.drugAllergies = [];
          } else {
            this.healthInfo.additionalMeds = response.healthInfo.additionalMeds
              ? response.healthInfo.additionalMeds
              : [];
            this.healthInfo.healthConditions = response.healthInfo
              .healthConditions
              ? response.healthInfo.healthConditions
              : [];
            this.healthInfo.drugAllergies = response.healthInfo.drugAllergies
              ? response.healthInfo.drugAllergies
              : [];
            this.setHealthInfoToCheckoutWithFid(
              this.profileId,
              this.healthInfo
            );
          }
        }
      },
      error => {
        this.loaderState = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  setHealthInfoToCheckout(healthInfo) {
    this.healthInfo = healthInfo;
    this.speciality.patientsPayload[
      this.payloadIndex
    ].healthInfo = this.healthInfo;
  }

  /**
   * Setting specific patient(fid) health information in Speciality Service
   * Same Speciality service patient information is being accessed in validateSinglePatient
   * (speciality-review.component.ts file) while checkout.
   *
   * @param fid
   * @param healthInfo
   */
  setHealthInfoToCheckoutWithFid(fid, healthInfo) {
    for (let i = 0; i < this.speciality.patientsPayload.length; i++) {
      if (this.speciality.patientsPayload[i].meId === fid) {
        this.speciality.patientsPayload[i].healthInfo = healthInfo;
      }
    }
  }

  /**
   * close medications search window.
   *
   * @param event
   */
  closeMedications(event) {
    this.showMedicationsSearch = event;
  }

  isShowMedication() {
    this.showMedicationsSearch = true;
    this.updateGAEventForMedication();
  }

  updateGAEventForMedication() {
    console.log("called for medi");
    this._gaService.sendEvent(
      this.gaEventforSpecialty(GA.actions.health_info.add_medication)
    );
  }

  gaEventforSpecialty(action, label = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.health_info_section_specialty_checkout;
    event.action = action;
    return event;
  }

  /**
   * Update selected values to show.
   *
   * @param event
   */
  updateMedications(event) {
    if (
      this.speciality.patientsPayload[this.payloadIndex].healthInfo
        .additionalMeds === undefined
    ) {
      this.speciality.patientsPayload[
        this.payloadIndex
      ].healthInfo.additionalMeds = [];
    }
    this.submitHealthData("Medications", event);
  }

  submitHealthData(type: string, list: Array<any>): void {
    this.loaderState = true;
    this.loaderOverlay = true;
    const data = {
      flow: "ARX"
    };
    if (this.meId) {
      data["fId"] = this.meId;
    }
    this._http
      .postData(Microservice.health_history_retrieve, data)
      .subscribe(() => {
        const request_payload = {
          healthHistoryType: type,
          drugList: [],
          ...data
        };

        list.forEach(item => {
          const obj = this._userService.getDrugObj(type, item);
          request_payload.drugList.push(obj);
        });

        this._http
          .postData(Microservice.health_history_submit, request_payload)
          .subscribe(
            response => {
              this.loaderState = false;
              this.loaderOverlay = false;
              if (response.message.code === "WAG_I_HEALTH_HISTORY_SUBMIT_010") {
                this._http
                  .postData(Microservice.health_history_retrieve, data)
                  .subscribe(healthInfoRes => {
                    this.setHealthInfoToCheckout(healthInfoRes.healthInfo);
                  });
                this.updateValuesLocally(type, list);
              } else {
                this._messageService.addMessage(
                  new Message(
                    response.message.message,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              }
            },

            error => {
              this.loaderState = false;
              this.loaderOverlay = false;

              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.service_failed,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );
      });
  }

  updateValuesLocally(type: string, list: Array<any>): void {
    switch (type) {
      case "Medications":
        list.forEach(item => {
          const found = this.speciality.patientsPayload[
            this.payloadIndex
          ].healthInfo.additionalMeds.find(exist => {
            return item.drugId === exist.drugId;
          });
          if (found === undefined) {
            this.speciality.patientsPayload[
              this.payloadIndex
            ].healthInfo.additionalMeds.push(item);
          }
        });
        break;

      case "Health Conditions":
        list.forEach(item => {
          const found = this.speciality.patientsPayload[
            this.payloadIndex
          ].healthInfo.healthConditions.find(exist => {
            if (item.drugId !== undefined) {
              return item.drugId === exist.healthConditionCd;
            } else if (item.healthConditionCd !== undefined) {
              return item.healthConditionCd === exist.healthConditionCd;
            } else {
              return item.drugId === exist.healthConditionCd;
            }
          });
          if (found === undefined) {
            this.speciality.patientsPayload[
              this.payloadIndex
            ].healthInfo.healthConditions.push(item);
          }
        });
        break;

      case "Drug Allergies":
        list.forEach(item => {
          const found = this.speciality.patientsPayload[
            this.payloadIndex
          ].healthInfo.drugAllergies.find(exist => {
            if (item.drugId !== undefined && exist.drugId !== undefined) {
              return item.drugId === exist.drugId;
            } else if (
              item.drugId !== undefined &&
              exist.allergyCode !== undefined
            ) {
              return item.drugId === exist.allergyCode;
            } else if (
              item.allergyCode !== undefined &&
              exist.allergyCode !== undefined
            ) {
              return item.allergyCode === exist.allergyCode;
            } else {
              return item.drugId === exist.drugId;
            }
          });
          if (found === undefined) {
            this.speciality.patientsPayload[
              this.payloadIndex
            ].healthInfo.drugAllergies.push(item);
          }
        });
        break;
    }
  }

  /**
   * Update selected values for allergies.
   *
   * @param event
   */
  updateAllergies(event) {
    if (
      this.speciality.patientsPayload[this.payloadIndex].healthInfo
        .drugAllergies === undefined
    ) {
      this.speciality.patientsPayload[
        this.payloadIndex
      ].healthInfo.drugAllergies = [];
    }
    this.submitHealthData("Drug Allergies", event);
  }

  /**
   * Update selected values for conditions.
   *
   * @param event
   */
  updateConditions(event) {
    if (
      this.speciality.patientsPayload[this.payloadIndex].healthInfo
        .healthConditions === undefined
    ) {
      this.speciality.patientsPayload[
        this.payloadIndex
      ].healthInfo.healthConditions = [];
    }
    this.submitHealthData("Health Conditions", event);
  }

  resetHealthInfoServiceErr() {
    this.healthInfoServiceErr.addMedication = false;
    this.healthInfoServiceErr.drugAllergies = false;
    this.healthInfoServiceErr.healthConditions = false;
  }
  showHealthInfoErrMsg(healthType) {
    if (healthType === "Medications") {
      this.healthInfoServiceErr.addMedication = true;
    } else if (healthType === "Drug Allergies") {
      this.healthInfoServiceErr.drugAllergies = true;
    } else {
      this.healthInfoServiceErr.healthConditions = true;
    }
    let errTimeout;
    clearTimeout(errTimeout);
    errTimeout = setTimeout(() => {
      this.resetHealthInfoServiceErr();
    }, 3000);
  }

  deleteHealthItem(allergie: any, type: string, index: number): void {
    this.resetHealthInfoServiceErr();
    this.loaderState = true;
    this.loaderOverlay = true;
    const drugList = [];

    if (type === "Drug Allergies") {
      drugList.push(this._userService.deleteDrugObj(type, allergie.drugId, allergie.allergyCode));
    } else {
      drugList.push({ ids: `${allergie}` });
    }

    const data = {
      flow: "ARX"
    };
    if (this.meId) {
      data["fId"] = this.meId;
    }

    // delete request to delete item from health history
    const reqPayload = {
      healthHistoryType: `${type}`,
      drugList,
      ...data
    };
    if (this.meId) {
      reqPayload["fId"] = this.meId;
      this._http
        .postData(Microservice.health_history_retrieve, data)
        .subscribe(() => this.deleteDrugInfo(reqPayload, type, data));
      return;
    }
    this.deleteDrugInfo(reqPayload, type, data);
  }
  deleteDrugInfo(reqPayload: any, type: string, data: any) {
    this._http
      .postData(Microservice.health_history_delete, reqPayload)
      .subscribe(
        response => {
          this.loaderState = false;
          this.loaderOverlay = false;
          if (response.message) {
            if (response.message.code === "WAG_I_HEALTH_HISTORY_DELETE_006") {
              this._http
                .postData(Microservice.health_history_retrieve, data)
                .subscribe(healthInfoRes =>
                  this.setHealthInfoToCheckout(healthInfoRes.healthInfo)
                );
            }
          } else {
            this.showHealthInfoErrMsg(type);
          }
        },
        () => {
          this.loaderState = false;
          this.loaderOverlay = false;
          this.showHealthInfoErrMsg(type);
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

  /**
   * close conditions search window.
   *
   * @param event
   */
  closeConditions(event) {
    this.showConditionsSearch = event;
  }

  gaEventSideEffects(value) {
    this._gaService.sendEvent(
      this.gaEventwithData(
        TwoFaGA.category.specialty_checkout_Clinical_review,
        TwoFaGA.action.sideEffects,
        "",
        value
      )
    );
  }

  gaEventwithData(category, action, label = "", data): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    event.label = label;
    event.data = data;
    return event;
  }

  confirmInfo(event) {
    if (event.target.checked) {
      this._gaService.sendEvent(this.gaEvent());
    }
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = TwoFaGA.category.specialty_checkout_confirm_info;
    event.action = TwoFaGA.action.confirmInformation;
    return event;
  }
  noDrugInfo(event) {
    if (event.target.checked) {
      this._gaService.sendEvent(
        this.gaCommonEvent(
          TwoFaGA.category.specialty_checkout_confirm_info,
          TwoFaGA.action.drugAllergies
        )
      );
    }
  }
  addDrug() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.specialty_checkout_confirm_info,
        TwoFaGA.action.addDrug
      )
    );
  }
  gaCommonEvent(category, action): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    return event;
  }
  addHealth() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.specialty_checkout_confirm_info,
        TwoFaGA.action.addHealthCondition
      )
    );
  }

  onComboClick(action: string, data: string) {
    if (action === "need_assistance") {
      const event = <GAEvent>{};
      event.category = "/specialty-checkout/clinical-review";
      event.action = GA.actions.checkout_speciality.require_assistance;
      event.label = "";
      event.data = data;
      this._gaService.sendEvent(event);
    } else if (action === "need_pharmacist_to_contact") {
      const event = <GAEvent>{};
      event.category = "/specialty-checkout/clinical-review";
      event.action =
        GA.actions.checkout_speciality.require_pharmacist_to_contact;
      event.label = "";
      event.data = data;
      this._gaService.sendEvent(event);
    }
  }
  pharmacistQuestionGAEvent(eventVal) {
    if (eventVal.target.checked) {
      const event = <GAEvent>{};
      event.category = "/specialty-checkout/clinical-review";
      event.action =
        GA.actions.checkout_speciality.require_pharmacist_to_contact;
      event.label = "";
      this._gaService.sendEvent(event);
    }
  }
  presnotVisible() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.furtherAssistReq,
        TwoFaGA.action.presNotVisible
      )
    );
  }
  presChange() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.furtherAssistReq,
        TwoFaGA.action.presChange
      )
    );
  }
  presQuantity() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.furtherAssistReq,
        TwoFaGA.action.presQuantity
      )
    );
  }
  insurance() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.furtherAssistReq,
        TwoFaGA.action.insurance
      )
    );
  }
  reqDiffPresc(event) {
    if (event.target.checked) {
      this._gaService.sendEvent(
        this.gaCommonEvent(
          TwoFaGA.category.furtherAssistReq,
          TwoFaGA.action.reqDiffRX
        )
      );
    }
  }
  healthConditionCheckbox(event) {
    if (event.target.checked) {
      this._gaService.sendEvent(
        this.gaCommonEvent(
          TwoFaGA.category.speciality_checkout_health_information,
          TwoFaGA.action.healthConditionsDeclared
        )
      );
    }
  }
  newInsurance(event) {
    if (event.target.checked) {
      this._gaService.sendEvent(
        this.gaCommonEvent(
          TwoFaGA.category.furtherAssistReq,
          TwoFaGA.action.newInsurance
        )
      );
    }
  }
}
