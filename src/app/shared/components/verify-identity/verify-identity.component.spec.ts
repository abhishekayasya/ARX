import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonUtil } from "@app/core/services/common-util.service";
import { MessageService } from "@app/core/services/message.service";
import { UserService } from "@app/core/services/user.service";
import { AppTestingModule } from "../../../../../tests/app.testing.module";
import { VerifyIdentityComponent } from "./verify-identity.component";
import { HttpClientService } from "@app/core/services/http.service";
import { Observable } from "rxjs/Observable";
import { ArxUser } from "@app/models";
import { jsonUsr } from "../../../../../test/mocks/userService.mocks";

describe("VerifyIdentityComponent", () => {
  let component: VerifyIdentityComponent;
  let fixture: ComponentFixture<VerifyIdentityComponent>;
  let _common: CommonUtil;
  let commonUtilSpy: any;
  let _messageService: MessageService;
  let http: HttpClientService;
  let _userService: UserService;
  beforeEach(async(() => {
    commonUtilSpy = jasmine.createSpyObj("CommonUtil", [
      "removeNaturalBGColor"
    ]);

    TestBed.configureTestingModule({
      imports: [AppTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyIdentityComponent);
    component = fixture.componentInstance;
    _userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
    _messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpClientService);

    _userService.user = new ArxUser("11948190939");
    _userService.user.firstName = "testFirst";
    _userService.user.lastName = "test";
    _userService.user.dateOfBirth = "01-01-2000";
    _userService.user.phoneNumber = "1234567899";
    _userService.user.isRxAuthenticatedUser = true;
    _userService.user.loggedIn = "true";
    _userService.user.profile = jsonUsr;
  });

  afterEach(() => {
    localStorage.removeItem("refId");
  });

  it("should create", () => {
    spyOn(component, "getSecurityQuestions").and.stub();
    spyOn(component, "getSecurityQuestionCode").and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should render title in a h1 tag", async(() => {
    spyOn(component, "getSecurityQuestions").and.stub();
    spyOn(component, "getSecurityQuestionCode").and.stub();
    component.getSecurityQuestions();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain(
      "Verify your identity"
    );
  }));

  it("Should call - ngOnInit", () => {
    spyOn(component, "getSecurityQuestions").and.stub();
    spyOn(component, "getSecurityQuestionCode").and.stub();
    component.codeMessage = "";
    component.emailMessageSuccess = "";
    component.ngOnInit();
  });

  it("Should call - ngOnInit - 1", () => {
    spyOn(component, "getSecurityQuestions").and.stub();
    spyOn(component, "getSecurityQuestionCode").and.stub();
    component.codeMessage = "";
    component.phoneMessageSuccess = "";
    component.ngOnInit();
  });

  it("Should call - changeMethod", () => {
    component.changeMethod({ target: { value: "" } });
  });

  it("Should call - getSecurityQuestions", () => {
    spyOn(component, "getSecurityQuestionCode").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        basicProfile: {
          email: "",
          phone: [{ number: "" }],
          securityQuestion: ""
        }
      })
    );
    component.getSecurityQuestions();
  });

  it("Should call - getSecurityQuestions - error", () => {
    spyOn(component, "ongetSecurityQuestionsError").and.stub();
    spyOn(http, "postAuthData").and.returnValue(Observable.throw({}));
    component.getSecurityQuestions();
  });

  it("Should call - getSecurityQuestions - else", () => {
    localStorage.setItem("refId", "test");
    spyOn(http, "postData").and.returnValue(
      Observable.of({
        email: "",
        phone: [{ number: "" }],
        securityQuestions: [{ question: "testQuestion" }]
      })
    );
    component.getSecurityQuestions();
  });

  it("Should call - sendCode", () => {
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(component, "htmlToPlaintext").and.returnValue("test");
    component.otpMethod = "email";
    spyOn(http, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [{ code: "WAG_I_PROFILE_2025" }],
            refId: "test"
          };
        }
      })
    );
    component.sendCode();
  });

  it("Should call - sendCode - else", () => {
    spyOn(_messageService, "addMessage").and.stub();
    component.otpMethod = "phone";
    spyOn(http, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: "test"
          };
        }
      })
    );
    component.sendCode();
  });

  it("Should call - sendCode - else 2", () => {
    spyOn(_messageService, "addMessage").and.stub();
    component.otpMethod = "email";
    spyOn(http, "doPost").and.returnValue(
      Promise.reject({
        ok: true,
        json: () => {
          return {
            refId: "test"
          };
        }
      })
    );
    component.sendCode();
  });

  it("Should call sendCode- refId - else", () => {
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    component.otpMethod = "phone";
    spyOn(http, "postData").and.returnValue(
      Observable.of({
        ok: true,
        refId: "test",
        messages: [{ code: "WAG_I_LOGIN_1009" }]
      })
    );
    component.sendCode();
  });

  it("Should call sendCode- refId - else 2", () => {
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    component.otpMethod = "phone";
    spyOn(http, "postData").and.returnValue(
      Observable.of({
        ok: true,
        refId: "test",
        messages: [{ code: "WAG_I_LOGIN_1009" }]
      })
    );
    component.sendCode();
  });

  it("Should call - submitCode", () => {
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            messages: [{ code: "WAG_I_CREDENTIALS_1012" }]
          };
        }
      })
    );
    component.submitCode();
  });

  it("Should call - submitCode - messages undefined", () => {
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {};
        }
      })
    );
    component.submitCode();
  });
  it("Should call - submitCode - messages undefined 2", () => {
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { status: "success" };
        }
      })
    );
    component.submitCode();
  });
  it("Should call - submitCode - messages ", () => {
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "doPost").and.returnValue(Promise.reject({}));
    component.submitCode();
  });

  it("Should call - submitCode - isRxAuthenticatedUser false", () => {
    _userService.user.isRxAuthenticatedUser = false;
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        ok: true,
        messages: [{ code: "WAG_I_LOGIN_1011" }]
      })
    );
    component.submitCode();
  });

  it("Should call - submitCode - isRxAuthenticatedUser false", () => {
    _userService.user.isRxAuthenticatedUser = false;
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        ok: true,
        messages: [{ code: "WAG_I_PROFILE_2004" }]
      })
    );
    component.submitCode();
  });

  it("Should call - submitCode - isRxAuthenticatedUser false 2", () => {
    _userService.user.isRxAuthenticatedUser = false;
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        ok: true,
        messages: [{ code: "WAG_I_PROFILE_200", message: "test" }]
      })
    );
    component.submitCode();
  });

  it("Should call - submitAnswer", () => {
    component.securityQuestion = { qcode: "test" };
    _userService.user.isRxAuthenticatedUser = false;
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        ok: true,
        messages: [{ code: "WAG_I_LOGIN_1011" }]
      })
    );
    component.submitAnswer();
  });
  it("Should call - submitAnswer 2", () => {
    component.securityQuestion = { qcode: "test" };
    _userService.user.isRxAuthenticatedUser = false;
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(_userService, "initUser1").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        ok: true,
        messages: [{ code: "WAG_I_PROFILE_2004" }]
      })
    );
    component.submitAnswer();
  });

  it("Should call - submitAnswer 3", () => {
    component.securityQuestion = { qcode: "test" };
    _userService.user.isRxAuthenticatedUser = false;
    localStorage.setItem("refId", "test");
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(http, "postAuthData").and.returnValue(
      Observable.of({
        ok: true,
        messages: [{ code: "WAG_I_PROFILE_200" }]
      })
    );
    component.submitAnswer();
  });

  it("Should call - omit_special_char", () => {
    component.omit_special_char({ charCode: "55" });
  });

  it("Should call - getLastFourNumber", () => {
    component.getLastFourNumber("123456");
  });

  it("Should call - getSecurityQuestionCode", () => {
    spyOn(http, "getData").and.returnValue(Observable.of({}));
    component.getSecurityQuestionCode();
  });

  it("Should call - htmlToPlaintext", () => {
    component.htmlToPlaintext("");
  });

  it("Should call - ongetSecurityQuestionsError", () => {
    spyOn(_messageService, "addMessage").and.stub();
    component.ongetSecurityQuestionsError();
  });

  it("Should call - onsubmitCodeError", () => {
    spyOn(_messageService, "addMessage").and.stub();
    component.onsubmitCodeError();
  });
});
