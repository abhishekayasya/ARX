import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AddAdultFormComponent } from './add-form.component';
import { HttpClientService } from '@app/core/services/http.service';
import { ChildService } from '../../child/child.service';

const validformData = {
  firstName: 'xxx',
  lastName: 'xxx',
  dateOfBirth: '01/10/2000',
  number: 123,
  phoneType: 1234567890
};
const childData = {
  isAcctExists: true,
  firstName: 'xxx',
  lastName: 'xxx',
  dateOfBirth: '01/10/2000',
  number: 123,
  phoneType: 1234567890,
  email: 'test@gmail.com'
};
const message_data = {
  messages: [
    { code: 'WAG_E_SEARCH_MEMBER_1002', message: 'success', type: 'INFO' }
  ]
};
const message_data1 = {
  messages: [
    { code: 'WAG_E_SEARCH_MEMBER_1001', message: 'success', type: 'INFO' }
  ]
};
const message_data2 = {
  messages: [
    { code: 'WAG_E_SEARCH_MEMBER_1003', message: 'success', type: 'INFO' }
  ]
};
const message_data3 = {
  messages: [{ message: 'success', type: 'INFO' }]
};
describe('AddAdultFormComponent', () => {
  let component: AddAdultFormComponent;
  let fixture: ComponentFixture<AddAdultFormComponent>;
  let childservice;
  let httpService;
  let router;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAdultFormComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddAdultFormComponent);
        component = fixture.componentInstance;
        childservice = TestBed.get(ChildService);
        childservice.childDetails = validformData;
        httpService = TestBed.get(HttpClientService);
        router = TestBed.get(Router);
      });
  }));

  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should create resetForms', () => {
    component.resetForms();
  });
  it('should create sendInfoSearchRequest code=WAG_E_SEARCH_MEMBER_1002', () => {
    component.adultInfoForm.setValue(validformData);
    component.rxNumberForm.setValue({ rxNumber: 123 });
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data)
    );
    component.sendInfoSearchRequest();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest code=WAG_E_SEARCH_MEMBER_1001', () => {
    component.adultInfoForm.setValue(validformData);
    component.rxNumberForm.setValue({ rxNumber: 123 });
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data1)
    );
    component.sendInfoSearchRequest();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest code=WAG_E_SEARCH_MEMBER_1003', () => {
    component.adultInfoForm.setValue(validformData);
    component.rxNumberForm.setValue({ rxNumber: 123 });
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data2)
    );
    component.sendInfoSearchRequest();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest without code', () => {
    component.adultInfoForm.setValue(validformData);
    component.rxNumberForm.setValue({ rxNumber: 123 });
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data3)
    );
    component.sendInfoSearchRequest();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest else', () => {
    component.adultInfoForm.setValue(validformData);
    component.rxNumberForm.setValue({ rxNumber: 123 });
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(childData)
    );
    component.sendInfoSearchRequest();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest for invalid', () => {
    component.sendInfoSearchRequest();
  });
  it('should create sendInfoSearchRequest for error', () => {
    component.adultInfoForm.setValue(validformData);
    component.rxNumberForm.setValue({ rxNumber: 123 });
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.sendInfoSearchRequest();
    expect(spy).toHaveBeenCalled();
  });
  it('should create omit_special_char', () => {
    const event = { charCode: 0 };
    component.omit_special_char(event);
  });
});
