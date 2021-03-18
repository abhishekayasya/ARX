import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FamilyInvitePageComponent } from "./invite-page.component";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AppTestingModule } from "./../../../../../../tests/app.testing.module";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { HttpClientService } from "@app/core/services/http.service";
import { CommonUtil } from "@app/core/services/common-util.service";

describe("FamilyInvitePageComponent", () => {
  let component: FamilyInvitePageComponent;
  let fixture: ComponentFixture<FamilyInvitePageComponent>;
  let httpService;
  let commonservice;
  let routerservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyInvitePageComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({ invitation_token: "test" })
          }
        }
      ]
    })
      .compileComponents()
      .then(() => {
        httpService = TestBed.get(HttpClientService);
        commonservice = TestBed.get(CommonUtil);
        routerservice = TestBed.get(Router);
        fixture = TestBed.createComponent(FamilyInvitePageComponent);
        component = fixture.componentInstance;
      });
  }));
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should execute ngOnInit", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.of({
        adminFirstName: "test",
        adminLastName: "test"
      })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit WAG_W_FA_1073", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_W_FA_1073" }]
      })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit WAG_I_FA_1075", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1075" }]
      })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit WAG_W_FA_1076", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_W_FA_1076" }]
      })
    );
    spyOn(routerservice, "navigateByUrl").and.stub();
    component.ngOnInit();
  });
  it("should execute ngOnInit WAG_W_FA_1080", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_W_FA_1080" }]
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.ngOnInit();
  });
  it("should execute ngOnInit WAG_W_FA_1081", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_W_FA_1081" }]
      })
    );
    component.ngOnInit();
  });
  it("should execute ngOnInit error", () => {
    spyOn(httpService, "postData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.ngOnInit();
  });
  it("should execute acceptInvite", () => {
    spyOn(httpService, "putData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1078" }]
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.acceptInvite();
  });
  it("should execute acceptInvite else", () => {
    spyOn(httpService, "putData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1077" }]
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.acceptInvite();
  });
  it("should execute acceptInvite error", () => {
    spyOn(httpService, "putData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.acceptInvite();
  });
  it("should execute declineInvite", () => {
    spyOn(httpService, "putData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1056" }]
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.declineInvite();
  });
  it("should execute declineInvite else", () => {
    spyOn(httpService, "putData").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_FA_1057" }]
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.declineInvite();
  });
  it("should execute declineInvite error", () => {
    spyOn(httpService, "putData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    spyOn(commonservice, "navigate").and.stub();
    component.declineInvite();
  });
  it("should execute logoutPersist", () => {
    spyOn(commonservice, "navigate").and.stub();
    component.logoutPersist();
  });
});
