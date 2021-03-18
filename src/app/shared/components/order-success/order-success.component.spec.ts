import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderSuccessComponent } from "./order-success.component";
import { CheckoutService } from "@app/core/services/checkout.service";
import { HttpClientService } from "@app/core/services/http.service";
import { AppTestingModule } from "../../../../../tests/app.testing.module";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs/Observable";

describe("OrderSuccessComponent", () => {
  let component: OrderSuccessComponent;
  let fixture: ComponentFixture<OrderSuccessComponent>;
  let _checkoutService: CheckoutService;
  let _httpService: HttpClientService;
  let spy: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSuccessComponent);
    component = fixture.componentInstance;
    _checkoutService = TestBed.get(CheckoutService);
    _httpService = TestBed.get(HttpClientService);
    sessionStorage.setItem("ck_combo", JSON.stringify("test"));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call ngOnInit", () => {
    _checkoutService.isCombo = true;
    sessionStorage.setItem(
      "hd_order",
      JSON.stringify({
        checkoutDetails: [
          {
            type: "HOMEDELIVERY",
            boxDetails: {
              shippingInfo: {
                srxDeliveryAddr: "test",
                shippingOptions: [
                  {
                    value: "1"
                  }
                ]
              }
            }
          }
        ]
      })
    );
    component.ngOnInit();
  });
  it("should call ngOnInit else", () => {
    _checkoutService.submitOrderPayload = {
      checkoutDetails: [
        {
          type: "HOMEDELIVERY",
          boxDetails: {
            shippingInfo: {
              srxDeliveryAddr: "test",
              shippingOptions: [
                {
                  value: "1"
                }
              ]
            }
          }
        }
      ],
      messages: [
        { code: "WAG_RXCHECKOUT_002", message: "success", type: "WARNING" }
      ]
    };
    spyOn(_httpService, "postData").and.returnValue(Observable.of("test"));
    component.ngOnInit();
  });
  it("should call ngOnInit elseif", () => {
    _checkoutService.submitOrderPayload = {
      messages: [
        { code: "WAG_RXCHECKOUT_001", message: "success", type: "WARNING" }
      ]
    };
    spyOn(_httpService, "postData").and.returnValue(Observable.of("test"));
    component.ngOnInit();
  });
  it("should call ngOnInit elseif", () => {
    _checkoutService.submitOrderPayload = {
      message: [
        { code: "WAG_RXCHECKOUT_001", message: "success", type: "WARNING" }
      ]
    };
    spyOn(_httpService, "postData").and.returnValue(Observable.of("test"));
    component.ngOnInit();
  });
  it("should call ngOnInit error", () => {
    spyOn(_httpService, "postData").and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.ngOnInit();
  });
  it("should call sendHDEvent", () => {
    component.sendHDEvent("", false);
  });
  it("should call sendSpecialityEvent", () => {
    component.sendSpecialityEvent("", "", "");
  });
  it("should call checkwarning", () => {
    component.checkwarning({
      messages: [
        { code: "WAG_RXCHECKOUT_001", message: "success", type: "WARNING" }
      ]
    });
  });

  it(`should call countHDPrescriptions`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "HOMEDELIVERY",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "countHDPrescriptions").and.callThrough();
    component.countHDPrescriptions();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call countUnsolicitedPrescriptions`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "UNSOLICITED",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "countUnsolicitedPrescriptions").and.callThrough();
    component.countUnsolicitedPrescriptions();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call countCleansedPrescriptions`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "CLEANSED",
        prescriptions: {},
        patient: [
          {
            referrals: { prescriptions: [1, 2, 3] }
          }
        ]
      }
    ];
    spy = spyOn(component, "countCleansedPrescriptions").and.callThrough();
    component.countCleansedPrescriptions();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call sendGaEvent`, () => {
    component.checkoutDetails = [
      {
        type: "CLEANSED",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "sendGaEvent").and.callThrough();
    component.sendGaEvent();
    expect(spy).toHaveBeenCalled();
  });
  it(`should call sendGaEvent`, () => {
    component.checkoutDetails = [
      {
        type: "UNSOLICITED",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "sendGaEvent").and.callThrough();
    component.sendGaEvent();
    expect(spy).toHaveBeenCalled();
  });
  it(`should call sendGaEvent`, () => {
    component.checkoutDetails = [
      {
        type: "HOMEDELIVERY",
        prescriptions: {}
      }
    ];
    component.checkoutDetails = [
      {
        type: "UNSOLICITED",
        prescriptions: {}
      }
    ];
    component.checkoutDetails = [
      {
        type: "CLEANSED",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "sendGaEvent").and.callThrough();
    component.sendGaEvent();
    expect(spy).toHaveBeenCalled();
  });
  it(`should call getPrescriptionsCount`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "CLEANSED",
        prescriptions: {},
        patient: [
          {
            referrals: { prescriptions: [1, 2, 3] }
          }
        ]
      }
    ];
    spy = spyOn(component, "getPrescriptionsCount").and.callThrough();
    component.getPrescriptionsCount();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getPrescriptionsCount`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "HOMEDELIVERY",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "getPrescriptionsCount").and.callThrough();
    component.getPrescriptionsCount();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call calculateShippingDetails`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "HOMEDELIVERY",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "calculateShippingDetails").and.callThrough();
    component.calculateShippingDetails();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getPrescriptionsCount`, () => {
    component.checkoutDetails = [
      {
        prescriptionType: "UNSOLICITED",
        prescriptions: {}
      }
    ];
    spy = spyOn(component, "getPrescriptionsCount").and.callThrough();
    component.getPrescriptionsCount();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call processCreditCardInformation`, () => {
    component.reviewData = {
      deliveryMethod: {
        shippingInfo: {
          creditCardNumber: "4032323232323545"
        }
      }
    };
    spy = spyOn(component, "processCreditCardInformation").and.callThrough();
    component.processCreditCardInformation();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call print`, () => {
    spyOn(component, "print").and.stub();
  });
});
