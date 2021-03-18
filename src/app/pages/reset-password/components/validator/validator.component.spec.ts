import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidatorComponent } from './validator.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../../tests/app.testing.module';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { Observable } from 'rxjs/Observable';

xdescribe('ValidatorComponent', () => {
  let component: ValidatorComponent;
  let fixture: ComponentFixture<ValidatorComponent>;
  let resetPasswordService;
  const tokenService = '/profile/csrf-disabled/redirect';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatorComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ResetPasswordService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ValidatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call validateToken', () => {
     component.validateToken();
  });
  it('should call validateToken if case', () => {
      component.token = '';
    component.validateToken();
 });
 it('should call validateToken else case', () => {
    component.token = 'test';
    //spyOn(tokenService, 'postData').and.returnValue(Observable.of('test'));
    component.validateToken();
 });
});
