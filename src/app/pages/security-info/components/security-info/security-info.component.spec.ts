import { APP_BASE_HREF, DatePipe } from "@angular/common";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from "@angular/core/testing";
import { AppContext } from "@app/core/services/app-context.service";
import { CheckoutService } from "@app/core/services/checkout.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { GaService } from "@app/core/services/ga-service";
import { HttpClientService } from "@app/core/services/http.service";
import { MessageService } from "@app/core/services/message.service";
import { UserService } from "@app/core/services/user.service";
import { CookieService } from "ngx-cookie-service";
import { AppTestingModule } from "../../../../../../tests/app.testing.module";
import { SecurityInfoService } from "../../securityinfo.service";
import { SecurityInfoComponent } from "./security-info.component";

describe("SecurityInfoComponent", () => {
  let component: SecurityInfoComponent;
  let fixture: ComponentFixture<SecurityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityInfoComponent],
      imports: [AppTestingModule],
      providers: [
        DatePipe,
        { provide: APP_BASE_HREF, useValue: "/" },
        MessageService,
        GaService,
        AppContext,
        UserService,
        HttpClientService,
        CommonUtil,
        CookieService,
        CheckoutService,
        SecurityInfoService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityInfoComponent);
    component = fixture.componentInstance;
  });

  it("should create", fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
  it("should create updateCookie", fakeAsync(() => {
    component.updateCookie("securityInfoBanner");
  }));
  it("should create updateCookie else case", fakeAsync(() => {
    component.updateCookie("test");
  }));
  it("Should call - ongetSecurityQuestionsError - error", fakeAsync(() => {
    spyOn(component, "ongetSecurityQuestionsError").and.stub();
    component.ongetSecurityQuestionsError();
  }));
  it("Should call - ongetSecurityQuestionsError", fakeAsync(() => {
    component.ongetSecurityQuestionsError();
  }));
  xit("should create moveToSecQues", fakeAsync(() => {
    component.moveToSecQues("");
  }));
  xit("should create moveToUserInfo", fakeAsync(() => {
    component.moveToUserInfo("");
  }));
  it("should create getSecurityQuestions", fakeAsync(() => {
    component.getSecurityQuestions();
  }));
});
