import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AddChildFormComponent } from './add-child-form.component';
import { ChildService } from './../child.service';
import { HttpClientService } from '@app/core/services/http.service';

const validformData = {
  firstName: 'xxx',
  lastName: 'xxx',
  dateOfBirth: '01/10/2000',
  prescriptionNumber: 123
};
const childData = {
  isAcctExists: true,
  firstName: 'xxx',
  lastName: 'xxx',
  dateOfBirth: '01/10/2000',
  prescriptionNumber: 123
};
const message_data = {
  messages: [{ message: 'success', type: 'INFO' }]
};
describe('AddChildFormComponent', () => {
  let component: AddChildFormComponent;
  let fixture: ComponentFixture<AddChildFormComponent>;
  let childservice;
  let httpService;
  let router;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddChildFormComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddChildFormComponent);
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
  it('should create validateChild', () => {
    component.childInfoForm.setValue(validformData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data)
    );
    component.validateChild();
    expect(spy).toHaveBeenCalled();
  });
  it('should create validateChild for else', () => {
    component.childInfoForm.setValue(validformData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(validformData)
    );
    component.validateChild();
    expect(spy).toHaveBeenCalled();
  });
  it('should create validateChild for elseif', () => {
    component.childInfoForm.setValue(validformData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(childData)
    );
    component.validateChild();
    expect(spy).toHaveBeenCalled();
  });
  it('should create validateChild for invalid', () => {
    component.validateChild();
  });
  it('should create validateChild for error', () => {
    component.childInfoForm.setValue(validformData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.validateChild();
    expect(spy).toHaveBeenCalled();
  });
});
