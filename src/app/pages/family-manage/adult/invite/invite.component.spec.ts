import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AdultInviteComponent } from './invite.component';
import { HttpClientService } from '@app/core/services/http.service';
import { ChildService } from '../../child/child.service';

describe('AdultInviteComponent', () => {
  let component: AdultInviteComponent;
  let fixture: ComponentFixture<AdultInviteComponent>;
  let childservice;
  let httpService;
  let adultservice;
  let router;
  let spy;
  const formData = {
    email: 'test@gmail.com'
  };
  const message_data = {
    messages: [{ code: 'WAG_I_FA_1009', message: 'success', type: 'INFO' }]
  };
  const message_data1 = {
    messages: [
      { code: 'WAG_E_SEARCH_MEMBER_1002', message: 'success', type: 'INFO' }
    ]
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdultInviteComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdultInviteComponent);
        component = fixture.componentInstance;
        childservice = TestBed.get(ChildService);
        httpService = TestBed.get(HttpClientService);
        router = TestBed.get(Router);
        adultservice = TestBed.get(AdultService);
      });
  }));
  it('should create component', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    adultservice.email_exit = 'new';
    component.ngOnInit();
  });
  it('should execute ngOnInit', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.ngOnInit();
  });
  it('should execute sendInviteToMember for valid', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.newEmailForm.setValue(formData);
    component.email_option = 'new';
    component.sendInviteToMember();
  });
  it('should execute sendInviteToMember for invalid', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.email_option = 'new';
    component.sendInviteToMember();
  });
  it('should create sendInviteToMember code=WAG_I_FA_1009', () => {
    component.newEmailForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'putData').and.returnValue(
      Observable.of(message_data)
    );
    component.sendInviteToMember();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInviteToMember else', () => {
    component.newEmailForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'putData').and.returnValue(
      Observable.of(message_data1)
    );
    component.sendInviteToMember();
    expect(spy).toHaveBeenCalled();
  });
  it('should create sendInfoSearchRequest for error', () => {
    component.newEmailForm.setValue(formData);
    spyOn(router, 'navigateByUrl').and.stub();
    spy = spyOn(httpService, 'putData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.sendInviteToMember();
    expect(spy).toHaveBeenCalled();
  });
});
