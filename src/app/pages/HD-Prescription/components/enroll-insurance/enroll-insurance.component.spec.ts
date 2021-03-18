import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EnrollInsuranceComponent } from './enroll-insurance.component';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { GaService } from '@app/core/services/ga-service';
import { ArxUser } from '@app/models/user.model';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { MEMBER_DATA } from '../../../../../../test/mocks/enroll-insurance';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
describe('EnrollInsuranceComponent', () => {
  let component: EnrollInsuranceComponent;
  let fixture: ComponentFixture<EnrollInsuranceComponent>;
  let _gaService: GaService;
  let _route: ActivatedRoute;
  let _userService: UserService;
  let _httpService: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollInsuranceComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { IsmultipleMember: MEMBER_DATA } },
            queryParams: Observable.of({ mid: 'test' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollInsuranceComponent);
    component = fixture.componentInstance;
    _gaService = TestBed.get(GaService);
    _userService = TestBed.get(UserService);
    _httpService = TestBed.get(HttpClientService);
    _route = TestBed.get(ActivatedRoute);
    _userService.user = new ArxUser('11948190939');
    _userService.user.profile = jsonUsr;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call - ngOninit', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`should call ViewMoreaction`, () => {
    component.viewless = true;
    component.ViewMoreaction();
    expect(component.viewless).toBeFalsy();
    component.viewless = false;
    component.ViewMoreaction();
    expect(component.viewless).toBeTruthy();
    component.viewless = true;
    component.ViewMoreaction();
    expect(component.viewless).toBeFalsy();
  });

  it(`should call gaEventWithData function`, () => {
    component.gaEventWithData('noinsurance', 'test', 'test');
    expect(component).toBeTruthy();
  });

  it(`should call gaEventWithData  without parameter -> 'label' , 'data' `, () => {
    component.gaEventWithData('noinsurance');
    expect(component).toBeTruthy();
  });

  it(`should call gaEvent function`, () => {
    component.gaEvent('noinsurance', 'test');
    expect(component).toBeTruthy();
  });

  it(`should call gaEvent without parameter -> 'label' `, () => {
    component.gaEvent('noinsurance');
    expect(component).toBeTruthy();
  });

  it('should call firePhoneNumberSpecialtyPharmacyGaEvent ', () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.firePhoneNumberSpecialtyPharmacyGaEvent();
    expect(component).toBeTruthy();
  });

  it(`should call fireRxFaxFormSpanishGaEvent`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.fireRxFaxFormSpanishGaEvent();
    expect(component).toBeTruthy();
  });

  it('should call fireRxFaxFormEngGaEvent', () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.fireRxFaxFormEngGaEvent();
    expect(component).toBeTruthy();
  });

  it('should call fireHdNewPrescriptionPatientNameGAEvent', () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.fireHdNewPrescriptionPatientNameGAEvent('test');
    expect(component).toBeTruthy();
  });

  it('should call loadMemeberList', () => {
    component.loadMemeberList();
    fixture.detectChanges();
    expect(component.multipleMember).toBeTruthy();
  });

  it(`shpould call redirectToMyAccount`, () => {
    spyOn(component, 'redirectToRoute').and.stub();
    component.redirectToMyAccount();
    expect(component).toBeTruthy();
  });

  it(`should call getPatientInfo `, () => {
    component.getPatientInfo('11948190939');
    expect(component).toBeTruthy();
  });

  it(`should call updateMember `, () => {
    _userService.user = new ArxUser('11948190939');
    component.updateMember('11948190939');
    expect(component).toBeTruthy();
  });

  it(`should call getInsuranceStatus`, () => {
    spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({ status: '200 OK', insuranceOnFile: 'Yes' })
    );
    _userService.user = new ArxUser('11948190939');
    component.getInsuranceStatus();
    expect(_userService.getActiveMemberId).toHaveBeenCalled();
  });

  it(`should call getInsuranceStatus  `, () => {
    spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({ status: '200 OK', insuranceOnFile: 'Yes' })
    );
    _userService.user = new ArxUser('123');
    component.getInsuranceStatus();
    expect(_userService.getActiveMemberId).toHaveBeenCalled();
  });

  it(`should call getInsuranceStatus success response  `, () => {
    spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({ status: '200 OK', insuranceOnFile: 'No' })
    );
    _userService.user = new ArxUser('123');
    component.getInsuranceStatus();
    expect(_userService.getActiveMemberId).toHaveBeenCalled();
  });

  it(`Should call redirectToEnrollInsurnace`, () => {
    spyOn(component, 'redirectToEnrollI').and.stub();
    component.redirectToEnrollInsurnace();
    expect(component).toBeTruthy();
  });
});
