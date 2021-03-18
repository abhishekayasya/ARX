import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsernameSentComponent } from './username-sent.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';

describe('UsernameSentComponent', () => {
  let component: UsernameSentComponent;
  let fixture: ComponentFixture<UsernameSentComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsernameSentComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UsernameSentComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
  });
});
