import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EnrollInsuranceComponent } from './enroll-insurance.component';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { GaService } from '@app/core/services/ga-service';

import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MEMBER_DATA } from '../../../../../../test/mocks/enroll-insurance';
import { ArxUser } from '@app/models/user.model';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { BuyoutService } from '@app/core/services/buyout.service';
import {
  u_info,
  jsonUsr
} from '../../../../../../test/mocks/userService.mocks';
import { RefillBaseService } from '@app/core/services/refill-base.service';
describe('EnrollInsuranceComponent_Transfer', () => {
  let component: EnrollInsuranceComponent;
  let fixture: ComponentFixture<EnrollInsuranceComponent>;
  let _gaService: GaService;
  let _route: ActivatedRoute;
  let _userService: UserService;
  let _httpService: HttpClientService;
  let _buyoutService: BuyoutService;
  let _refillService: RefillBaseService;
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
    _refillService = TestBed.get(RefillBaseService);
    _userService.user = new ArxUser('11948190939');
    _userService.user.profile = jsonUsr;
    _buyoutService = TestBed.get(BuyoutService);
    component.showLoader = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(_userService, 'getActiveMemberId').and.stub();
    component.multipleMember = false;
    component.showLoader = false;
    expect(component).toBeTruthy();
  });

  it('should call - ngOninit', () => {
    spyOn(component, 'checkBuyOutUser').and.stub();
    spyOn(component, 'loadMemeberList').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`should call gaEvent function`, () => {
    component.gaEvent('noinsurance');
    expect(component).toBeTruthy();
  });

  it('should call loadMemeberList', () => {
    component.loadMemeberList();
    fixture.detectChanges();
    expect(component.multipleMember).toBeTruthy();
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

  it(`shpould call redirectToMyAccount`, () => {
    spyOn(component, 'redirectToRoute').and.stub();
    component.redirectToMyAccount();
    expect(component).toBeTruthy();
  });

  it(`should call updateMember -> isBuyoutUnlock -> true`, () => {
    _userService.user = new ArxUser('11948190939');
    component.updateMember('11948190939');
    expect(component).toBeTruthy();
  });

  xit(`should call checkBuyOutUser  `, () => {
    spyOn(_buyoutService, 'available').and.returnValue(
      Observable.of({
        isBuyoutUnlock: true,
        isBuyoutUser: false
      })
    );
    fixture.detectChanges();
    sessionStorage.setItem('fm_info', JSON.stringify({ active: 11948190939 }));
    component.checkBuyOutUser();
    sessionStorage.removeItem('fm_info');
    expect(component).toBeTruthy();
  });

  xit(`should call checkBuyOutUser -> isBuyoutUser -> true `, () => {
    spyOn(_buyoutService, 'available').and.returnValue(
      Observable.of({
        isBuyoutUnlock: false,
        isBuyoutUser: true
      })
    );
    _userService.user = new ArxUser('11948190939');
    sessionStorage.setItem('fm_info', JSON.stringify({ active: 11948190939 }));
    component.checkBuyOutUser();
    sessionStorage.removeItem('fm_info');

    fixture.detectChanges();
    expect(component.buyOutUser).toBeTruthy();
    expect(component.showLoader).toBeFalsy();
  });

  it(`should call checkBuyOutUser error response `, () => {
    spyOn(_buyoutService, 'available').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.checkBuyOutUser();
    expect(component.showLoader).toBeFalsy();
  });

  it(`Should call onCloseBuyoutBanner`, () => {
    component.displayBuyoutBanner = false;
    component.onCloseBuyoutBanner();
    expect(component.displayBuyoutBanner).toBeFalsy();
  });
});
