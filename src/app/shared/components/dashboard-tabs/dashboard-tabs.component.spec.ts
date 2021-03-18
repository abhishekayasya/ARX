import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTabsComponent } from './dashboard-tabs.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';

describe('DashboardTabsComponent', () => {
  let component: DashboardTabsComponent;
  let fixture: ComponentFixture<DashboardTabsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DashboardTabsComponent);
        component = fixture.componentInstance;
      });
  }));
  it('should create ', () => {
    expect(component).toBeTruthy();
  });
  it('should call RefillAction', () => {
    component.RefillAction();
  });
  it('should call StatusAction', () => {
    component.StatusAction();
  });
});
