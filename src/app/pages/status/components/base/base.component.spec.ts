import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { StatusBaseComponent } from './base.component';
import { ArxUser } from '@app/models';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
describe('Status-BaseComponent', () => {
  let component: StatusBaseComponent;
  let fixture: ComponentFixture<StatusBaseComponent>;
  let userService: UserService;
  let httpService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusBaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        httpService = TestBed.get(HttpClientService);
        userService.user = new ArxUser('11948190939');
        fixture = TestBed.createComponent(StatusBaseComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    spyOn(component, 'retreiveOrders').and.stub();
    component.ngOnInit();
  });
  it('should execute retreiveOrders Action Needed', () => {
    spyOn(component, 'loadRefillDueTiles').and.stub();
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of([{ header: 'Action Needed', prescriptions: [{ messages: [{ code: 'WAG_E_RX_TRACKER_007' }] }] }])
    );
    component.retreiveOrders();
  });
  it('should execute retreiveOrders Delayed - No Action Needed', () => {
    spyOn(component, 'loadRefillDueTiles').and.stub();
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of([{ header: 'Delayed - No Action Needed', prescriptions: [{ messages: [{ code: 'WAG_E_RX_TRACKER_007' }] }] }])
    );
    component.retreiveOrders();
  });
  it('should execute retreiveOrders In Progress', () => {
    spyOn(component, 'loadRefillDueTiles').and.stub();
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of([{ header: 'In Progress', prescriptions: [{ messages: [{ code: 'WAG_E_RX_TRACKER_007' }] }] }])
    );
    component.retreiveOrders();
  });
  it('should execute retreiveOrders Shipped', () => {
    spyOn(component, 'loadRefillDueTiles').and.stub();
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of([{ header: 'Shipped', prescriptions: [{ messages: [{ code: 'WAG_E_RX_TRACKER_007' }] }] }])
    );
    component.retreiveOrders();
  });
  it('should execute retreiveOrders error', () => {
    spyOn(component, 'loadRefillDueTiles').and.stub();
    spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.retreiveOrders();
  });
  it('should execute updateMember', () => {
    component.updateMember('123');
  });
  it('should execute loadRefillDueTiles', () => {
    component.loadRefillDueTiles(false);
  });
  it('should execute loadRefillDueTiles else', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ prescriptions: [{ statusPrice: { status: 'Refill due' } }] })
    );
    component.refillDueList = [{
      orderStatus: 'RefillDue',
      header: 'Attention Needed',
      orderType: 'test',
      prescriptions: [{ prescriptionId: 1 }]
    }];
    component.loadRefillDueTiles(false);
  });
  it('should execute loadRefillDueTiles error', () => {
    spyOn(httpService, 'postData').and.returnValue(Observable.throw({ status: 500 }));
    component.refillDueList = [{
      orderStatus: 'RefillDue',
      header: 'Attention Needed',
      orderType: 'test',
      prescriptions: [{ prescriptionId: 1 }]
    }];
    component.loadRefillDueTiles(false);
  });
  it('should execute handlePrescriptionsSearchError', () => {
    component.refillDueList = [1, 2, 3];
    component.handlePrescriptionsSearchError();
  });
  it('should execute SpecialtyToll', () => {
    component.SpecialtyToll();
  });
  it('should execute HomeToll', () => {
    component.HomeToll();
  });
  it('should execute CallRefillAction', () => {
    component.CallRefillAction();
  });
});
