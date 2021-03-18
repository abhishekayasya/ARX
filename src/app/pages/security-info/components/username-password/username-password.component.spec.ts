import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsernamePasswordComponent } from './username-password.component';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { HttpClientService } from '@app/core/services/http.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';

const noUserExist = { userNameExist: false };
const userExist = { messages: [{ code: 'WAG_W_REG_1009' }] };
const passwordWARNING = {
  messages: [
    {
      code: 'WAG_I_CREDENTIALS_1020',
      message: 'Password validation is success',
      type: 'WARN'
    }
  ]
};
const passwordINFO = {
  messages: [
    {
      code: 'WAG_I_CREDENTIALS_1020',
      message: 'Password validation is success',
      type: 'INFO'
    }
  ]
};
// tslint:disable-next-line: max-line-length
const saveUserandPassword = {
  messages: [
    {
      code: 'WAG_I_UPDATE_PROFILE_1009',
      message: 'Changes to your personal information were successfully saved.',
      type: 'INFO'
    }
  ],
  status: 'success'
};

describe('UsernamePasswordComponent', () => {
  let component: UsernamePasswordComponent;
  let fixture: ComponentFixture<UsernamePasswordComponent>;
  let _http: HttpClientService;
  let _userService: UserService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsernamePasswordComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UsernamePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        _http = TestBed.get(HttpClientService);
        _userService = TestBed.get(UserService);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute - checkEmail', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of(noUserExist));
    spyOn(component, 'checkEmail').and.callThrough();
    component.checkEmail();
    expect(component.checkEmail).toHaveBeenCalled();
  });

  it('should execute - checkEmail else if statement', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of(userExist));
    spyOn(component, 'checkEmail').and.callThrough();
    component.checkEmail();
    expect(component.checkEmail).toHaveBeenCalled();
  });

  it('should execute - checkEmail else statement', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({}));
    spyOn(component, 'checkEmail').and.callThrough();
    component.checkEmail();
    expect(component.checkEmail).toHaveBeenCalled();
  });

  it('should execute - checkEmail error statement', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.throw({ status: 500 }));
    spyOn(component, 'checkEmail').and.callThrough();
    component.checkEmail();
    expect(component.checkEmail).toHaveBeenCalled();
  });

  it('should execute - checkPassword if statement', () => {
    const event = { target: { value: 'test' } };
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    spyOn(_http, 'postData').and.returnValue(Observable.of(passwordWARNING));
    spyOn(component, 'checkPassword').and.callThrough();
    component.checkPassword(event);
    expect(component.checkPassword).toHaveBeenCalled();
  });

  it('should execute - checkPassword response else statement', () => {
    const event = { target: { value: 'test' } };
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    spyOn(_http, 'postData').and.returnValue(Observable.of(passwordINFO));
    spyOn(component, 'checkPassword').and.callThrough();
    component.checkPassword(event);
    expect(component.checkPassword).toHaveBeenCalled();
  });

  it('should execute - checkPassword else statement', () => {
    const event = { target: { value: '' } };
    component.checkPassword(event);
    expect(component).toBeTruthy();
  });

  it('should execute - checkPassword error statement', () => {
    const event = { target: { value: 'test' } };
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    spyOn(_http, 'postData').and.returnValue(Observable.throw({ status: 500 }));
    component.checkPassword(event);
  });

  it('should execute - saveChanges - check userDetailForm password username null values', () => {
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    component.userDetailForm.value.password = '';
    component.userDetailForm.value.username = '';
    spyOn(component, 'saveChanges').and.callThrough();
    component.saveChanges();
    expect(component.saveChanges).toHaveBeenCalled();
  });

  it('should execute - saveChanges - check userDetailForm invalid', () => {
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    component.userDetailForm.value.password = 'test';
    component.userDetailForm.value.username = 'test@yopmail.com';
    spyOn(component, 'saveChanges').and.callThrough();
    component.saveChanges();
    expect(component.saveChanges).toHaveBeenCalled();
  });

  it('should execute - saveChanges - update api call', () => {
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    component.userDetailForm.value.password = 'test';
    spyOn(_http, 'putData').and.returnValue(Observable.of(saveUserandPassword));
    spyOn(component, 'saveChanges').and.callThrough();
    component.saveChanges();
    expect(component.saveChanges).toHaveBeenCalled();
  });

  it('should execute - saveChanges - error statement', () => {
    _userService.user = new ArxUser('5646561');
    _userService.user.profile = jsonUsr;
    component.userDetailForm.value.password = 'test';
    spyOn(_http, 'putData').and.returnValue(Observable.throw({ status: 500 }));
    component.saveChanges();
  });

  it('should execute - displayPassword', () => {
    const event = { target: { checked: true } };
    spyOn(component, 'displayPassword').and.callThrough();
    component.displayPassword(event);
    expect(component.displayPassword).toHaveBeenCalled();
  });

  it('should execute - displayPassword else statement', () => {
    const event = { target: { checked: false } };
    spyOn(component, 'displayPassword').and.callThrough();
    component.displayPassword(event);
    expect(component.displayPassword).toHaveBeenCalled();
  });

  it('should execute - oncheckMailError', () => {
    spyOn(component, 'oncheckMailError').and.callThrough();
    component.oncheckMailError();
    expect(component.oncheckMailError).toHaveBeenCalled();
  });
});
