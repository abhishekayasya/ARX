import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { NewPasswordComponent } from "./new-password.component";
import { ResetPasswordService } from "@app/pages/reset-password/services/reset-password.service";
import { HttpClientService } from "@app/core/services/http.service";
import { autheticateRes } from "../../../../../../tests/twofaFlow";
import { SearchPrescriptions } from "../../../../../../test/mocks/prescriptions";
import { Observable } from "rxjs/Observable";
import { CommonUtil } from "@app/core/services/common-util.service";

describe("NewPasswordComponent", () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;
  let resetPasswordService;
  let _httpService: HttpClientService;
  let _commonService: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPasswordComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ResetPasswordService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NewPasswordComponent);
        component = fixture.componentInstance;
        resetPasswordService = TestBed.get(ResetPasswordService);
        _httpService = TestBed.get(HttpClientService);
        _commonService = TestBed.get(CommonUtil);
      });
  }));

  it("should create ", () => {
    expect(component).toBeTruthy();
  });
  it("should create ngOnInit", () => {
    component.ngOnInit();
  });
  it("should create saveNewPassword", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { profileId: 1 };
        }
      })
    );
    spyOn(_httpService, "postData").and.returnValue(
      Observable.of({
        messages: [
          { code: "WAG_E_PROFILE_2020", message: "success", type: "INFO" }
        ]
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { profileId: 1 };
        }
      })
    );
    spyOn(_httpService, "postData").and.returnValue(
      Observable.of({
        messages: [
          { code: "WAG_E_PROFILE_2021", message: "success", type: "INFO" }
        ]
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { profileId: 1 };
        }
      })
    );
    spyOn(_httpService, "postData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword else", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: false,
        json: () => {
          return { profileId: 1 };
        }
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword else", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    resetPasswordService.authOptionClicked = "email";
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { profileId: 1 };
        }
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword else WAG_E_PROFILE_2020", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    resetPasswordService.authOptionClicked = "email";
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            profileId: 1,
            messages: [
              { code: "WAG_E_PROFILE_2020", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword else WAG_E_PROFILE_2021", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = true;
    component.overlayLoader = true;
    spyOn(_commonService, "navigate").and.stub();
    resetPasswordService.authOptionClicked = "email";
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            profileId: 1,
            messages: [
              { code: "WAG_E_PROFILE_2021", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.saveNewPassword();
  });
  it("should create saveNewPassword error case", () => {
    component.newPasswordForm.setValue({ password: "test" });
    component.showLoader = false;
    component.overlayLoader = false;
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.reject({
        json: () => {
          return { status: 500 };
        }
      })
    );
    component.saveNewPassword();
  });
  it("should create checkboxFlag", () => {
    const even_data = {
      target: { checked: true }
    };
    component.checkboxFlag(even_data);
  });
  it("should create checkPasswordCheck", () => {
    component.newPasswordForm.setValue({ password: "test1" });
    const even_data = {
      target: { value: "1" }
    };
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              {
                code: "WAG_E_PROFILE_2021",
                message:
                  "Pasword does not meet requirements. Please try again.",
                type: "WARN"
              }
            ]
          };
        }
      })
    );
    component.checkPasswordCheck(even_data);
  });
  it("should create checkPasswordCheck error", () => {
    const even_data = {
      target: { value: "12345678" }
    };
    component.newPasswordForm.setValue({ password: "test" });
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.reject({
        json: () => {
          return SearchPrescriptions;
        }
      })
    );
    component.checkPasswordCheck(even_data);
  });
  it("should create checkPassword", () => {
    component.newPasswordForm.setValue({ password: "test" });
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              {
                code: "WAG_E_PROFILE_2021",
                message:
                  "Pasword does not meet requirements. Please try again.",
                type: "WARN"
              }
            ]
          };
        }
      })
    );
    const even_data = { target: { value: "1" } };
    component.checkPassword(even_data);
  });
  it("should create checkPassword", () => {
    component.newPasswordForm.setValue({ password: "test" });
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              {
                code: "WAG_E_PROFILE_2020",
                message:
                  "Pasword does not meet requirements. Please try again.",
                type: "test"
              }
            ]
          };
        }
      })
    );
    const even_data = { target: { value: "1" } };
    component.checkPassword(even_data);
  });
  it("should create checkPassword if case", () => {
    const even_data = {
      target: { value: "12345678" }
    };
    component.newPasswordForm.setValue({ password: "test" });
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.reject({
        json: () => {
          return SearchPrescriptions;
        }
      })
    );
    component.checkPassword(even_data);
  });
  it("should create checkboxFlag else block", () => {
    const even_data = {
      target: { checked: false }
    };
    component.checkboxFlag(even_data);
  });
});
