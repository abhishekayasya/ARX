import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectAddressComponent } from "./select-address.component";
import { UserService } from "@app/core/services/user.service";
import { CheckoutService } from "@app/core/services/checkout.service";
import { ArxUser } from "@app/models";
import { jsonUsr } from "../../../../../../../test/mocks/userService.mocks";
import { AppTestingModule } from "../../../../../../../tests/app.testing.module";
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";

describe("SelectAddressComponent", () => {
  let component: SelectAddressComponent;
  let fixture: ComponentFixture<SelectAddressComponent>;
  let cheout: CheckoutService;
  let userService: UserService;
  let debugElement: DebugElement;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAddressComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SelectAddressComponent);
        component = fixture.componentInstance;
        cheout = TestBed.get(CheckoutService);
        userService = TestBed.get(UserService);
        debugElement = fixture.debugElement;
        spyOn(userService, "getActiveMemberId").and.returnValue("11942712532");
      });
  }));

  it("should execute ngAfterViewInit", () => {
    const data = {
      ad_edit_success: "suceess"
    };
    const val = JSON.stringify(data);
    sessionStorage.setItem("ad_edit_success", val);
    spy = spyOn(component, "ngAfterViewInit").and.callThrough();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it("should execute ngAfterViewInit", () => {
    const val = JSON.stringify(null);
    sessionStorage.setItem(null, val);
    spy = spyOn(component, "ngAfterViewInit").and.callThrough();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it("should execute gaEvent", () => {
    cheout.isCombo = true;
    userService.user = new ArxUser("11942712532");
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, "gaEvent").and.callThrough();
    component.gaEvent();
    expect(spy).toHaveBeenCalled();
  });
});
