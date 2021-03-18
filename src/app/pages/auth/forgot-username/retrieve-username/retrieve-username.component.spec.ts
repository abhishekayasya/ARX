import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrieveUsernameComponent } from './retrieve-username.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

describe('RetrieveUsernameComponent', () => {
  let component: RetrieveUsernameComponent;
  let fixture: ComponentFixture<RetrieveUsernameComponent>;
  let _httpService: HttpClientService;
  let _routerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetrieveUsernameComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RetrieveUsernameComponent);
         _httpService = TestBed.get(HttpClientService);
         _routerService = TestBed.get(Router);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
  });
  it('should execute retrieveUsername', () => {
    component.retrieveUsername();
  });

  it('should execute retrieveUsername', () => {
    component.forgotUsernameForm.setValue({ username: "abc"});
    spyOn(_httpService, "postData").and.returnValue(
      Observable.of({
        messages: [
          { code: "WAG_I_PROFILE_2031", message: "success", type: "INFO" }
        ]
      })
      
    );
    spyOn(_routerService, "navigateByUrl").and.stub();
    component.retrieveUsername();
  });

  it('should execute retrieveUsername error', () => {
    component.forgotUsernameForm.setValue({ username: "abc"});
    spyOn(_httpService, "postData").and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    spyOn(_routerService, "navigateByUrl").and.stub();
    component.retrieveUsername();
  });

});
