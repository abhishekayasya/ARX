import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { ManageAccessComponent } from "./manage-access.component";
import { HttpClientService } from "./../../../../core/services/http.service";
import { of } from "rxjs/observable/of";
import { TEST } from "./../../../../../../tests/speciality-review";
import { Observable } from "rxjs/Observable";
import { FmService } from "@app/core/services/fm.service";
import { UserService } from "@app/core/services/user.service";
import { CommonUtil } from "@app/core/services/common-util.service";

const message_data = {
  messages: [
    { code: "WAG_E_SEARCH_MEMBER_1001", message: "success", type: "INFO" }
  ]
};
const message_data1 = {
  messages: [
    { code: "WAG_E_SEARCH_MEMBER_1007", message: "success", type: "INFO" }
  ]
};
describe("ManageAccessComponent", () => {
  let component: ManageAccessComponent;
  let fixture: ComponentFixture<ManageAccessComponent>;
  let httpservice;
  let fmservice;
  let userservice;
  let commonservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAccessComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ManageAccessComponent);
        component = fixture.componentInstance;
        httpservice = TestBed.get(HttpClientService);
        fmservice = TestBed.get(FmService);
        userservice = TestBed.get(UserService);
        commonservice = TestBed.get(CommonUtil);
      });
  }));

  it("should create ngOnInit true", () => {
    fmservice.loggedIn = true;
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_W_FA_1073" }]
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngOnInit true else", () => {
    fmservice.loggedIn = true;
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.of({
        adminProfiles: [{ id: 1 }]
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngOnInit true error", () => {
    fmservice.loggedIn = true;
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngOnInit", () => {
    fmservice.loggedIn = false;
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngOnInit", () => {
    sessionStorage.setItem("fmInvMsg", JSON.stringify("test"));
    fmservice.loggedIn = undefined;
    spyOn(userservice, "getProfileInd").and.returnValue(
      Observable.of({
        auth_ind: "Y"
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngOnInit", () => {
    sessionStorage.setItem("fmInvMsg", JSON.stringify("test"));
    fmservice.loggedIn = undefined;
    spyOn(userservice, "getProfileInd").and.returnValue(
      Observable.of({
        auth_ind: "N"
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngOnInit error", () => {
    sessionStorage.setItem("fmInvMsg", JSON.stringify("test"));
    fmservice.loggedIn = undefined;
    spyOn(userservice, "getProfileInd").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it("should create ngAfterViewInit", () => {
    component.ngAfterViewInit();
  });
  it("should create turnOffAccessWAG_I_FA_1059", () => {
    component.adminToRemove = { id: 1 };
    fmservice.admins = [{ id: 1 }];
    spyOn(fmservice, "removeAccess").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1059" }]
      })
    );
    component.turnOffAccess();
  });
  it("should create turnOffAccessWAG_I_FA_1063", () => {
    component.adminToRemove = { id: 1 };
    spyOn(fmservice, "removeAccess").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1063" }]
      })
    );
    component.turnOffAccess();
  });
  it("should create turnOffAccessWAG_I_FA_1066", () => {
    component.adminToRemove = { id: 1 };
    spyOn(fmservice, "removeAccess").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1066" }]
      })
    );
    component.turnOffAccess();
  });
  it("should create turnOffAccess error", () => {
    component.adminToRemove = { id: 1 };
    spyOn(fmservice, "removeAccess").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.turnOffAccess();
  });
  it("should create onError", () => {
    component.onError();
  });
  it("should create continueToRemove", () => {
    component.continueToRemove();
  });
  it("should create searchForAdmin", () => {
    component.searchForAdmin();
  });
  it("should create searchForAdmin", () => {
    component.personalInfoForm.setValue({
      firstName: "test",
      lastName: "test",
      dateOfBirth: "name",
      number: 123,
      phoneType: "cell"
    });
    fixture.detectChanges();
    component.additionalState = true;
    spyOn(httpservice, "postData").and.callFake(function() {
      return of(message_data);
    });
    component.searchForAdmin();
  });
  it("should excute searchForAdmin error", () => {
    component.personalInfoForm.setValue({
      firstName: "test",
      lastName: "test",
      dateOfBirth: "name",
      number: 123,
      phoneType: "cell"
    });
    component.additionalState = true;
    spyOn(httpservice, "postData").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.onError();
  });
  it("should create prepareAdminAccountsForGuest", () => {
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1063" }]
      })
    );
    component.prepareAdminAccountsForGuest();
  });
  it("should create prepareAdminAccountsForGuest", () => {
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1061" }]
      })
    );
    component.prepareAdminAccountsForGuest();
  });
  it("should create prepareAdminAccountsForGuest", () => {
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.of({
        adminProfiles: [{ id: 1 }]
      })
    );
    component.prepareAdminAccountsForGuest();
  });
  it("should create prepareAdminAccountsForGuest", () => {
    spyOn(fmservice, "getAdminAccounts").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.prepareAdminAccountsForGuest();
  });
  it("should create enableRemoveConfirm", () => {
    fmservice.admins = [{ id: 1 }];
    component.enableRemoveConfirm("11");
  });
  it("should execute prefillAddressComponents", () => {
    const data = {
      gender: "aaa",
      city: "xxx",
      state: "yyy",
      zipCode: "zzzz",
      street1: "zzzz",
      aptSuite: "zzzz"
    };
    component.prefillAddressComponents(data);
  });
  it("should execute onError", function() {
    component.onError();
  });
  it("should execute redirectToLogin", function() {
    spyOn(commonservice, "navigate").and.stub();
    component.redirectToLogin();
  });
});
