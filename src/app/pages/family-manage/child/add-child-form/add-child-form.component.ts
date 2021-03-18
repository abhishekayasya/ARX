import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FmService } from '@app/core/services/fm.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateConfigModel } from '@app/models/date-config.model';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { Router } from '@angular/router';
import { ChildService } from './../child.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-add-child-form',
  templateUrl: './add-child-form.component.html',
  styleUrls: ['./add-child-form.component.scss']
})
export class AddChildFormComponent implements OnInit {
  public childInfoForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    public manager: FmService,
    private _common: CommonUtil,
    private _userService: UserService,
    private _message: MessageService,
    private _http: HttpClientService,
    private _router: Router,
    private childService: ChildService,
    public appContext: AppContext
  ) {
    this.manager.disableLoad();
    this._common.removeNaturalBGColor();
    this.prepareChildForm();
  }
  ngOnInit() {
    // istanbul ignore else
    if (this.childService.childDetails) {
      this.childInfoForm.patchValue(this.childService.childDetails);
    }
  }
  prepareChildForm(): void {
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;

    this.childInfoForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ValidateDate(dateConfig)]],
      prescriptionNumber: ['', Validators.required]
    });
  }
  validateChild() {
    if (this.childInfoForm.invalid) {
      this._common.validateForm(this.childInfoForm);
      return;
    }
    const data = Object.assign(
      { memberType: 'child' },
      this.childInfoForm.value
    );

    this.manager.enableLoad(true);
    this._http.postData(Microservice.fm_add_child, data).subscribe(
      res => {
        this.manager.disableLoad();
        if (res['messages'] && res['messages'].length) {
          this._message.addMessage(
            new Message(res['messages'][0].message, res['messages'][0].type)
          );
        } else if (res.isAcctExists) {
          this.childService.childDetails = res;
          this._router.navigateByUrl(
            ROUTES.family_management.children.child.invite.absoluteRoute
          );
        } else {
          this.childService.childDetails = res;
          this._router.navigateByUrl(
            ROUTES.family_management.children.child.confirm.absoluteRoute
          );
        }
      },
      () => {
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
