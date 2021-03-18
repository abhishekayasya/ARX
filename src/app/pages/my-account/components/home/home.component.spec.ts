import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AccountHomeComponent } from './home.component';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
import { CommonUtil } from '@app/core/services/common-util.service';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from '@app/core/services/http.service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';

describe('AccountHomeComponent', () => {
  let component: AccountHomeComponent;
  let fixture: ComponentFixture<AccountHomeComponent>;
  let _userService;
  let _commonService;
  let _httpService;
  let _contentService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountHomeComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _userService = TestBed.get(UserService);
        _userService.user = new ArxUser('11948190939');
        _userService.user.profile = jsonUsr;
        fixture = TestBed.createComponent(AccountHomeComponent);
        _commonService = TestBed.get(CommonUtil);
        _httpService = TestBed.get(HttpClientService);
        _contentService = TestBed.get(JahiaContentService);
        component = fixture.componentInstance;
        component.modalContent = {
          title: 'For this, we\'ll send you to Walgreens.com',
          description: '',
          cancelText: 'Cancel',
          okText: 'Continue',
          link: ''
        };
      });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute gotoMessages', () => {
    spyOn(_commonService, 'navigate').and.stub();
    component.gotoMessages();
  });
  it('should execute getInsuranceStatus', () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({ status: '200 OK', insuranceOnFile: 'Yes' })
    );
    component.getInsuranceStatus();
  });
  it('should execute getInsuranceStatus for error', () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.throw({ status: '500' })
    );
    component.getInsuranceStatus();
  });
  it('should execute goToExternalLink', () => {
    component.goToExternalLink({ preventDefault: () => {} }, 'test');
  });
  it('should execute redirectModalUpdate for report/rxprint', () => {
    component.modalContent.link = 'url/report/rxprint';
    component.redirectModalUpdate(true);
  });
  it('should execute redirectModalUpdate for payments', () => {
    component.modalContent.link = 'url/payments';
    component.redirectModalUpdate(true);
  });
  it('should execute redirectConfirm for true', () => {
    spyOn(window, 'open').and.stub();
    component.modalContent.link = 'url/report/rxprint';
    component.redirectConfirm({ preventDefault: () => {} }, true);
  });
  it('should execute redirectConfirm for true', () => {
    spyOn(window, 'open').and.stub();
    component.modalContent.link = 'url/payments';
    component.redirectConfirm({ preventDefault: () => {} }, true);
  });
  it('should execute redirectConfirm for false', () => {
    component.modalContent.link = 'url/report/rxprint';
    component.redirectConfirm({ preventDefault: () => {} }, false);
  });
  it('should execute redirectConfirm for false', () => {
    component.modalContent.link = 'url/payments';
    component.redirectConfirm({ preventDefault: () => {} }, false);
  });
  it('should execute getInsuranceStatusToDisplay for No', () => {
    component.insuranceStatus = 'No';
    component.getInsuranceStatusToDisplay();
  });
  it('should execute getInsuranceStatusToDisplay for Yes', () => {
    component.insuranceStatus = 'Yes';
    component.getInsuranceStatusToDisplay();
  });
  it('should execute getInsuranceStatusToDisplay for Pending', () => {
    component.insuranceStatus = 'Pending';
    component.getInsuranceStatusToDisplay();
  });
  it('should execute getInsuranceStatusToDisplay for test', () => {
    component.insuranceStatus = 'test';
    component.getInsuranceStatusToDisplay();
  });
  it('should execute getInsuranceDescriptionToDisplay for No', () => {
    component.insuranceStatus = 'No';
    component.getInsuranceDescriptionToDisplay();
  });
  it('should execute getInsuranceDescriptionToDisplay for Yes', () => {
    component.insuranceStatus = 'Yes';
    component.getInsuranceDescriptionToDisplay();
  });
  it('should execute getInsuranceDescriptionToDisplay for Pending', () => {
    component.insuranceStatus = 'Pending';
    component.getInsuranceDescriptionToDisplay();
  });
  it('should execute getInsuranceDescriptionToDisplay for test', () => {
    component.insuranceStatus = 'test';
    component.getInsuranceDescriptionToDisplay();
  });
  it('should execute updateInsuranceStatus', () => {
    component.updateInsuranceStatus();
  });
  it('should execute personalInfoLink', () => {
    component.personalInfoLink();
  });
  it('should execute securityInfoLink', () => {
    component.securityInfoLink();
  });
  it('should execute emailsNotificationsLink', () => {
    component.emailsNotificationsLink();
  });
  it('should execute insuranceInfoLink', () => {
    component.insuranceInfoLink();
  });
  it('should execute healthHistoryLink', () => {
    component.healthHistoryLink();
  });
  it('should execute expressPayLink', () => {
    component.expressPayLink();
  });
  it('should execute familyAccManagementLink', () => {
    component.familyAccManagementLink();
  });
});
