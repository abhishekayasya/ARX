import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { MemberAuthComponent } from './member-auth.component';
import { HttpClientService } from '@app/core/services/http.service';
import { ChildService } from '../../child/child.service';
import { u_info } from '../../../../../../test/mocks/userService.mocks';
const jsonData = {
  message: {
    errors: ['error']
  }
};
const resData = {
  status: 'OK',
  content: {
    authTypes: ['IVR'],
    ivrKeyCode: 123
  }
};
const resData1 = {
  status: 'OK',
  content: {
    ivrKeyCode: 123
  }
};
const resData2 = {
  status: 'OK',
  content: {
    authTypes: ['KBA'],
    ivrKeyCode: 123
  }
};
const resData3 = {
  status: 'OK',
  content: {
    authTypes: ['TXT'],
    ivrKeyCode: 123
  }
};
const message_data = {
  messages: [{ message: 'success', type: 'INFO' }]
};
describe('MemberAuthComponent', () => {
  let component: MemberAuthComponent;
  let fixture: ComponentFixture<MemberAuthComponent>;
  let childservice;
  let httpService;
  let adultservice;
  let router;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberAuthComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MemberAuthComponent);
        component = fixture.componentInstance;
        childservice = TestBed.get(ChildService);
        httpService = TestBed.get(HttpClientService);
        router = TestBed.get(Router);
        adultservice = TestBed.get(AdultService);
        localStorage.setItem('u_info', JSON.stringify(u_info));
      });
  }));
  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute prepareAuthOptions with message', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of(JSON.stringify(jsonData))
    );
    component.prepareAuthOptions();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute prepareAuthOptions with status && IVR', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(Observable.of(resData));
    component.prepareAuthOptions();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute prepareAuthOptions with status && KBA', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of(resData2)
    );
    component.prepareAuthOptions();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute prepareAuthOptions with status && TXT', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of(resData3)
    );
    component.prepareAuthOptions();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute prepareAuthOptions else', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of(resData1)
    );
    component.prepareAuthOptions();
    expect(spy).toHaveBeenCalled();
  });
  it('should create prepareAuthOptions  error', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.prepareAuthOptions();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute loadPhoneInfo', () => {
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ activeSMSCode: 1234 })
    );
    component.loadPhoneInfo();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute compoleteVerification for IVR', () => {
    component.options_selected = 'IVR';
    component.compoleteVerification('test');
  });
  it('should execute compoleteVerification for KBA', () => {
    component.options_selected = 'KBA';
    component.compoleteVerification('test');
  });
  it('should execute onSelection for IVR', () => {
    component.options_selected = 'IVR';
    component.onSelection();
    expect(component.auth_options_state).toBe(true);
  });
  it('should execute onSelection for KBA', () => {
    component.options_selected = 'KBA';
    component.onSelection();
    expect(component.auth_options_state).toBe(true);
  });
  it('should execute getQuestionsSet for errorMessageId', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of({ errorMessageId: 1234 })
    );
    component.getQuestionsSet();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute getQuestionsSet for messageId', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of({ messageId: 1234 })
    );
    component.getQuestionsSet();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute getQuestionsSet for quizChoiceValidationErrorMessage', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of({ quizChoiceValidationErrorMessage: 'test' })
    );
    component.getQuestionsSet();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute getQuestionsSet else', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of({ message: 'test' })
    );
    component.getQuestionsSet();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute collectAnswer', () => {
    const event = {
      target: {
        name: 'test',
        value: 1
      }
    };
    component.collectAnswer(event);
  });
  it('should execute processKBASubmission with quizChoiceValidationError', () => {
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ quizChoiceValidationError: 'test' })
    );
    component.processKBASubmission();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute processKBASubmission with errorMessageId && messageId', () => {
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ errorMessageId: 1, messageId: 1 })
    );
    component.processKBASubmission();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute processKBASubmission with  messageId', () => {
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ messageId: 1 })
    );
    component.processKBASubmission();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute processKBASubmission with  quizChoiceValidationErrorMessage ', () => {
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ quizChoiceValidationErrorMessage: 'test' })
    );
    component.processKBASubmission();
    expect(spy).toHaveBeenCalled();
  });
  it('should create processKBASubmission  error', () => {
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.processKBASubmission();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute submitIVRProcess with message', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.of(message_data)
    );
    component.submitIVRProcess();
    expect(spy).toHaveBeenCalled();
  });
  it('should execute submitIVRProcess else', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'getData').and.returnValue(Observable.of('test'));
    component.submitIVRProcess();
    expect(spy).toHaveBeenCalled();
  });
  it('should create submitIVRProcess  error', () => {
    spy = spyOn(httpService, 'getData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.submitIVRProcess();
    expect(spy).toHaveBeenCalled();
  });
});
