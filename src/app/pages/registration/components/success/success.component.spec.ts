import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationSuccessComponent } from './success.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;
  let commonservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationSuccessComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegistrationSuccessComponent);
        component = fixture.componentInstance;
        commonservice = TestBed.get(CommonUtil);
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute gaEvent', () => {
    spyOn(component, 'gaEvent').and.callThrough();
    component.gaEvent();
  });
  it('should execute registerDeviceInfo', () => {
    component.registerDeviceInfo();
  });
  it('should execute redirectToBuyout', () => {
    spyOn(commonservice, 'navigate').and.stub();
    component.redirectToBuyout();
  });
  it('should execute redirectToDashBoard', () => {
    spyOn(commonservice, 'navigate').and.stub();
    component.redirectToDashBoard();
  });
});
