import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { DrugInfoComponent } from './drug-info.component';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { masterData, data } from '../../../../../../tests/drug-info';

describe('DrugInfoComponent', () => {
  let component: DrugInfoComponent;
  let fixture: ComponentFixture<DrugInfoComponent>;
  let _httpclientService: HttpClientService;
  let _refillService: RefillBaseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugInfoComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DrugInfoComponent);
        component = fixture.componentInstance;
        component.viewIdObservable = new Observable<any>();
        _httpclientService = TestBed.get(HttpClientService);
        _refillService = TestBed.get(RefillBaseService);
        _refillService.masterData = masterData;
      });
  }));

  it('should create DrugInfoComponent component', () => {
    expect(component).toBeTruthy();
  });

  it('should execute enableServerError function', () => {
    spyOn(component, 'enableServerError').and.callThrough();
    component.enableServerError();
  });

  it('should execute actionYes function', () => {
    component.drugInfo = { drugId: 10 };
    spyOn(window, 'open');

    spyOn(component, 'actionYes').and.callThrough();
    component.actionYes();
    expect(component.actionYes).toHaveBeenCalled();
  });
  it('should execute actionNo function', () => {
    expect(component.wantMoreInfo).toBeFalsy();
    spyOn(component, 'actionNo').and.callThrough();
    spyOn(component, 'callviewIdobservable').and.stub();
    fixture.detectChanges();
    component.actionNo();
    expect(component.actionNo).toHaveBeenCalled();
  });
  it('should execute enableOptions function', () => {
    spyOn(component, 'enableOptions').and.callThrough();
    spyOn(component, 'callviewIdobservable').and.stub();
    fixture.detectChanges();
    component.enableOptions();
    expect(component.enableOptions).toHaveBeenCalled();
  });
  it('should execute prepareDrugInfo function', () => {
    spyOn(component, 'prepareDrugInfo').and.callThrough();
    component.prepareDrugInfo('HISTORY_MULTILINE_VIEW_65938107');
    expect(component.prepareDrugInfo).toHaveBeenCalled();
  });

  it('should execute callviewIdobservable function', async(() => {
    component.viewIdObservable = Observable.of({ viewId: '123' });
    spyOn(component, 'prepareDrugInfo').and.stub();
    spyOn(component, 'callviewIdobservable').and.callThrough();
    component.callviewIdobservable();
    expect(component.callviewIdobservable).toHaveBeenCalled();
  }));

  it('should call gaEvent function', () => {
    spyOn(component, 'gaEvent').and.callThrough();
    component.gaEvent('click');
  });
});
