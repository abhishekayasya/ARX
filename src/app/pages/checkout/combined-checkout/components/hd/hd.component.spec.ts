import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HdComponent } from './hd.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';

describe('HdComponent', () => {
  let component: HdComponent;
  let fixture: ComponentFixture<HdComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HdComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HdComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
