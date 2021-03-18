import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { DebugElement } from '@angular/core';
import { NewPrescriptionConfirmationComponent } from './confirmation.component';
import { NewRxReviewComponent } from '../new-rx-review/new-rx-review.component';
import { AppContext } from '@app/core/services/app-context.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { data1 } from '../../../../../../tests/nrx-response';
import { data } from '../../../../../../tests/nrx-conf-response';
import { nrx } from '../../../../../../tests/nrx-main';
const mockData = [
  {
    path: 'confirmation-pca'
  }
];

describe('NewPrescriptionConfirmationComponent', () => {
  let component: NewPrescriptionConfirmationComponent;
  let fixture: ComponentFixture<NewPrescriptionConfirmationComponent>;
  let debugElement: DebugElement;
  let appContext: AppContext;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPrescriptionConfirmationComponent],
      // tslint:disable-next-line: deprecation
      imports: [SharedModule, RouterModule.forRoot([]), HttpModule],
      providers: [
        AppContext,
        HttpClientService,
        UserService,
        CheckoutService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { routeConfig: { path: mockData } } }
        },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPrescriptionConfirmationComponent);
    component = fixture.componentInstance;
    appContext = TestBed.get(AppContext);
    debugElement = fixture.debugElement;
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchOrderDetails', () => {
    component.pca_flow = true;
    const value = JSON.stringify(data1);
    const value1 = JSON.stringify(data);
    localStorage.setItem(AppContext.CONST.uInfoStorageKey, value);
    sessionStorage.setItem('pcaConfirmationdata', value1);
    fixture.detectChanges();
    spyOn(component, 'fetchOrderDetails').and.callThrough();
    component.fetchOrderDetails();
  });

  it('should call fetchOrderDetails', () => {
    component.pca_flow = true;
    const value = JSON.stringify(nrx);
    component.OrderDetailsData = value;
    sessionStorage.setItem('Nrx', value);
    fixture.detectChanges();
    spyOn(component, 'fetchOrderDetails').and.callThrough();
    component.fetchOrderDetails();
  });

  xit('should call printConfirmation', () => {
    spyOn(component, 'printConfirmation').and.callThrough();
    component.printConfirmation();
  });
});
