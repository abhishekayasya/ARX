import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { InboxComponent } from "./inbox.component";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AppTestingModule } from "./../../../../../tests/app.testing.module";
import { CommonUtil } from "@app/core/services/common-util.service";
import { UserService } from "@app/core/services/user.service";
import { ArxUser } from "@app/models";
import { NotificationService } from "@app/core/services/notification.service";
import { Observable } from "rxjs/Observable";
import { PagerController } from "@app/shared/pager.controller";

xdescribe("InboxComponent", () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let _commonservice: CommonUtil;
  let _userService: UserService;
  let _notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InboxComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _userService = TestBed.get(UserService);
        _userService.user = new ArxUser("11948190939");
        fixture = TestBed.createComponent(InboxComponent);
        component = fixture.componentInstance;
        _commonservice = TestBed.get(CommonUtil);
        _notificationService = TestBed.get(NotificationService);
      });
  }));
  it("should create InboxComponent", () => {
    expect(component).toBeTruthy();
  });
  it("should execute ngOnInit", () => {
    spyOn(_notificationService, "fetchInboxMessages").and.returnValue(
      Observable.of({
        psmmessages: { code: "WAG_I_AB_100", message: "success", type: "INFO" },
        count: { inbox: 1 }
      })
    );
    expect(_notificationService).toBeTruthy();
    component.ngOnInit();
  });
  it("should execute ngOnInit", () => {
    spyOn(_notificationService, "fetchInboxMessages").and.returnValue(
      Observable.of({
        psmmessages: { code: "WAG_I_AB_100", message: "success", type: "INFO" },
        count: { inbox: 0 }
      })
    );
    expect(_notificationService).toBeTruthy();
    component.ngOnInit();
  });
  it("should execute ngOnInit with message", () => {
    spyOn(_notificationService, "fetchInboxMessages").and.returnValue(
      Observable.of({
        messages: [{ code: "WAG_I_AB_100", message: "success", type: "INFO" }]
      })
    );
    expect(_notificationService).toBeTruthy();
    component.ngOnInit();
  });
  it("should execute ngOnInit with error", () => {
    spyOn(_notificationService, "fetchInboxMessages").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    expect(_notificationService).toBeTruthy();
    component.ngOnInit();
  });
  it("should execute gotoDetail", () => {
    spyOn(_commonservice, "navigate").and.stub();
    component.gotoDetail("test");
  });
  it("should execute selectForDelete", () => {
    component.table = new PagerController([{ selectForDelete: true }], 1);
    const ev = { target: { checked: true } };
    component.selectForDelete(0, ev);
  });
  it("should execute selectForDelete else", () => {
    component.table = new PagerController([{ selectForDelete: true }], 1);
    const ev = { target: { checked: false } };
    component.selectForDelete(0, ev);
  });
  it("should execute selectAll", () => {
    component.table = new PagerController([{ selectForDelete: true }], 1);
    const ev = { target: { checked: true } };
    component.selectAll(ev);
  });
  it("should execute selectAll else", () => {
    component.table = new PagerController([{ selectForDelete: true }], 1);
    const ev = { target: { checked: false } };
    component.selectAll(ev);
  });
  it("should execute delete selectedForDelete=true", () => {
    spyOn(_notificationService, "deleteMessage").and.returnValue(
      Observable.of(true)
    );
    spyOn(_notificationService, "fetchInboxMessages").and.returnValue(
      Observable.of({
        psmmessages: { code: "WAG_I_AB_100", message: "success", type: "INFO" },
        count: { inbox: 1 }
      })
    );
    component.table = new PagerController(
      [{ selectedForDelete: true, microService: true }],
      1
    );
    component.delete();
  });
  it("should execute delete ", () => {
    spyOn(_notificationService, "deleteMessage").and.returnValue(
      Observable.of(true)
    );
    spyOn(_notificationService, "fetchInboxMessages").and.returnValue(
      Observable.of({
        psmmessages: { code: "WAG_I_AB_100", message: "success", type: "INFO" },
        count: { inbox: 1 }
      })
    );
    component.table = new PagerController(
      [{ selectedForDelete: true, microService: false }],
      1
    );
    component.delete();
  });
  it("should execute delete else", () => {
    spyOn(_notificationService, "deleteMessage").and.returnValue(
      Observable.of(false)
    );
    component.table = new PagerController(
      [{ selectedForDelete: true, microService: true }],
      1
    );
    component.delete();
  });
  it("should execute delete error", () => {
    spyOn(_notificationService, "deleteMessage").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.table = new PagerController(
      [{ selectedForDelete: true, microService: true }],
      1
    );
    component.delete();
  });
  it("should execute delete selectedForDelete=false", () => {
    spyOn(_notificationService, "deleteMessage").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.table = new PagerController(
      [{ selectedForDelete: false, microService: false }],
      1
    );
    component.delete();
  });
});
