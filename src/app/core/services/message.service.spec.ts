import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { ArxUser } from '@app/models';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

describe('MessageService', () => {
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
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        _messageService = TestBed.get(MessageService);
      });
  }));
  it('Check MessageService instance is available', () => {
    expect(_messageService).toBeTruthy();
  });

  it('should call - notifyHealthInfo', () => {
    _messageService.notifyHealthInfo('');
    expect(_messageService).toBeTruthy();
  });

  // it('should call - addMessage', () => {
  //   const message = new Message(null, null, null, '', '', '');
  //   _messageService.addMessage(new Message('',''));
  //   expect(_messageService).toBeTruthy();
  // });

  it('should call - removeMessage', () => {
    _messageService.removeMessage(1);
    expect(_messageService).toBeTruthy();
  });

  it('should call - addClearMessageAction', () => {
    _messageService.addClearMessageAction();
    expect(_messageService).toBeTruthy();
  });

  it('should call - clearMessage', () => {
    _messageService.clearMessage();
    expect(_messageService).toBeTruthy();
  });

  it('should call - clear', () => {
    _messageService.clear();
    expect(_messageService).toBeTruthy();
  });
});
