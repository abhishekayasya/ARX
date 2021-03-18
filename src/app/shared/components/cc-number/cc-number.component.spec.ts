import { CommonUtil } from './../../../core/services/common-util.service';
import { UserService } from './../../../core/services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { CcNumberComponent } from './cc-number.component';

describe('CcNumberComponent', () => {
  let component: CcNumberComponent;
  let fixture: ComponentFixture<CcNumberComponent>;
  let userService;
  let common;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CcNumberComponent);
        component = fixture.componentInstance;
        userService = TestBed.get(UserService);
        common = TestBed.get(CommonUtil);
      });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute validate', () => {
    component.validate(null);
  });
  it('should execute writeValue', () => {
    component.writeValue('test');
  });
  it('should execute registerOnChange', () => {
    component.registerOnChange(() => {});
  });
  it('should execute registerOnTouched', () => {
    component.registerOnTouched(() => {});
  });
  it('should execute onChange', () => {
    const event = { target: { value: 'test' } };
    component.onChange(event);
  });
});
