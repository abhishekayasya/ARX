import { CommonUtil } from './../../../core/services/common-util.service';
import { UserService } from './../../../core/services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { RefillInfoComponent } from './refill-info.component';
import { ArxUser, Address } from '@app/models';
import { jsonUsr } from '../../../../../test/mocks/userService.mocks';
import { BuyoutService } from '@app/core/services/buyout.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';

describe('RefillInfoComponent', () => {
  let component: RefillInfoComponent;
  let fixture: ComponentFixture<RefillInfoComponent>;
  let userService: UserService;
  let common;
  let _buyout: BuyoutService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _buyout = TestBed.get(BuyoutService);
        userService.user = new ArxUser('11948190939');
        userService.user.profile = jsonUsr;
        fixture = TestBed.createComponent(RefillInfoComponent);
        component = fixture.componentInstance;
        common = TestBed.get(CommonUtil);
        sessionStorage.setItem(
          'insurance_success_flag',
          JSON.stringify('test')
        );
      });
  }));

  afterEach(() => {
    sessionStorage.removeItem('insurance_success_flag');
  });

  it('should create', () => {
    spyOn(component, 'checkoutBuyoutUser').and.stub();
    spyOn(component, 'showInsuranceSuccessMessage').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should excute goto', () => {
    spyOn(common, 'navigate').and.stub();
    component.goto('/manageprescriptions');
  });
  it('should excute goto else', () => {
    spyOn(common, 'navigate').and.stub();
    component.goto('test');
  });
  it('should excute redirectForInsuranceUpdate', () => {
    spyOn(common, 'navigate').and.stub();
    component.redirectForInsuranceUpdate();
  });

  it('should excute updateMember', () => {
    spyOn(component, 'fireChangeActiveMemberGAEvent').and.stub();
    spyOn(component, 'checkoutBuyoutUser').and.stub();
    component.activeMember = '11948190939';
    component.updateMember('');
  });

  it('should excute updateMember - false', () => {
    spyOn(component, 'fireChangeActiveMemberGAEvent').and.stub();
    spyOn(component, 'checkoutBuyoutUser').and.stub();
    component.activeMember = '1194819093';
    component.updateMember('');
  });

  it('should excute checkoutBuyoutUser', () => {
    spyOn(_buyout, 'available').and.returnValue(
      Observable.of({ isBuyoutUnlock: true })
    );
    component.checkoutBuyoutUser(11948190939);
  });

  it('should excute fireChangeActiveMemberGAEvent', () => {
    component.activeMember = 'addMember';
    spyOn(component, 'fireChangeActiveMemberGAEvent').and.stub();
    component.fireChangeActiveMemberGAEvent('addMember');
  });

  it('should excute fireChangeActiveMemberGAEvent - false', () => {
    spyOn(component, 'fireChangeActiveMemberGAEvent').and.stub();
    component.fireChangeActiveMemberGAEvent('');
  });

  it('should excute closeInsuMsg', () => {
    component.closeInsuMsg();
  });

  it('should excute showInsuranceSuccessMessage', () => {
    component.showInsuranceSuccessMessage();
  });
});
