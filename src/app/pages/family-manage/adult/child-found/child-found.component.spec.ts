import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AdultChildFoundComponent } from './child-found.component';

describe('AdultChildFoundComponent', () => {
  let component: AdultChildFoundComponent;
  let fixture: ComponentFixture<AdultChildFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdultChildFoundComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdultChildFoundComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create ngOnInit', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });
  it('should create gotoChild', () => {
    component.gotoChild();
  });
});
