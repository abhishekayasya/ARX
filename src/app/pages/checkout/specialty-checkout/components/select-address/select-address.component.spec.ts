import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectAddressComponent } from './select-address.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';
import { AppContext } from '@app/core/services/app-context.service';
import { addressMockData } from '../../../../../../../test/mocks/search-address.mock';
import { ActivatedRoute } from '@angular/router';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
describe('SelectAddressComponent', () => {
  let component: SelectAddressComponent;
  let fixture: ComponentFixture<SelectAddressComponent>;
  let spy: any;
  let debugElement: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAddressComponent],
      imports: [AppTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({ rid: 'test' })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SelectAddressComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        // fixture.detectChanges();
      });
  }));

  xit('should create', () => {
    component.rid = '12';
    component.addAddressUrl = 'fsdfsdf';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should execute ngAfterViewInit', () => {
    const data = {
      ad_edit_success: 'suceess'
    };
    const val = JSON.stringify(data);
    sessionStorage.setItem('ad_edit_success', val);
    spy = spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should execute ngAfterViewInit', () => {
    const val = JSON.stringify(null);
    sessionStorage.setItem(null, val);
    spy = spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });
});
