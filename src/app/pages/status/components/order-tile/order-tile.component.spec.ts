import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderTileComponent } from "./order-tile.component";
import { Hd_TransferModule } from "@app/pages/HD-Transfer/hd-transfer.module";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppContext } from "@app/core/services/app-context.service";
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF
} from "@angular/common";
import { CheckoutService } from "@app/core/services/checkout.service";
import { MessageService } from "@app/core/services/message.service";
import { UserService } from "@app/core/services/user.service";
import { GaService } from "@app/core/services/ga-service";
import { CookieService } from "ngx-cookie-service";
import { HttpClientService } from "@app/core/services/http.service";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { CommonUtil } from "@app/core/services/common-util.service";
import { DebugElement } from "@angular/core";
import { STATUS_MAP } from "@app/config/state-map.constant";

describe("OrderTileComponent", () => {
  let component: OrderTileComponent;
  let fixture: ComponentFixture<OrderTileComponent>;

  let debugElement: DebugElement;
  let _userService: UserService;
  let httpTestingController: HttpTestingController;
  let gaServiceSpy: any;
  let userServiceSpy: any;

  beforeEach(async(() => {
    gaServiceSpy = jasmine.createSpyObj("GaService", ["sendEvent"]);
    userServiceSpy = jasmine.createSpyObj("UserService", ["getActiveMemberId"]);
    TestBed.configureTestingModule({
      declarations: [OrderTileComponent],
      imports: [
        Hd_TransferModule,
        HttpClientModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        RouterModule.forRoot([])
      ],
      providers: [
        AppContext,
        DatePipe,
        CheckoutService,
        MessageService,
        UserService,
        GaService,
        CookieService,
        HttpClientService,
        HttpClientTestingModule,
        HttpTestingController,
        CommonUtil,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: GaService, useValue: gaServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrderTileComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        httpTestingController = TestBed.get(HttpTestingController);
        _userService = TestBed.get(UserService);
      });
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should create ngOnInit method", () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it(`should call gaEventWithData function`, () => {
    component.gaEventWithData("test", "test", "test");
    expect(component).toBeTruthy();
  });
  it(`should call gaEventWithData function2`, () => {
    component.gaEventWithData("test");
    expect(component).toBeTruthy();
  });
  it(`should call getHeaderClass function`, () => {
    component.order = { priority: false };
    component.getHeaderClass(false);
    expect(component).toBeTruthy();
  });
  it(`should call getHeaderClass function2`, () => {
    component.getHeaderClass("priority");
    expect(component).toBeTruthy();
  });
  it(`should call ScheduleDelivery function`, () => {
    component.ScheduleDelivery("test");
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    const prescription = {
      longMessage: "test",
      prescriptionStatus: "status:test/testing"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function2`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    const prescription = {
      shortMessage: "test",
      prescriptionStatus: "Initiated",
      header: "In Progress",
      prescriptionType: "specialty"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function3`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    const prescription = {
      shortMessage: "test",
      prescriptionStatus: "Verified",
      header: "In Progress",
      prescriptionType: "specialty"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function4`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    // tslint:disable-next-line: max-line-length
    const prescription = {
      shortMessage: "test",
      prescriptionStatus: "Verified_Not_PSSO_Eligible",
      header: "In Progress",
      prescriptionType: "specialty"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function5`, () => {
    component.order = { isPrescriptionStatusDiffer: false };
    const prescription = { shortMessage: "test" };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function6`, () => {
    component.order = {
      isPrescriptionStatusDiffer: false,
      longMessage: "test"
    };
    const prescription = { shortMessage: "test" };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function7`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    // tslint:disable-next-line: max-line-length
    const prescription = {
      prescriptionType: "specialty",
      prescriptionStatus: "Initiated",
      header: "Action Need"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function7`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    // tslint:disable-next-line: max-line-length
    const prescription = {
      prescriptionType: "specialty",
      prescriptionStatus: "Initiated",
      header: "Action Needed"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function8`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    // tslint:disable-next-line: max-line-length
    const prescription = {
      prescriptionType: "specialty",
      prescriptionStatus: "RefillDue",
      header: "Attention Needed"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
  it(`should call fetchMessageForPrescription function9`, () => {
    component.order = { isPrescriptionStatusDiffer: true };
    // tslint:disable-next-line: max-line-length
    const prescription = {
      prescriptionStatus: "testing",
      header: "specialty",
      prescriptionType: "specialty"
    };
    component.fetchMessageForPrescription(prescription);
    expect(component).toBeTruthy();
  });
});
