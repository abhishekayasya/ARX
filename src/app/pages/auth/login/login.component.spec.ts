import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { ArxLoaderComponent } from "@app/shared/components/loader/loader.component";
import { MessageComponent } from "@app/shared/components/message/message.component";
import { LogoComponent } from "@app/shared/components/logo/logo.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RegOptionComponent } from "@app/shared/components/reg-option/reg-option.component";
import { HtmlPipe } from "@app/shared/pipes/html.pipe";
import { ModalComponent } from "@app/shared/components/modal/modal.component";
import { MessageService } from "@app/core/services/message.service";
import { AppContext } from "@app/core/services/app-context.service";
import { HttpClientService } from "@app/core/services/http.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpModule } from "@angular/http";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF, DatePipe } from "@angular/common";
import { CommonUtil } from "@app/core/services/common-util.service";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "@app/core/services/user.service";
import { CheckoutService } from "@app/core/services/checkout.service";
import { DebugElement } from "@angular/core";
import { GaService } from "@app/core/services/ga-service";
import { DeviceDetectorService } from "ngx-device-detector";
import { ArxUser } from "@app/models";
import { autheticateRes } from "../../../../../tests/twofaFlow";
import { Observable } from "rxjs/Observable";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let _userService: UserService;
  let debugElement: DebugElement;
  let _httpService: HttpClientService;
  let _commonService: CommonUtil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        MessageComponent,
        ArxLoaderComponent,
        LogoComponent,
        RegOptionComponent,
        HtmlPipe,
        ModalComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        GaService,
        AppContext,
        HttpClientService,
        { provide: APP_BASE_HREF, useValue: "/" },
        CommonUtil,
        CookieService,
        DatePipe,
        UserService,
        CheckoutService,
        DeviceDetectorService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of("jahia")
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    _userService = debugElement.injector.get(UserService);
    _userService.user = new ArxUser("11948190939");
    _httpService = TestBed.get(HttpClientService);
    _commonService = TestBed.get(CommonUtil);
    spyOn(_userService, "isSSOSessionActive").and.returnValue(true);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should pass isSSOSessionActive flag", () => {
    expect(component.ssoLogin).toBe(true);
  });
  it("should able to submit validUserFunction ", () => {
    component.loginForm.setValue({ username: "abc", password: "test" });
    sessionStorage.setItem(
      AppContext.CONST.sso_response,
      JSON.stringify({ EnterprisePersonId: 1 })
    );
    component.ssoLogin = true;
    component.validUserFunction();
    // expect(component.ssoLogin).toBe(true);
  });
  it("should able to submit validUserFunction ", () => {
    component.loginForm.setValue({ username: "abc", password: "test" });
    component.ssoLogin = false;
    component.validUserFunction();
    // expect(component.ssoLogin).toBe(true);
  });
  it("should able to submit validUserFunction else case", () => {
    component.loginForm.setValue({ username: "abc", password: "123456" });
    component.ssoLogin = false;
    fixture.detectChanges();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              { code: "WAG_W_LOGIN_1024", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should able to submit validUserFunction else WAG_I_LOGIN_1000", () => {
    component.loginForm.setValue({ username: "abc", password: "123456" });
    component.ssoLogin = false;
    fixture.detectChanges();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              { code: "WAG_I_LOGIN_1000", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should able to submit validUserFunction else WAG_E_PROFILE_2009", () => {
    component.loginForm.setValue({ username: "abc", password: "123456" });
    component.ssoLogin = false;
    fixture.detectChanges();
    spyOn(_commonService, "navigate").and.stub();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              { code: "WAG_E_PROFILE_2009", message: "success", type: "INFO" }
            ],
            links: [{ href: "test=test" }]
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should able to submit validUserFunction else WAG_I_PROFILE_2004", () => {
    component.loginForm.setValue({ username: "abc", password: "123456" });
    component.ssoLogin = false;
    fixture.detectChanges();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              { code: "WAG_I_PROFILE_2004", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should able to submit validUserFunction else message", () => {
    component.loginForm.setValue({ username: "abc", password: "123456" });
    component.ssoLogin = false;
    fixture.detectChanges();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [
              { code: "WAG_I_PROFILE_2005", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should able to submit validUserFunction else", () => {
    component.loginForm.setValue({ username: "abc", password: "123456" });
    component.ssoLogin = false;
    fixture.detectChanges();
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            message: [
              { code: "WAG_I_PROFILE_2005", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should able to submit validUserFunction error", () => {
    spyOn(_httpService, "doPostLogin").and.returnValue(
      Promise.reject({
        json: () => {
          return {
            messages: [{ code: "test", message: "error", type: "INFO" }],
            status: 401
          };
        }
      })
    );
    component.validUserFunction();
  });
  it("should pass canProcessSSO", () => {
    localStorage.setItem("sData", JSON.stringify("test"));
    component.canProcessSSO();
  });
  it("should pass processLoginContext", () => {
    component.loginForm.setValue({ username: "test", password: "123456" });
    sessionStorage.setItem("prev_url", JSON.stringify("test"));
    sessionStorage.setItem("unmk", JSON.stringify("test"));
    spyOn(_userService, "checkCookie").and.returnValue(
      Observable.of("loginBanner")
    );
    component.processLoginContext();
  });
  it("should pass processResetPasswordInfo", () => {
    const data = {
      password: "123456",
      refId: 1,
      username: "test",
      message: "test"
    };
    sessionStorage.setItem(
      AppContext.CONST.resetContentKey,
      JSON.stringify(data)
    );
    component.processResetPasswordInfo();
  });
});
