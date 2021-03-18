import { CommonUtil } from "@app/core/services/common-util.service";
import { UserService } from "@app/core/services/user.service";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { EditShippingComponent } from "./edit-shipping.component";
import { HttpClientService } from "@app/core/services/http.service";
import { Observable } from "rxjs/Observable";
import { RefillBaseService } from "@app/core/services/refill-base.service";
import { masterData, data } from "../../../../../../tests/drug-info";
import { of } from "rxjs/observable/of";
import { ArxUser } from "@app/models";

describe("EditShippingComponent", () => {
  let component: EditShippingComponent;
  let fixture: ComponentFixture<EditShippingComponent>;
  let _httpclientService: HttpClientService;
  let _refillService: RefillBaseService;
  let _userService;
  let _common;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditShippingComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EditShippingComponent);
        component = fixture.componentInstance;
        _httpclientService = TestBed.get(HttpClientService);
        _refillService = TestBed.get(RefillBaseService);
        _refillService.masterData = masterData;
        _userService = TestBed.get(UserService);
        _userService.user = new ArxUser("11948190939");
        _common = TestBed.get(CommonUtil);
      });
  }));

  it("should create EditShippingComponent component", () => {
    expect(component).toBeTruthy();
  });
  it("should execute ngOnInit", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    _refillService.masterData = masterData;
    spy = spyOn(component, "shippingObservable").and.callFake(() => {
      return of("test");
    });
    component.ngOnInit();
  });
  it("should execute ngAfterViewInit", () => {
    component.ngAfterViewInit();
  });
  it("should execute fillCardData", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    fixture.detectChanges();
    component.fillCardData();
  });
  it("should execute updateShippingInfo", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    fixture.detectChanges();
    spyOn(_common, "encryptCCNumber").and.returnValue(
      Observable.of({ number: 123, subfid9B: 123 })
    );
    spy = spyOn(_userService, "getCCToken").and.returnValue(
      Observable.of({ tokenDetails: [{ transactionId: 123 }] })
    );
    component.updateShippingInfo();
    expect(component).toBeTruthy();
  });
  it("should execute updateShippingInfo else", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    fixture.detectChanges();
    spyOn(_common, "encryptCCNumber").and.returnValue(
      Observable.of({ number: 123, subfid9B: 123 })
    );
    spy = spyOn(_userService, "getCCToken").and.returnValue(
      Observable.of({ tokenDetails: [{ data: "test" }] })
    );
    component.updateShippingInfo();
    expect(component).toBeTruthy();
  });
  it("should execute updateShippingInfo error", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    fixture.detectChanges();
    spyOn(_common, "encryptCCNumber").and.returnValue(
      Observable.of({ number: 123, subfid9B: 123 })
    );
    spy = spyOn(_userService, "getCCToken").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.updateShippingInfo();
    expect(component).toBeTruthy();
  });
  it("should execute updateShippingInfosave", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    fixture.detectChanges();
    spyOn(_httpclientService, "doPost").and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              { code: "WAG_I_PROFILE_2004", message: "success", type: "INFO" }
            ]
          };
        }
      })
    );
    component.updateShippingInfosave();
  });
  it("should execute updateShippingInfosave else", () => {
    component.shippingObservable = Observable.of(masterData.prescriptions[0]);
    fixture.detectChanges();
    spyOn(_httpclientService, "doPost").and.returnValue(
      Promise.resolve({
        json: () => {
          return "test";
        }
      })
    );
    spyOn(_refillService, "autoRefillFN").and.returnValue(
      Promise.resolve({
        json: () => {
          return { prescription: { messages: undefined } };
        }
      })
    );
    component.updateShippingInfosave();
  });
  it("should execute updateCreditCard", () => {
    component.updateCreditCard();
  });
  it("should execute updateCCType", () => {
    const event = { type: "test" };
    component.updateCCType(event);
  });
});
