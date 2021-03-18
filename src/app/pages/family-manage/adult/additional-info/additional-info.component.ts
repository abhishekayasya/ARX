import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdultService } from '../adult.service';
import { FmService } from '@app/core/services/fm.service';
import { HttpClientService } from '../../../../core/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateDate } from '../../../../shared/validators/date.validator';
import { CommonUtil } from '../../../../core/services/common-util.service';
import { UserService } from '../../../../core/services/user.service';
import { ARX_MESSAGES, ROUTES, STATE_US, Microservice } from '@app/config';
import { Message } from '@app/models';
import { MessageService } from '@app/core/services/message.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-fm-additionlinfo',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdultAdditionalInfoComponent implements OnInit {
  additionalInfoForm: FormGroup;

  STATE_US = STATE_US;

  constructor(
    private _router: Router,
    public adultService: AdultService,
    public manager: FmService,
    private _http: HttpClientService,
    private _formBuilder: FormBuilder,
    private _common: CommonUtil,
    private _userService: UserService,
    private _message: MessageService
  ) {
    this.initAdditionInfoForm();
  }

  initAdditionInfoForm() {
    this.additionalInfoForm = this._formBuilder.group({
      gender: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      street1: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
      aptSuite: ['']
    });
  }

  prefillAddressComponents(data) {
    this.additionalInfoForm.patchValue(data);
  }

  submitDataToSearch() {
    if (this.additionalInfoForm.invalid) {
      this._common.validateForm(this.additionalInfoForm);
      return;
    }

    // submitting data to search by additional information.
    // let url = `/svc/profiles/${localStorage.getItem(AppContext.CONST.uidStorageKey)}/members`;
    const request_data = Object.assign({}, this.adultService.personalInfo);
    const address = {};
    Object.assign(address, this.additionalInfoForm.value);
    request_data.address = address;
    request_data.gender = request_data.address.gender;
    delete request_data.address.gender;

    this.manager.enableLoad(true);
    this._http.postData(Microservice.fm_search_adult, request_data).subscribe(
      response => {
        this.manager.disableLoad();
        if (response.messages !== undefined) {
          if (response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1001') {
            this.adultService.add_state = this.adultService.states.send_invite.id;
            this._router.navigateByUrl(
              this.adultService.states.send_invite.path
            );
          } else {
            this._message.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        } else if (response.email) {
          // redirecting to invite page if match found
          this.adultService.email_exit = response.email;
          this.adultService.add_state = this.adultService.states.send_invite.id;
          this._router.navigateByUrl(this.adultService.states.send_invite.path);
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

  ngOnInit(): void {
    this.manager.disableLoad();
    if (this.adultService.personalInfo === undefined) {
      this._router.navigateByUrl(
        ROUTES.family_management.children.adult.add.absoluteRoute
      );
    }
  }
}
