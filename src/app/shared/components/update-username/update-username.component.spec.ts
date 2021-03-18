import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonUtil } from "@app/core/services/common-util.service";
import { HttpClientService } from "@app/core/services/http.service";
import { MessageService } from "@app/core/services/message.service";
import { AppTestingModule } from "../../../../../tests/app.testing.module";
import { UpdateUsernameComponent } from "./update-username.component";

describe("UpdateUsernameComponent", () => {
  let component: UpdateUsernameComponent;
  let _commonUtil: CommonUtil;
  let _messageService: MessageService;
  let fixture: ComponentFixture<UpdateUsernameComponent>;
  let _httpService: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [AppTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUsernameComponent);
    _commonUtil = TestBed.get(CommonUtil);
    _httpService = TestBed.get(HttpClientService);
    _messageService = TestBed.get(MessageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call - postUserNameSuccess", () => {
    spyOn(_commonUtil, "navigate").and.stub();
    component.postUserNameSuccess();
    expect(component).toBeTruthy();
  });

  it("should call - validUserName", () => {
    spyOn(_messageService, "addMessage").and.stub();
    component.validUserName();
    expect(component).toBeTruthy();
  });

  it("should call - validUserName", () => {
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { messages: [{ code: "WAG_I_PROFILE_2084" }] };
        }
      })
    );
    component.updateUserNameForm.setValue({ username: "abc@abc.com" });
    component.validUserName();
    expect(component).toBeTruthy();
  });

  it("should call - validUserName", () => {
    spyOn(_messageService, "addMessage").and.stub();
    spyOn(_httpService, "doPost").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { messages: [{ code: "WAG_I_PROFILE_2085" }] };
        }
      })
    );
    component.updateUserNameForm.setValue({ username: "abc@abc.com" });
    component.validUserName();
    expect(component).toBeTruthy();
  });
});
