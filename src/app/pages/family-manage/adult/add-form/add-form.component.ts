import { Component, OnInit } from '@angular/core';
import { FmService } from '@app/core/services/fm.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateConfigModel } from '@app/models/date-config.model';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { Router } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-fm-adult-add',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddAdultFormComponent implements OnInit {
  adultInfoForm: FormGroup;
  rxNumberForm: FormGroup;

  PHONE_TYPES = ['Cell', 'Home', 'Work'];

  constructor(
    public manager: FmService,
    private _common: CommonUtil,
    public adultService: AdultService,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _http: HttpClientService,
    private _message: MessageService,
    private _router: Router
  ) {
    this.buildInfoForm();
    this.buildRxNumberForm();

    this.manager.disableLoad();
    this._common.removeNaturalBGColor();
  }

  buildInfoForm() {
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;

    this.adultInfoForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ValidateDate(dateConfig)]],
      number: ['', Validators.required],
      phoneType: ['Cell', Validators.required]
    });
  }

  buildRxNumberForm() {
    this.rxNumberForm = this._formBuilder.group({
      rxNumber: ['', Validators.required]
    });
  }

  resetForms() {
    this.adultInfoForm.reset();
    this.rxNumberForm.reset();
    this._message.clear();
  }

  /**
   * submit all information to service and manage search response.
   * in case of search by rx number + no math - displaying error message.
   * in case of search by info + no math - redirecting to additional info page.
   * in case of match found - redirecting to invite page.
   */
  sendInfoSearchRequest() {
    // let url = `/svc/profiles/${localStorage.getItem(AppContext.CONST.uidStorageKey)}/members`;
    const request_data = <any>{};
    request_data.memberType = this.adultService.memberType;

    let isValid = false;
    switch (this.adultService.add_option) {
      case this.adultService.options[0].id:
        if (this.adultInfoForm.valid) {
          isValid = true;
          this.adultService.personalInfo = request_data;
          Object.assign(request_data, this.adultInfoForm.value);
        } else {
          this._common.validateForm(this.adultInfoForm);
        }
        break;

      case this.adultService.options[1].id:
        if (this.rxNumberForm.valid) {
          isValid = true;
          Object.assign(request_data, this.rxNumberForm.value);
        } else {
          this._common.validateForm(this.rxNumberForm);
        }
        break;
    }

    if (isValid) {
      this.manager.enableLoad(true);
      this._http.postData(Microservice.fm_search_adult, request_data).subscribe(
        response => {
          this.manager.disableLoad();
          if (response.messages !== undefined) {
            if (response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1002') {
              this._message.addMessage(
                new Message(
                  response.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            } else if (
              response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1001'
            ) {
              this.adultService.add_state = this.adultService.states.info_additional.id;
              this._router.navigateByUrl(
                this.adultService.states.info_additional.path
              );
            } else if (
              response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1003'
            ) {
              this.adultService.add_state = this.adultService.states.underage_proposed.id;
              this._router.navigateByUrl(
                this.adultService.states.underage_proposed.path
              );
            } else {
              this._message.addMessage(
                new Message(
                  response.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          } else {
            // in case memeber found then sending user to invite page
            this.adultService.email_exit = response.email;
            this.adultService.personalInfo = response;
            this.adultService.add_state = this.adultService.states.send_invite.id;
            this._router.navigateByUrl(
              this.adultService.states.send_invite.path
            );
          }
        },
        error => {
          this.manager.disableLoad();
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    }
  }

  ngOnInit(): void {
    this.manager.disableLoad();
    // if (this.adultService.invite_success) {
    //   this._message.addMessage(new Message(this.adultService.invite_success, ARX_MESSAGES.MESSAGE_TYPE.SUCCESS));
    //   this.adultService.invite_success = undefined;
    // }
  }

  omit_special_char(event) {
    const charCode = event.charCode;
    return (
      charCode === 0 ||
      charCode === 8 ||
      charCode === 32 ||
      (charCode >= 47 && charCode <= 57)
    );
  }
}
