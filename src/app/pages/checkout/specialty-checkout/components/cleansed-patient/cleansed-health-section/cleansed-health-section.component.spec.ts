import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { cleansedHealthSectionComponent } from "./cleansed-health-section.component";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AppTestingModule } from "../../../../../../../../tests/app.testing.module";
import { SpecialityService } from "@app/pages/checkout/specialty-checkout/speciality.service";
import { UserService } from "@app/core/services/user.service";
import { HttpClientService } from "../../../../../../core/services/http.service";
import { Observable } from "rxjs/Observable";
import { GaService } from "@app/core/services/ga-service";
import { ArxUser } from "@app/models";
import { jsonUsr } from "../../../../../../../../test/mocks/userService.mocks";

const specialityData = {
  patientsPayload: [
    {
      healthInfo: {
        additionalMeds: [{ drugId: 1 }],
        healthConditions: [{ drugId: 1, healthConditionCd: 1 }],
        drugAllergies: [{ drugId: 1, allergyCode: "test" }]
      }
    },
    {
      scriptMedId: "123"
    },
    {
      meId: "123"
    }
  ]
};
const userServiceData = {
  user: {
    profile: {
      basicProfile: "test"
    }
  }
};
const patientData = {
  profileId: "123"
};
const updateConditionsData = {
  patientsPayload: [
    {
      healthInfo: {
        healthConditions: "test"
      }
    }
  ]
};
const updateAllergiesData = {
  patientsPayload: [
    {
      healthInfo: {
        drugAllergies: "test"
      }
    }
  ]
};
const healthInfoServiceErrData = {
  healthInfoServiceErr: {
    addMedication: true
  }
};

