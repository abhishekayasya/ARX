import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CleansedPatientComponent } from './cleansed-patient.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';

const cardData = {
  creditCards: [
    {
      firstName: 'test',
      middleName: '',
      lastName: 'test',
      ccTokenNumber: 'test',
      subfid9B: 'test',
      expiryMonth: '05',
      expiryYear: '2020',
      creditCardType: 'xyz',
      default: 'true',
      active: true,
      isSelected: true,
      rxType: 'SPECIALTY',
      paymentMethodId: '',
      deliveryInfo: {
        zip: '600060',
        city: 'chennai',
        street1: 'street',
        street2: 'street',
        state: 'tamil'
      }
    }
  ]
};
describe('CleansedPatientComponent- Speciality', () => {
  let component: CleansedPatientComponent;
  let fixture: ComponentFixture<CleansedPatientComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CleansedPatientComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CleansedPatientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
  });
  it('should execute countSelected for undefined value', () => {
    const data = { creditCards: undefined };
    component.countSelected(data);
  });
  it('should execute countSelected', () => {
    component.countSelected(cardData);
  });
  it('should execute showDonotWantOption', () => {
    component.showDonotWantOption(0);
  });
});
