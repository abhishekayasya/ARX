import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { InviteChildComponent } from './invite-child.component';
import { HttpClientService } from '@app/core/services/http.service';
import { ChildService } from '../../child/child.service';
import { u_info } from '../../../../../../test/mocks/userService.mocks';

describe('InviteChildComponent', () => {
  let component: InviteChildComponent;
  let fixture: ComponentFixture<InviteChildComponent>;
  let childservice;
  let httpService;
  let adultservice;
  let router;
  const childData = {
    firstName: 'xxx',
    lastName: 'xxx',
    email: 'test@gmail.com'
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InviteChildComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InviteChildComponent);
        component = fixture.componentInstance;
        childservice = TestBed.get(ChildService);
        httpService = TestBed.get(HttpClientService);
        router = TestBed.get(Router);
        adultservice = TestBed.get(AdultService);
        localStorage.setItem('u_info', JSON.stringify(u_info));
        childservice.childDetails = childData;
      });
  }));
  it('should create component', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.childDetails = childservice.childDetails;
    component.ngOnInit();
  });
});
