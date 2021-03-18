import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ArxLoaderComponent } from '@app/shared/components/loader/loader.component';
import { MessageComponent } from '@app/shared/components/message/message.component';
import { LogoComponent } from '@app/shared/components/logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RegOptionComponent } from '@app/shared/components/reg-option/reg-option.component';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { MessageService } from '@app/core/services/message.service';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@app/core/services/user.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { DebugElement } from '@angular/core';
import { GaService } from '@app/core/services/ga-service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: RegOptionComponent;
  let fixture: ComponentFixture<RegOptionComponent>;
  let _userService: UserService;
  let debugElement: DebugElement;
  let router: Router;
  let _common: CommonUtil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegOptionComponent,
        MessageComponent,
        ArxLoaderComponent,
        LogoComponent,
        HtmlPipe,
        ModalComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        GaService,
        AppContext,
        HttpClientService,
        { provide: APP_BASE_HREF, useValue: '/' },
        CommonUtil,
        CookieService,
        DatePipe,
        UserService,
        CheckoutService
      ]
    })
      .compileComponents()
      .then(() => {
        _common = TestBed.get(CommonUtil);
        router = TestBed.get(Router);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegOptionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    _userService = debugElement.injector.get(UserService);
    spyOn(_userService, 'isSSOSessionActive').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute redirectToRegisteration', () => {
    spyOn(_common, 'navigate').and.stub();
    component.redirectToRegisteration();
  });
  it('should execute selectionProcess', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.selectionProcess('N');
  });
  it('should execute selectionProcess', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.selectionProcess('E');
  });
  it('should execute selectionProcess', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.selectionProcess('');
  });
});
