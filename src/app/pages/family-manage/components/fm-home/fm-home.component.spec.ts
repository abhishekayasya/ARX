import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from 'app/core/services/common-util.service';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { FmHomeComponent } from './fm-home.component';
import { Observable } from 'rxjs/Observable';
import { FmService } from '@app/core/services/fm.service';
const memberData = {
  members: [{
    messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1002' }],
    accountStatus: 'Full Access',
    memberType: 'Full',
    profileId: '1'
  }],
  adminProfiles: [
    {
      firstName: 'xxx',
      lastName: 'xxx'
    },
    {
      firstName: 'xxx',
      lastName: 'xxx'
    }
  ]
};
const memberData1 = {
  members: [{
    messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1003' }],
    accountStatus: 'Full Access',
    memberType: 'Full',
  }],
  adminProfiles: [
    {
      firstName: 'xxx',
      lastName: 'xxx'
    },
    {
      firstName: 'xxx',
      lastName: 'xxx'
    }
  ]
};
const memberData2 = {
  members: undefined,
  adminProfiles: [
    {
      firstName: 'xxx',
      lastName: 'xxx'
    },
    {
      firstName: 'xxx',
      lastName: 'xxx'
    }
  ]
};
const insuranceData = {
  msInsEnrollmentViewBeanList: [{
    meId: '1',
    MSEnrollmentInsuranceBean: { msInsStatusCd: 'test' }
  }]
};
const message_data = {
  messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1058' }]
};
const message_data1 = {
  messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1052' }]
};
const message_data2 = {
  messages: [{ message: '<strong>Hi</strong>' }],
  profileId: '200001370676',
  invitationInfo: {
    resendInvitationDate: '12/1/2019',
    resendInvitationTime: '12/1/2019',
    invitationTime: '11',
    invitationId: 1
  }
};
const message_data3 = {
  messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1061' }]
};
describe('FmHomeComponent', () => {
  let component: FmHomeComponent;
  let fixture: ComponentFixture<FmHomeComponent>;
  let userservice;
  let httpservice;
  let fmservice;
  let spy;
  let router;
  let common;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FmHomeComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FmHomeComponent);
        component = fixture.componentInstance;
        sessionStorage.setItem('fmInvMsg', JSON.stringify('test'));
        userservice = TestBed.get(UserService);
        router = TestBed.get(Router);
        common = TestBed.get(CommonUtil);
        httpservice = TestBed.get(HttpClientService);
        fmservice = TestBed.get(FmService);
      });
  }));

  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(userservice, 'getProfileInd').and.returnValue(
      Observable.of({ auth_ind: 'Y' })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.of(memberData)
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute ngOnInit1', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(userservice, 'getProfileInd').and.returnValue(
      Observable.of({ auth_ind: 'Y' })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.of(memberData1)
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute ngOnInit else', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(userservice, 'getProfileInd').and.returnValue(
      Observable.of({ auth_ind: 'Y' })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.of(memberData2)
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute ngOnInit error', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(userservice, 'getProfileInd').and.returnValue(
      Observable.of({ auth_ind: 'Y' })
    );
    spy = spyOn(component.manager, 'getMembers').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should execute initRemoveAction', () => {
    component.manager.members = [{ profileId: 1 }, { profileId: 2 }];
    component.initRemoveAction('124');
    expect(component.manager.removeModalState).toBe(true);
  });
  it('should execute continueRemoveAction code=WAG_I_FA_1058', () => {
    spy = spyOn(component.manager, 'removeMember').and.returnValue(
      Observable.of(message_data)
    );
    component.manager.members = [{ profileId: 1 }, { profileId: 2 }];
    component.manager.removingMember = 'test';
    component.continueRemoveAction();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute continueRemoveAction else', () => {
    spy = spyOn(component.manager, 'removeMember').and.returnValue(
      Observable.of(message_data1)
    );
    component.manager.removingMember = 'test';
    component.continueRemoveAction();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute continueRemoveAction else', () => {
    spy = spyOn(component.manager, 'removeMember').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.manager.removingMember = 'test';
    component.continueRemoveAction();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute getInsuranceInfo', () => {
    fmservice.members = [{ profileId: '1' }];
    fmservice.homeMessage = 'test';
    component.userId = '1';
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(fmservice, 'enrolmentList').and.returnValue(
      Observable.of(insuranceData)
    );
    spy = spyOn(fmservice, 'getAdminInsuranceInfo').and.returnValue(
      Observable.of({ msEnrollInsuranceBeanForm: { msInsStatusCd: 'test' } })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.of(memberData)
    );
    component.getInsuranceInfo();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute getInsuranceInfo error', () => {
    fmservice.members = [{ profileId: '1' }];
    fmservice.homeMessage = 'test';
    component.userId = '1';
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(fmservice, 'enrolmentList').and.returnValue(
      Observable.of(insuranceData)
    );
    spy = spyOn(fmservice, 'getAdminInsuranceInfo').and.returnValue(
      Observable.of({ msEnrollInsuranceBeanForm: { msInsStatusCd: 'test' } })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getInsuranceInfo();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute accountSettingsAction', () => {
    spyOn(common, 'navigate').and.stub();
    spyOn(router, 'navigateByUrl').and.stub();
    const event = { target: 'test' };
    component.accountSettingsAction(event);
  });
  it('should execute accountSettingsAction with family-management', () => {
    spyOn(common, 'navigate').and.stub();
    spyOn(router, 'navigateByUrl').and.stub();
    const event = { target: { value: 'family-management' } };
    component.accountSettingsAction(event);
  });
  it('should execute accountSettingsAction else', () => {
    spyOn(common, 'navigate').and.stub();
    spyOn(router, 'navigateByUrl').and.stub();
    const event = { target: { value: 'test' } };
    component.accountSettingsAction(event);
  });
  it('should execute filterForEnroll with enroll', () => {
    component.manager.members = [{ enroll: 4 }];
    component.filterForEnroll();
  });
  it('should execute filterForEnroll', () => {
    component.filterForEnroll();
  });
  it('should execute redirectToEnroll', () => {
    component.redirectToEnroll();
  });
  it('should execute redirectToEnroll', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.selectedForEnroll = 'test';
    component.redirectToEnroll();
  });
  it('should execute updateSelectForHd with value', () => {
    const event = { target: { value: 1 } };
    component.updateSelectForHd(event);
  });
  it('should execute updateSelectForHd', () => {
    const event = { target: { value: '' } };
    component.updateSelectForHd(event);
  });
  it('should execute redirectToAddAdult', () => {
    spy = spyOn(router, 'navigateByUrl').and.stub();
    component.redirectToAddAdult();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute redirectToAddChild', () => {
    spy = spyOn(router, 'navigateByUrl').and.stub();
    component.redirectToAddChild();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute editViewHdInfo', () => {
    spy = spyOn(router, 'navigateByUrl').and.stub();
    component.editViewHdInfo(1);
    expect(spy).toHaveBeenCalled();
  });
  it('should execute updateHdModelState', () => {
    component.updateHdModelState(1);
  });
  it('should execute updateACModelState', () => {
    component.updateACModelState(1);
  });
  it('should execute openAccountInviteBox', () => {
    component.openAccountInviteBox(message_data2, '1');
  });
  it('should execute updateAccountStatusOverlay', () => {
    component.updateAccountStatusOverlay(1);
  });
  it('should execute inviteAction', () => {
    component.manager.members = [{ profileId: '1' }];
    spy = spyOn(httpservice, 'deleteData').and.returnValue(
      Observable.of('test')
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('1', '1', '1', ' 1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction error', () => {
    spy = spyOn(httpservice, 'deleteData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('1', '1', '1', ' 1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend', () => {
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of(message_data2)
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend with  member', () => {
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of(memberData)
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend with code=WAG_I_FA_1061', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of(message_data3)
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.of(memberData)
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend with code=WAG_I_FA_1061 error', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of(message_data3)
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend with code=WAG_I_FA_1057', () => {
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of({ messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1057' }] })
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend with code=WAG_I_FA_1003', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of({ messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1003' }] })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.of(memberData)
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend with code=WAG_I_FA_1003 error', () => {
    spyOn(component, 'openAccountInviteBox').and.stub();
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.of({ messages: [{ message: 'success', type: 'INFO', code: 'WAG_I_FA_1003' }] })
    );
    spy = spyOn(fmservice, 'getMembers').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction resend error', () => {
    spy = spyOn(httpservice, 'putData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('resend', '1', ' 1', '1', '1');
    expect(spy).toHaveBeenCalled();
  });
  it('should execute inviteAction for cancel', () => {
    component.manager.members = [{ profileId: '1' }];
    component.accountStatusCheckFor = message_data2;
    component.inviteAction('cancel', '1', ' 1', '1', '1');
  });
  it('should execute canResendInvite', () => {
    component.canResendInvite('1', '1');
  });
  it('should execute redirectToLogin', () => {
    spyOn(common, 'navigate').and.stub();
    component.redirectToLogin();
  });
});