describe("cleansedHealthSectionComponent", () => {
  let component: cleansedHealthSectionComponent;
  let fixture: ComponentFixture<cleansedHealthSectionComponent>;
  let speciality: SpecialityService;
  let userService: UserService;
  let httpservice: HttpClientService;
  let _gaService: GaService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [cleansedHealthSectionComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(cleansedHealthSectionComponent);
        component = fixture.componentInstance;
        speciality = TestBed.get(SpecialityService);
        userService = TestBed.get(UserService);
        httpservice = TestBed.get(HttpClientService);
        _gaService = TestBed.get(GaService);

        userService.user = new ArxUser("11948190939");
        userService.user.firstName = "testFirst";
        userService.user.lastName = "test";
        userService.user.dateOfBirth = "01-01-2000";
        userService.user.phoneNumber = "1234567899";
        userService.user.isRxAuthenticatedUser = true;
        userService.user.loggedIn = "true";
        userService.user.profile = jsonUsr;
      });
  }));
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should execute closeConditions", () => {
    const even_data = {
      type: "test"
    };
    component.closeConditions(even_data);
  });
  it("should execute closeAllergies", () => {
    const even_data = {
      type: "test"
    };
    component.closeAllergies(even_data);
  });
  it("should execute closeMedications", () => {
    component.closeMedications("test");
  });
  it("should execute updateMedications", () => {
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.updateMedications("test");
  });
  it("should execute setHealthInfoToCheckout", () => {
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.setHealthInfoToCheckout("test");
  });
  it("should execute updateAllergies", () => {
    component.payloadIndex = 0;
    speciality.patientsPayload = updateAllergiesData.patientsPayload;
    component.updateAllergies("test");
  });
  it("should execute updateConditions", () => {
    component.payloadIndex = 0;
    speciality.patientsPayload = updateConditionsData.patientsPayload;
    component.updateConditions("test");
  });
  it("should execute deleteHealthItem", () => {
    component.meId = "test";
    spyOn(component, "resetHealthInfoServiceErr").and.stub();
    spyOn(component, "deleteDrugInfo").and.stub();
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({ test: "test" })
    );
    component.deleteHealthItem({ drugId: "test" }, "Drug Allergies", 1);
  });

  it("should execute deleteHealthItem", () => {
    component.meId = "test";
    spyOn(component, "resetHealthInfoServiceErr").and.stub();
    spyOn(component, "deleteDrugInfo").and.stub();
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({ test: "test" })
    );
    component.deleteHealthItem({ allergyCode: "test" }, "Drug Allergies", 1);
  });

  it("should execute showHealthInfoErrMsg", () => {
    component.healthInfoServiceErr.addMedication =
      healthInfoServiceErrData.healthInfoServiceErr.addMedication;
    component.showHealthInfoErrMsg("Medications");
  });
  it("should execute showHealthInfoErrMsg", () => {
    component.healthInfoServiceErr.addMedication =
      healthInfoServiceErrData.healthInfoServiceErr.addMedication;
    component.showHealthInfoErrMsg("Drug Allergies");
  });
  it("should execute resetHealthInfoServiceErr", () => {
    component.resetHealthInfoServiceErr();
  });

  it("should execute ngOnInit with message", () => {
    component.patientData = patientData;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({
        message: { code: "WAG_E_RR_001", message: "success", type: "INFO" }
      })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit", () => {
    component.patientData = patientData;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({ test: "test" })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit with healthinfo", () => {
    component.patientData = patientData;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({
        healthInfo: {
          additionalMeds: ["test"],
          healthConditions: ["test"],
          drugAllergies: ["test"]
        }
      })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit error", () => {
    component.patientData = patientData;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.ngOnInit();
  });
  it("should execute noDrugInfo", () => {
    component.noDrugInfo({ target: { checked: true } });
  });
  it("should execute addDrug", () => {
    component.addDrug();
  });
  it("should execute addHealth", () => {
    component.addHealth();
  });
  it("should execute presnotVisible", () => {
    component.presnotVisible();
  });
  it("should execute presChange", () => {
    component.presChange();
  });
  it("should execute presQuantity", () => {
    component.presQuantity();
  });
  it("should execute insurance", () => {
    component.insurance();
  });
  it("should execute confirmInfo", () => {
    component.confirmInfo({ target: { checked: true } });
  });
  it("should execute reqDiffPresc", () => {
    component.reqDiffPresc({ target: { checked: true } });
  });
  it("should execute healthConditionCheckbox", () => {
    component.healthConditionCheckbox({ target: { checked: true } });
  });
  it("should execute isShowMedication", () => {
    component.isShowMedication();
  });
  it("should execute onComboClick", () => {
    component.onComboClick("need_assistance", "test");
  });
  it("should execute onComboClick", () => {
    component.onComboClick("need_pharmacist_to_contact", "test");
  });
  it("should execute newInsurance", () => {
    component.newInsurance({ target: { checked: true } });
  });

  it("should execute gaEventwithData", () => {
    component.gaEventwithData("", "", "", "");
  });
  it("should execute gaEventSideEffects", () => {
    spyOn(component, "gaEventwithData").and.returnValue({});
    spyOn(_gaService, "sendEvent").and.stub();
    component.gaEventSideEffects("");
  });

  it("should execute deleteDrugInfo", () => {
    spyOn(component, "setHealthInfoToCheckout").and.stub();
    spyOn(component, "showHealthInfoErrMsg").and.stub();
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({ message: { code: "WAG_I_HEALTH_HISTORY_DELETE_006" } })
    );
    component.deleteDrugInfo({ drugId: "test" }, "Drug Allergies", 1);
  });

  it("should execute deleteDrugInfo- error", () => {
    spyOn(component, "setHealthInfoToCheckout").and.stub();
    spyOn(component, "showHealthInfoErrMsg").and.stub();
    spyOn(httpservice, "postData").and.returnValue(
      Observable.throw({ message: { code: "WAG_I_HEALTH_HISTORY_DELETE_006" } })
    );
    component.deleteDrugInfo({ drugId: "test" }, "Drug Allergies", 1);
  });

  it("should execute submitHealthData", () => {
    spyOn(userService, "getDrugObj").and.stub();
    spyOn(component, "setHealthInfoToCheckout").and.stub();
    spyOn(component, "updateValuesLocally").and.stub();
    const value = ["test"];
    component.meId = 1;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({ message: { code: "WAG_I_HEALTH_HISTORY_SUBMIT_010" } })
    );
    component.submitHealthData("test", value);
  });

  it("should execute submitHealthData", () => {
    spyOn(userService, "getDrugObj").and.stub();
    spyOn(component, "setHealthInfoToCheckout").and.stub();
    spyOn(component, "updateValuesLocally").and.stub();
    const value = ["test"];
    component.meId = 1;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.of({ message: { code: "WAG_I_HEALTH_HISTORY_DELETE_006" } })
    );
    component.submitHealthData("test", value);
  });

  it("should execute submitHealthData", () => {
    spyOn(userService, "getDrugObj").and.stub();
    spyOn(component, "setHealthInfoToCheckout").and.stub();
    spyOn(component, "updateValuesLocally").and.stub();
    const value = ["test"];
    component.meId = 1;
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    spyOn(httpservice, "postData").and.returnValues(
      Observable.of({ message: { code: "WAG_I_HEALTH_HISTORY_SUBMIT_010" } }),
      Observable.throw({ message: { code: "WAG_I_HEALTH_HISTORY_DELETE_006" } })
    );
    component.submitHealthData("test", value);
  });

  it("should execute updateValuesLocally", () => {
    const value = [{ drugId: 2 }];
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.updateValuesLocally("Medications", value);
  });

  it("should execute updateValuesLocally - 1", () => {
    const value = [{ drugId: 2 }];
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.updateValuesLocally("Health Conditions", value);
  });

  it("should execute updateValuesLocally - 1 - else", () => {
    const value = [{ drugId: undefined }];
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.updateValuesLocally("Health Conditions", value);
  });

  it("should execute updateValuesLocally - 2", () => {
    const value = [{ drugId: 2 }];
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.updateValuesLocally("Drug Allergies", value);
  });

  it("should execute updateValuesLocally - 2 - else", () => {
    const value = [{ drugId: undefined }];
    component.payloadIndex = 0;
    speciality.patientsPayload = specialityData.patientsPayload;
    component.updateValuesLocally("Drug Allergies", value);
  });

});
