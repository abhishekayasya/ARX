import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AdultAdditionalInfoComponent } from './additional-info.component';
import { HttpClientService } from '@app/core/services/http.service';
import { ChildService } from '../../child/child.service';

describe('AdultAdditionalInfoComponent', () => {
  let component: AdultAdditionalInfoComponent;
  let fixture: ComponentFixture<AdultAdditionalInfoComponent>;
  let childservice;
  let httpService;
  let router;
  let spy;
  const formData = {
    gender: 'xxx',
    city: 'xxx',
    state: 'xxx',
    zipCode: 123,
    street1: 'xxx',
    aptSuite: 'xxxx'
  };
  const mockData = {
    gender: 'xxx',
    city: 'xxx',
    state: 'xxx',
    zipCode: 123,
    street1: 'xxx',
    aptSuite: 'xxxx',
    email: 'test@gmail.com'
  };
  const message_data = {
    messages: [
      { code: 'WAG_E_SEARCH_MEMBER_1001', message: 'success', type: 'INFO' }
    ]
  };
  const message_data1 = {
    messages: [
      { code: 'WAG_E_SEARCH_MEMBER_1002', message: 'success', type: 'INFO' }
    ]
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdultAdditionalInfoComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdultAdditionalInfoComponent);
        component = fixture.componentInstance;
        childservice = TestBed.get(ChildService);
        httpService = TestBed.get(HttpClientService);
        router = TestBed.get(Router);
      });
  }));
  it('should create component', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute prefillAddressComponents', () => {
    component.additionalInfoForm.setValue(formData);
    component.prefillAddressComponents(formData);
  });
  it('should execute submitDataToSearch for invalid', () => {
    component.submitDataToSearch();
  });
  it('should create submitDataToSearch code=WAG_E_SEARCH_MEMBER_1001', () => {
    component.additionalInfoForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data)
    );
    component.submitDataToSearch();
    expect(spy).toHaveBeenCalled();
  });
  it('should create submitDataToSearch code with else', () => {
    component.additionalInfoForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(message_data1)
    );
    component.submitDataToSearch();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest else', () => {
    component.additionalInfoForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.of(mockData)
    );
    component.submitDataToSearch();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest for error', () => {
    component.additionalInfoForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.submitDataToSearch();
    expect(spy).toHaveBeenCalled();
  });
});
