import { CommonUtil } from './../../services/common-util.service';
import { HttpClientService } from './../../services/http.service';
import { UserService } from './../../services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { Observable } from 'rxjs/Observable';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let userService;
  let httpService;
  let commonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
        userService = TestBed.get(UserService);
        httpService = TestBed.get(HttpClientService);
        commonService = TestBed.get(CommonUtil);
      });
  }));

  it('should create ', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute sendLogoutRequest', () => {
    spyOn(commonService, 'navigate').and.stub();
    spyOn(httpService, 'postData').and.returnValue(Observable.of('test'));
    component.sendLogoutRequest();
  });
  it('should execute sendLogoutRequest error', () => {
    spyOn(commonService, 'navigate').and.stub();
    spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.sendLogoutRequest();
  });
});
