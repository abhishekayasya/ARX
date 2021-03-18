import {
  APP_BASE_HREF,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import 'rxjs/add/observable/of';
import { RetrieveUsernameComponent } from './retrieve-username.component';

describe('RetrieveUsernameComponent', () => {
  let component: RetrieveUsernameComponent;
  let fixture: ComponentFixture<RetrieveUsernameComponent>;
  const _router = { navigate: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetrieveUsernameComponent],
      providers: [
        { provide: CommonUtil, useClass: {} },
        { provide: Router, useValue: _router },
        { provide: HttpClientService, useClass: {} },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RetrieveUsernameComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create', fakeAsync(() => {
    spyOn(_router, 'navigate').and.stub();
    expect(component).toBeTruthy();
  }));
});
