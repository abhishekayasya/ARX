import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthComponent } from './health.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../test/mocks/userService.mocks';
import { Observable } from 'rxjs/Observable';
describe('HealthComponent', () => {
  let component: HealthComponent;
  let fixture: ComponentFixture<HealthComponent>;
  let userService;
  let httpService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        httpService = TestBed.get(HttpClientService);
        userService.user = new ArxUser('11948190939');
        userService.user.profile = jsonUsr;
        fixture = TestBed.createComponent(HealthComponent);
        component = fixture.componentInstance;
        sessionStorage.setItem('insurance_enroll_flow', JSON.parse('true'));
      });
  }));
  it('should create ', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute fetchHealthHistory', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { message: 'test' } })
    );
    component.fetchHealthHistory();
  });
  it('should execute fetchHealthHistory else', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ messages: { message: 'test' } })
    );
    component.fetchHealthHistory();
  });
  it('should execute fetchHealthHistory else with healthinfo', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({
        healthInfo: {
          additionalMeds: [1, 2, 3],
          healthConditions: [1, 2, 3],
          drugAllergies: [1, 2, 3]
        }
      })
    );
    component.fetchHealthHistory();
  });
  it('should execute fetchHealthHistory error', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.fetchHealthHistory();
  });
  it('should call closeAllergies', () => {
    component.closeAllergies('test');
  });
  it('should call updateAllergies', () => {
    component.updateAllergies(['test']);
  });
  it('should call closeConditions', () => {
    component.closeConditions('test');
  });
  it('should call updateConditions', () => {
    component.updateConditions(['test']);
  });
  it('should call closeMedications', () => {
    component.closeMedications('test');
  });
  it('should call updateMedications', () => {
    component.updateMedications(['test']);
  });
  it('should execute submitHealthData', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_I_HEALTH_HISTORY_SUBMIT_010' } })
    );
    component.submitHealthData('test', [1, 2, 3]);
  });
  it('should execute submitHealthData', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { message: 'test' } })
    );
    component.submitHealthData('test', [1, 2, 3]);
  });
  it('should execute submitHealthData', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.submitHealthData('test', [1, 2, 3]);
  });
  it('should execute updateValuesLocally type=Medications', () => {
    const drug = [
      {
        drugName: 'test',
        showSubItems: 'test',
        drugId: 1,
        allergyCode: 'test'
      }
    ];
    component.updateValuesLocally('Medications', drug);
  });
  it('should execute updateValuesLocally type=Health Conditions', () => {
    const drug = [
      {
        drugName: 'test',
        showSubItems: 'test',
        drugId: 1,
        allergyCode: 'test'
      }
    ];
    component.updateValuesLocally('Health Conditions', drug);
  });
  it('should execute updateValuesLocally type=Drug Allergies', () => {
    const drug = [
      {
        drugName: 'test',
        showSubItems: 'test',
        drugId: 1,
        allergyCode: 'test'
      }
    ];
    component.updateValuesLocally('Drug Allergies', drug);
  });
  it('should execute deleteHealthItem type=Medications', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_I_HEALTH_HISTORY_DELETE_006' } })
    );
    component.history.additionalMeds = [1, 2, 3];
    component.deleteHealthItem('test', 'Medications', 1, 'test');
  });
  it('should execute deleteHealthItem type=Drug Allergies', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_I_HEALTH_HISTORY_DELETE_006' } })
    );
    component.history.drugAllergies = [{ allergyCode: 'test' }];
    component.deleteHealthItem('test', 'Drug Allergies', 1, 'test');
  });
  it('should execute deleteHealthItem type=Drug Allergies', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_I_HEALTH_HISTORY_DELETE_006' } })
    );
    component.history.drugAllergies = [{ drugId: 'test' }];
    component.deleteHealthItem('test', 'Drug Allergies', 1, 'test');
  });
  it('should execute deleteHealthItem type=Health Conditions', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_I_HEALTH_HISTORY_DELETE_006' } })
    );
    component.history.healthConditions = [1, 2, 3];
    component.deleteHealthItem('test', 'Health Conditions', 1, 'test');
  });
  it('should execute deleteHealthItem type=Medications', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_E_HEALTH_HISTORY_DELETE_013' } })
    );
    component.history.additionalMeds = [1, 2, 3];
    component.deleteHealthItem('test', 'Medications', 1, 'test');
  });
  it('should execute deleteHealthItem type=Medications', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.of({ message: { message: 'test' } })
    );
    component.history.additionalMeds = [1, 2, 3];
    component.deleteHealthItem('test', 'Medications', 1, 'test');
  });
  it('should execute deleteHealthItem error', () => {
    spyOn(httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.history.additionalMeds = [1, 2, 3];
    component.deleteHealthItem('test', 'Medications', 1, 'test');
  });
  it('should execute updateMember', () => {
    component.updateMember(1);
  });
  it('should execute onUpdateClick', () => {
    component.onUpdateClick();
  });
});
