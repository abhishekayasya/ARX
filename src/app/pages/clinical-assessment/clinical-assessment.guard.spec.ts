import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { AppTestingModule } from "../../../../tests/app.testing.module";
import { ArxUser } from "@app/models";
import "rxjs/add/operator/toPromise";
import { UserService } from "@app/core/services/user.service";
import { HttpClientService } from "@app/core/services/http.service";
import { AppContext } from "@app/core/services/app-context.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { ClinicalAssessmentGuard } from "./clinical-assessment.guard";
import { RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";

describe("ClinicalAssessmentGuard", () => {
  let clinicalAssessmentGuard: ClinicalAssessmentGuard;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [ClinicalAssessmentGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser("11948190939");
        clinicalAssessmentGuard = TestBed.get(ClinicalAssessmentGuard);
      });
  }));

  afterEach(() => {
    localStorage.removeItem("u_info");
    sessionStorage.removeItem("ck_srx_rem");
  });

  it("Check ClinicalAssessmentGuard instance is available", () => {
    spyOn(_common, "navigate").and.stub();
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      "RouterStateSnapshot",
      ["toString"]
    );
    state.url = "/myaccount";
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      "ActivatedRouteSnapshot",
      ["toString"]
    );
    clinicalAssessmentGuard.canDeactivate(null, route, state, state);
    expect(clinicalAssessmentGuard).toBeTruthy();
  });
  it("Check ClinicalAssessmentGuard instance is available manageprescriptions", () => {
    spyOn(_common, "navigate").and.stub();
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      "RouterStateSnapshot",
      ["toString"]
    );
    state.url = "/manageprescriptions";
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      "ActivatedRouteSnapshot",
      ["toString"]
    );
    clinicalAssessmentGuard.canDeactivate(null, route, state, state);
    expect(clinicalAssessmentGuard).toBeTruthy();
  });
  it("Check ClinicalAssessmentGuard instance is available else", () => {
    spyOn(_common, "navigate").and.stub();
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      "RouterStateSnapshot",
      ["toString"]
    );
    state.url = "/test";
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      "ActivatedRouteSnapshot",
      ["toString"]
    );
    clinicalAssessmentGuard.canDeactivate(null, route, state, state);
    expect(clinicalAssessmentGuard).toBeTruthy();
  });
});
