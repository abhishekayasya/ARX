import { Observable } from 'rxjs/Observable';
import { HttpClientService } from '@app/core/services/http.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrugSearchComponent } from './drug-search.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';

describe('DrugSearchComponent', () => {
  let component: DrugSearchComponent;
  let fixture: ComponentFixture<DrugSearchComponent>;
  let httpservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DrugSearchComponent);
        component = fixture.componentInstance;
        httpservice = TestBed.get(HttpClientService);
      });
  }));
  it('should create ', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute getDrugs with drugContents', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.of({ drugContents: [{ isChecked: true }] })
    );
    component.getDrugs();
  });
  it('should execute getDrugs', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.of({ messages: [{ message: 'test' }] })
    );
    component.getDrugs();
  });
  it('should execute getDrugs  error', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getDrugs();
  });
  it('should execute getDrugs else with drugContents', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of({ drugContents: [{ isChecked: true }] })
    );
    component.getDrugs();
  });
  it('should execute getDrugs else', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of({ responseMessage: { message: { message: 'test' } } })
    );
    component.getDrugs();
  });
  it('should execute getDrugs else error', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getDrugs();
  });
  it('should execute selectSuggestion', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    component.selectSuggestion({ drugName: 'test' });
  });
  it('should execute changeDrugSelection', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.changeDrugSelection(ev, drug, 0, false);
  });
  it('should execute expandSubitems', () => {
    fixture.detectChanges();
    component.searchQuery.setValue('test');
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.expandSubitems(ev, drug, 0);
  });
  it('should execute selectDrug with drugContents', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.of({ drugContents: [{ subCategory: [{ isChecked: true }] }] })
    );
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug with code=WAG_E_HEALTH_HISTORY_DOSAGE_SEARCH_001', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_E_HEALTH_HISTORY_DOSAGE_SEARCH_001' }]
      })
    );
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug with message', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.of({
        messages: [{ message: 'test' }]
      })
    );
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug error', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.type = 'Medications';
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug else with drugContents', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of({ drugContents: [{ subCategory: [{ isChecked: true }] }] })
    );
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug else with code=WAG_E_HEALTH_HISTORY_DOSAGE_SEARCH_001', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of({
        responseMessage: {
          message: { code: 'WAG_E_HEALTH_HISTORY_DOSAGE_SEARCH_001' }
        }
      })
    );
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug else with code=WAG_E_HEALTH_HISTORY_SEARCH_015', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of({
        responseMessage: {
          message: { code: 'WAG_E_HEALTH_HISTORY_SEARCH_015' }
        }
      })
    );
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug else with message', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of({
        responseMessage: { message: { message: 'test' } }
      })
    );
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute selectDrug else error', () => {
    fixture.detectChanges();
    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    const drug = {
      drugName: 'test',
      showSubItems: 'test',
      drugId: 1,
      subCategory: 'test'
    };
    component.selectDrug(ev, drug, 0, false);
  });
  it('should execute onSubmit', () => {
    component.onSubmit();
  });
  it('should execute removeDrug', () => {
    component.removeDrug(1, 1);
  });
  xit('should execute closeDropdown', () => {
    const event = { target: 'test' };
    component.closeDropdown(event);
  });
  it('should execute setIsCheckedFalse', () => {
    component.setIsCheckedFalse(1);
  });
  it('should execute getId', () => {
    // const event = { target: { value: 'test' } };
    component.getId({ allergyCode: 'test', drugId: 'test' });
  });
});
