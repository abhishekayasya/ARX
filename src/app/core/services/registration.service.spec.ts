import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { AppTestingModule } from "../../../../tests/app.testing.module";
import { AppContext } from "./app-context.service";
import { CommonUtil } from "./common-util.service";
import { HttpClientService } from "./http.service";
import { RegistrationService } from "./registration.service";
import { UserService } from "./user.service";

describe("RegistrationService", () => {
  let registrationService: RegistrationService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _userService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        registrationService = TestBed.get(RegistrationService);
        _httpService = TestBed.get(HttpClientService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
      });
  }));

  it("Check Registration Service instance is available", () => {
    expect(registrationService).toBeTruthy();
  });

  it("should have Services variable ", () => {
    const Services = registrationService.SERVICES;
    expect(Services).toBeDefined();
  });

  it("should have Services variable functions ", () => {
    registrationService.SERVICES.authOptions();
    registrationService.SERVICES.verifyByPhone();
    registrationService.SERVICES.onlineQuestionsFirstSet();
    registrationService.SERVICES.onlineQuestionSubmision();
    expect(registrationService).toBeTruthy();
  });

  it("should call - endureState", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });

  it("should call - endureState - address", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("address");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });
  it("should call - endureState - identity ", () => {
    sessionStorage.setItem("u_reset_content", JSON.stringify("test"));
    spyOn(_common, "navigate").and.stub();
    spyOn(_appContext, "getRegistrationState").and.returnValue("identity");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });
  it("should call - endureState - identity else", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("identity");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });

  it("should call - endureState - consent", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("consent");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });

  it("should call - endureState - hipaa", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("hipaa");
    spyOn(_userService, "isSSOSessionActive").and.returnValue(true);
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });
  it("should call - endureState - hipaa else", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("hipaa");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });
  it("should call - endureState", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("insurance");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });
  it("should call - endureState default", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("test");
    registrationService.endureState();
    expect(registrationService).toBeTruthy();
  });
  it("should call - nextRoute", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("insurance");
    registrationService.nextRoute();
    expect(registrationService).toBeTruthy();
  });
  it("should call - nextRoute else", () => {
    spyOn(_appContext, "getRegistrationState").and.returnValue("");
    registrationService.nextRoute();
    expect(registrationService).toBeTruthy();
  });

  it("should call - enableLoader, disableLoader, getRegistrationAddBypass", () => {
    registrationService.enableLoader();
    registrationService.disableLoader();
    registrationService.getRegistrationAddBypass();
    expect(registrationService).toBeTruthy();
  });
});
