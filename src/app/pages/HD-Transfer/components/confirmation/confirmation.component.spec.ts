import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { TransferConfirmationComponent } from './confirmation.component';
import { AppContext } from '@app/core/services/app-context.service';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { u_info } from '../../../../../../test/mocks/userService.mocks';
const mockData = [
  {
    path: 'confirmation-pca'
  }
];

describe('TransferConfirmationComponent', () => {
  let component: TransferConfirmationComponent;
  let fixture: ComponentFixture<TransferConfirmationComponent>;
  let debugElement: DebugElement;
  let appContext: AppContext;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferConfirmationComponent],
      // tslint:disable-next-line: deprecation
      imports: [
        SharedModule,
        RouterModule.forRoot([]),
        HttpClientModule,
        // tslint:disable-next-line: deprecation
        HttpModule
      ],
      providers: [
        AppContext,
        HttpClientService,
        UserService,
        CommonUtil,
        DatePipe,
        CheckoutService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { routeConfig: { path: 'confirmation-pca' } } }
        },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferConfirmationComponent);
    component = fixture.componentInstance;
    appContext = TestBed.get(AppContext);
    debugElement = fixture.debugElement;
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    localStorage.setItem('u_info', JSON.stringify(u_info));
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should call print', () => {
    spyOn(window, 'open').and.stub();
    spyOn(document, 'getElementById').and.stub();
    component.print();
  });
  it('should call ngOnInit', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.ngOnInit();
  });
  it('should call ngOnInit pcaConfirmationdata', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.pca_flow = true;
    sessionStorage.setItem(
      'pcaConfirmationdata',
      JSON.stringify({
        patient: { patientEmail: 'abc@yopmail.com' },
        prescriptions: [1, 2],
        pharmacy: 'test'
      })
    );
    component.ngOnInit();
  });
  it('should call ngOnInit hd_transfer_rxlist', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.pca_flow = true;
    sessionStorage.setItem(
      'hd_transfer_rxlist',
      JSON.stringify({
        patient: { patientEmail: 'abc@yopmail.com' },
        prescriptions: [1, 2],
        pharmacy: 'test'
      })
    );
    component.ngOnInit();
  });
  it('should call ngOnInit hd_transfer_rxlistconf', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.pca_flow = true;
    sessionStorage.setItem(
      'hd_transfer_rxlistconf',
      JSON.stringify({
        patient: { patientEmail: 'abc@yopmail.com' },
        prescriptions: [1, 2],
        pharmacy: 'test'
      })
    );
    component.ngOnInit();
  });
});
