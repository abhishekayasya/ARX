import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import { ArxUser } from '@app/models';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _messageService: MessageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        notificationService = TestBed.get(NotificationService);
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        _messageService = TestBed.get(MessageService);
      });
  }));
  it('Check NotificationService instance is available', () => {
    expect(notificationService).toBeTruthy();
  });

  it('Should call - fetchInboxMessages', () => {
    spyOn(notificationService, 'getActiveId').and.returnValue('1234');
    notificationService.fetchInboxMessages('');
    expect(notificationService).toBeTruthy();
  });

  it('Should call - fetchMessageContent', () => {
    notificationService.fetchMessageContent('', true);
    expect(notificationService).toBeTruthy();
  });

  it('Should call - deleteMessage', () => {
    notificationService.deleteMessage({});
    expect(notificationService).toBeTruthy();
  });

  it('Should call - getActiveId', () => {
    _userService.user = new ArxUser('11948190939');
    notificationService.getActiveId();
    expect(notificationService).toBeTruthy();
  });

  it('Should call - refreshMessages', () => {
    _userService.user = new ArxUser('11948190939');
    notificationService.refreshMessages();
    expect(notificationService).toBeTruthy();
  });

  it('Should call - updateUnreadCount', () => {
    _userService.user = new ArxUser('11948190939');
    notificationService.updateUnreadCount();
    expect(notificationService).toBeTruthy();
  });
});
