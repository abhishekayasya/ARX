import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SecurityQuesComponent } from "./security-ques.component";
import { HttpClientService } from "@app/core/services/http.service";
import { UserService } from "@app/core/services/user.service";
import { Router } from "@angular/router";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs/Observable";

describe("SecurityQuesComponent", () => {
  let component: SecurityQuesComponent;
  let fixture: ComponentFixture<SecurityQuesComponent>;
  let _httpService;
  let _userService;
  let _routerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityQuesComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuesComponent);
    component = fixture.componentInstance;
    _httpService = TestBed.get(HttpClientService);
    _userService = TestBed.get(UserService);
    _routerService = TestBed.get(Router);
  });

  it("should create", () => {
    spyOn(_httpService, "postData").and.returnValue(
      Observable.of({
        securityQuestion: [
          { code: "WAG_I_AB_100", message: "success", type: "INFO" }
        ]
      })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it("should create else", () => {
    spyOn(_httpService, "postData").and.returnValue(
      Observable.of({
        basicProfile: {
          securityQuestion: [
            { code: "WAG_I_AB_100", message: "success", type: "INFO" }
          ]
        }
      })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it("should create error", () => {
    spyOn(_httpService, "postData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it("should execute getSecurityQuestions", () => {
    _userService.selectedSecurityQuestion = "test";
    spyOn(_httpService, "getData").and.returnValue(
      Observable.of({
        securityQuestions: [{ question: "test", code: "test" }]
      })
    );
    component.getSecurityQuestions();
  });
  it("should execute getSecurityQuestions undefined", () => {
    _userService.selectedSecurityQuestion = undefined;
    spyOn(_httpService, "getData").and.returnValue(
      Observable.of({
        securityQuestions: [{ question: "test", code: "test" }]
      })
    );
    component.getSecurityQuestions();
  });
  it("should execute getSecurityQuestions", () => {
    _userService.selectedSecurityQuestion = "undefined";
    spyOn(_httpService, "getData").and.returnValue(
      Observable.of({
        securityQuestions: [{ question: "test", code: "test" }]
      })
    );
    component.getSecurityQuestions();
  });
  it("should execute submitSecurityQuestionDetail", () => {
    _userService.selectedSecurityQuestion = "test";
    component.submitSecurityQuestionDetail();
  });
  it("should execute submitSecurityQuestionDetail ", () => {
    component.securityForm.setValue({
      questionCode: "test",
      answer: "answer"
    });
    spyOn(_routerService, "navigateByUrl").and.stub();
    spyOn(_httpService, "putData").and.returnValue(
      Observable.of({
        status: "success"
      })
    );
    component.submitSecurityQuestionDetail();
  });
  it("should execute submitSecurityQuestionDetail  else", () => {
    component.securityForm.setValue({
      questionCode: "test",
      answer: "answer"
    });
    spyOn(_httpService, "putData").and.returnValue(
      Observable.of({
        status: "fail",
        messages: [
          { code: "WAG_W_LOGIN_1024", message: "success", type: "INFO" }
        ]
      })
    );
    component.submitSecurityQuestionDetail();
  });
  it("should execute submitSecurityQuestionDetail  else", () => {
    component.securityForm.setValue({
      questionCode: "test",
      answer: "answer"
    });
    spyOn(_httpService, "putData").and.returnValue(
      Observable.of({
        status: "fail",
        message: [
          { code: "WAG_W_LOGIN_1024", message: "success", type: "INFO" }
        ]
      })
    );
    component.submitSecurityQuestionDetail();
  });
  it("should execute submitSecurityQuestionDetail  else", () => {
    component.securityForm.setValue({
      questionCode: "test",
      answer: "answer"
    });
    spyOn(_httpService, "putData").and.returnValue(
      Observable.of({
        status: "fail1",
        message: [
          { code: "WAG_W_LOGIN_1024", message: "success", type: "INFO" }
        ]
      })
    );
    component.submitSecurityQuestionDetail();
  });
  it("should execute submitSecurityQuestionDetail  error", () => {
    component.securityForm.setValue({
      questionCode: "test",
      answer: "answer"
    });
    spyOn(_httpService, "putData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.submitSecurityQuestionDetail();
  });
});
