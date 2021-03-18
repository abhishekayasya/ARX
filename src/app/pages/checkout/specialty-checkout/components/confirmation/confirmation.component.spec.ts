import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialityConfirmOrder } from './confirmation.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';
describe('SpecialityConfirmOrder', () => {
  let component: SpecialityConfirmOrder;
  let fixture: ComponentFixture<SpecialityConfirmOrder>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialityConfirmOrder],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SpecialityConfirmOrder);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
