import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboBaseComponent } from './combo-base.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';

describe('ComboBaseComponent', () => {
  let component: ComboBaseComponent;
  let fixture: ComponentFixture<ComboBaseComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComboBaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ComboBaseComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
