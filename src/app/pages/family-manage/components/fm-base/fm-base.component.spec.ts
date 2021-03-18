import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { FmBaseComponent } from './fm-base.component';

describe('FmBaseComponent', () => {
  let component: FmBaseComponent;
  let fixture: ComponentFixture<FmBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FmBaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FmBaseComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create ngOnInit', () => {
    expect(component).toBeTruthy();
  });
});
