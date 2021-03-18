import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { ResetPasswordComponent } from "./reset-password.component";
import { ResetPasswordService } from "../../services/reset-password.service";
import { HttpClientService } from "@app/core/services/http.service";
import { Router } from "@angular/router";

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let _httpService;
  let _routerService;
  let _passwordService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ResetPasswordService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        _httpService = TestBed.get(HttpClientService);
        _routerService = TestBed.get(Router);
        _passwordService = TestBed.get(ResetPasswordService);
        _passwordService.invalidTokenMessage = "test";
      });
  }));

  it("should create ", () => {
    expect(component).toBeTruthy();
  });
  it("should create ngOnInit", () => {
    component.ngOnInit();
  });
  it("should create resetPassword", () => {
    component.resetPassword();
  });
  it("should create resetPassword", () => {
    component.resetPasswordForm.setValue({ username: "test" });
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              { code: "WAG_E_PROFILE_2021", message: "Password", type: "WARN" }
            ]
          };
        }
      })
    );
    component.resetPassword();
  });
  it("should create resetPassword else", () => {
    component.resetPasswordForm.setValue({ username: "test" });
    spyOn(_routerService, "navigate").and.stub();
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { email: "test@123", username: "test" };
        }
      })
    );
    component.resetPassword();
  });
  it("should create resetPassword else", () => {
    component.resetPasswordForm.setValue({ username: "test" });
    spyOn(_routerService, "navigate").and.stub();
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: false,
        json: () => {
          return { email: "test@123", username: "test" };
        }
      })
    );
    component.resetPassword();
  });
  it("should create resetPassword error", () => {
    component.resetPasswordForm.setValue({ username: "test" });
    spyOn(_routerService, "navigate").and.stub();
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.reject({ status: 500 })
    );
    component.resetPassword();
  });
  it("should create resetPasswordMs", () => {
    component.resetPasswordMs();
  });
  it("should create resetPasswordMs else", () => {
    component.resetPasswordForm.setValue({ username: "test" });
    spyOn(_routerService, "navigate").and.stub();
    component.resetPasswordMs();
  });
});
