import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from "@angular/core/testing";
import { CommonUtil } from "@app/core/services/common-util.service";
import { GaService } from "@app/core/services/ga-service";
import { RefillBaseService } from "@app/core/services/refill-base.service";
import { UserService } from "@app/core/services/user.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { masterData } from "../../../../../../tests/drug-info";
import { RxHistoryComponent } from "../rx-history/rx-history.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { SearchPrescriptions } from "../../../../../../test/mocks/prescriptions";

describe("RxHistoryComponent", () => {
  let component: RxHistoryComponent;
  let fixture: ComponentFixture<RxHistoryComponent>;
  let userService: UserService;
  let _common: CommonUtil;
  let _refillService: RefillBaseService;
  let gaService: GaService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RxHistoryComponent],
      imports: [AppTestingModule],
      providers: [DeviceDetectorService]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(RxHistoryComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
    _refillService = TestBed.get(RefillBaseService);
    gaService = TestBed.get(GaService);
  }));

  it("should create", fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it("should execute ngOnInit", fakeAsync(() => {
    component.viewIdObservable = of(masterData.prescriptions[0]);
    _refillService.masterData = masterData;
    spyOn(component, "fetchRxHistory").and.callFake(() => {
      return of([
        {
          fillDate: "08/23/2019",
          statusPrice: { status: "RefillDue", quantity: "10", insurance: "N/A" }
        },
        { fillDate: "07/16/2019", statusPrice: { quantity: "10" } },
        { fillDate: "08/23/2019", statusPrice: { quantity: "10" } }
      ]);
    });
    component.ngOnInit();
    expect(component).toBeTruthy();
  }));

  it("should execute ngOnInit error", fakeAsync(() => {
    component.viewIdObservable = of({
      viewId: "HISTORY_MULTILINE_VIEW_65938107"
    });
    _refillService.masterData = masterData;
    spyOn(component.viewIdObservable, "subscribe").and.callThrough();
    spyOn(component, "fetchRxHistory").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.ngOnInit();
    expect(component).toBeTruthy();
  }));

  it("should execute fetchRxHistory1", fakeAsync(() => {
    const fetch_data = {
      statusBanner: "123",
      prescriptions: [
        { instructions: "123" },
        { instructions: "456", relatedRx: "789" }
      ]
    };
    spyOn(_refillService, "fetchRxHistory").and.returnValue([fetch_data]);
    component.fetchRxHistory(masterData.prescriptions[0]);
    expect(component).toBeTruthy();
  }));

  it("should execute fetchRxHistory2", fakeAsync(() => {
    const fetch_data = {
      statusBanner: "123",
      prescriptions: [
        { relatedRx: "123" },
        { instructions: "456", relatedRx: "789" }
      ]
    };
    spyOn(_refillService, "fetchRxHistory").and.returnValue([fetch_data]);
    component.fetchRxHistory(masterData.prescriptions[0]);
    expect(component).toBeTruthy();
  }));

  it("should execute fetchRxHistory3", fakeAsync(() => {
    const fetch_data = {
      statusBanner: "123"
    };
    spyOn(_refillService, "fetchRxHistory").and.returnValue([fetch_data]);
    component.fetchRxHistory(masterData.prescriptions[0]);
    expect(component).toBeTruthy();
  }));

  it("should execute executeEditShipCallback", fakeAsync(() => {
    component.executeEditShipCallback("123");
    expect(component).toBeTruthy();
  }));

  it("should call onResize1", () => {
    const event = { target: { innerWidth: "1000" } };
    component.onResize(event);
    expect(component).toBeTruthy();
  });

  it("should call onResize2", () => {
    const event = { target: { innerWidth: 250 } };
    component.onResize(event);
    expect(component).toBeTruthy();
  });

  it("should call checkoutPrescriptions", () => {
    component._prescription = masterData.prescriptions[0];
    spyOn(_refillService, "initCheckoutRequest").and.stub();
    component.checkoutPrescriptions();
    expect(component).toBeTruthy();
  });

  it("should execute executeEditShipCallback", () => {
    component.executeEditShipCallback("123");
  });

  it("should execute checkoutPrescriptions", () => {
    component._prescription = SearchPrescriptions.prescriptions[0];
    spyOn(_refillService, "initCheckoutRequest").and.stub();
    component.checkoutPrescriptions();
  });

  it("should execute fetchRxHistory", () => {
    const fetch_data = {
      statusBanner: "123",
      prescriptions: SearchPrescriptions.prescriptions
    };
    spyOn(_refillService, "fetchRxHistory").and.returnValue(
      Observable.of(fetch_data)
    );
    component.fetchRxHistory({});
  });
});
