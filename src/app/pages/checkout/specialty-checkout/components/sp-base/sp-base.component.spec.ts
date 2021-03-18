import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpBaseComponent } from './sp-base.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';
describe('SpBaseComponent', () => {
  let component: SpBaseComponent;
  let fixture: ComponentFixture<SpBaseComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpBaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SpBaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
