import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NotVerifiedComponent } from './not-verified.component';

describe('NotVerifiedComponent', () => {
  let component: NotVerifiedComponent;
  let fixture: ComponentFixture<NotVerifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotVerifiedComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NotVerifiedComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
