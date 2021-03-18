import { ROUTES } from './../../../../config/routes.constant';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { ClinicalAssessmentService } from '../../clinical-assessment.service';
import { AssessmentRequestModel } from '@app/models/clinical-assessment/do-assessment.model';
import { Router } from '@angular/router';
// tslint:disable-next-line: import-blacklist
import { Subscription } from 'rxjs';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { assesmentConstant, KEYS } from '@app/config';
import { RefillReminderService } from '@app/core/services/refill-reminder.service';
import { CHECKOUT } from '@app/config/checkout.constant';

@Component({
  selector: 'arxrf-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit, OnDestroy {
  assessmentData: AssessmentRequestModel;

  // subscription1: Subscription;
  subscription2: Subscription;

  interventionStateData = [];
  currentIntervention: any = {};

  InterventionForm: FormGroup;
  InterventionFromArray: FormArray;
  formQuestion: Array<any> = [];
  formAnswer: Array<any> = [];
  currentQuestion = {};

  currentState = 0;
  currentAssessState = 0;
  runOnStartOnce = true;

  showLoader = true;
  optionTouched: boolean;
  currentAssessmentStepId = '';
  currentAssessmentTrackingId = '';

  interventionData: Array<any> = [];
  nextPath: Array<string>;
  selectedDropdownVal: any = 0;
  selectedCheckVal: any;
  sideEffectsListMap: Map<string, string> = new Map<string, string>();
  sideEffectsListArray: Array<any> = [];
  customCheckAnswer: any;
  buttonEnabled = false;
  Isreload = false;
  display = 'none'; // default Variable
  error_title = 'Apologies';
  errorMessage =
    // tslint:disable-next-line: max-line-length
    'It appears we are having technical difficulties. A member of our care team will reach out to you if additional information is needed. Please continue to the next screen to submit your refill order.';
  doassessmentSuppressorFlag = false;
  suppresStepId = '';
  suppresQuestionId = '';
  suppresAssessmentTrackingId = '';
  checkedItems = {};
  unique = [];
  selectBoxObj = {};
  isdisableNext = true;
  textAreaObj = {};
  labelCount = 0;
  queryParameters;

  isAssessmentDone = false;

  constructor(
    private _caService: ClinicalAssessmentService,
    private _userService: UserService,
    private router: Router,
    private _fb: FormBuilder,
    private _common: CommonUtil,
    private _refillreminderService: RefillReminderService
  ) {
    this.InterventionForm = this._fb.group({
      InterventionFromArray: this._fb.array([])
    });
    // this.subscription1 = this._caService.assessmentState.subscribe(data => { })
    if ( this._refillreminderService.isSpecialtyAvailable() ) {
      this.nextPath = [
        ROUTES.speciality_refill_reminder.absoluteRoute
      ];
      this.queryParameters = this._refillreminderService.getSpecialtyParameters();
    } else {
      this.nextPath =[
        this._caService.getLocalState('ca-path')
          ? this._caService.getLocalState('ca-path').route.toString()
          : '/'
      ];
    }

    this.subscription2 = this._caService.InterventionState.subscribe(data => {
      this.currentState = -1;
      this.currentAssessState = -1;
      this.interventionStateData = data;

      this.currentIntervention = data.find(val => {
        this.currentAssessState++;
        return val.done === false;
      });

      if (
        this.currentIntervention &&
        this.currentIntervention['AssessmentIds']
      ) {
        this.currentIntervention['AssessmentIds'].find(cval => {
          this.currentState++;
          return cval.done === true;
        });
      } else {
        //this.router.navigate(this.nextPath);
        this.routeToNextPath();
      }

      if (this.runOnStartOnce) {
        this.onInitialRun();
      } else {
        this.interventionStateData[
          this.currentAssessState
        ] = this.currentIntervention;
      }

      this.runOnStartOnce = false;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    // enabling leave site popup if assessment is not completed.
    if ( !this.isAssessmentDone ) {
      this._caService.setLocalState('Isreload', 'yes');
      event.returnValue =
      'If you exit this assessment, your answers won’t be saved and we may contact you for additional information to complete your order.';
    }
  }

  onInitialRun() {
    if (this.currentIntervention === undefined) {
      localStorage.removeItem('ca-state');
      const localdata = [...this.interventionStateData]
        .reverse()
        .find(data => data.done === true);
      //this.router.navigate(this.nextPath);
      this.routeToNextPath();
    } else if (
      this.currentIntervention &&
      this.currentIntervention.noAssessment &&
      !this.currentIntervention['AssessmentIds']
    ) {
      this.currentIntervention.done = true;
      const currentState = [...this.interventionStateData];
      currentState[this.currentAssessState] = this.currentIntervention;
      this._caService.setLocalState('ca-state', currentState);
      // this.router.navigate(this.nextPath);
      this.routeToNextPath();
    } else if (localStorage.getItem('currentAssessmentStepId') === '-1') {
      // For testing - ARXDIGITAL-3371
      this.currentIntervention.done = true;
      const currentState = [...this.interventionStateData];
      currentState[this.currentAssessState] = this.currentIntervention;
      this._caService.setLocalState('ca-state', currentState);
      // this.router.navigate(this.nextPath);
      this.routeToNextPath();
    } else {
      this.currentAssessmentStepId = this.currentIntervention.AssessmentIds.toString();
      this.currentAssessmentTrackingId = this.currentIntervention.AssessmentIds[
        this.currentState
      ]['doAssessmenTrackingId'];
      this.currentAssessmentStepId = this.currentIntervention.AssessmentIds[
        this.currentState
      ]['doAssessmentLastStepId'];
      this.formAnswer = this.currentIntervention.AssessmentIds[
        this.currentState
      ]['answer'];
      this.onAssessmentCallSuppresFirst();
    }
  }

  createArray(data) {
    this.InterventionFromArray = <any>(
      this.InterventionForm.get('InterventionFromArray')
    );
    if (Array.isArray(data)) {
      data.forEach(val => {
        if (!val['ControlType']['@nil'] && val['AllowableAnswers']) {
          const selectedval =
            val['ControlType'] === 'label'
              ? ''
              : val['AllowableAnswers']['AnswerType'];
          const answers = [
            ...(Array.isArray(selectedval) ? selectedval : [selectedval])
          ];
          if (
            val['ControlType'] === 'checkboxlist' &&
            !Array.isArray(selectedval)
          ) {
            val['AllowableAnswers']['AnswerType'] = answers;
          }
          const answerisarray =
            val['ControlType'] === 'label'
              ? []
              : val['ControlType'] !== 'textbox'
              ? answers.find(cval => cval.Selected)
              : val['AllowableAnswers'];
          this.InterventionFromArray.push(
            this.handleAnswerOptionType(val, answerisarray)
          );
        }
      });
    }
  }

  handleAnswerOptionType(val, selectedval): FormGroup {
    if (
      val['ControlType'] === 'checkboxlist' ||
      val['ControlType'] === 'checkbox'
    ) {
      this.selectedDropdownVal = 0;
      const fg = this._fb.array(
        // tslint:disable-next-line: no-shadowed-variable
        val.AllowableAnswers.AnswerType.map(val =>
          this._fb.control(val.Selected)
        )
      );
      return this._fb.group({ question: fg });
    } else {
      return this._fb.group({
        question: new FormControl(
          selectedval ? selectedval['Answer'] : selectedval,
          !val.Optional &&
          val['Visible'] &&
          val['ControlType'] !== 'label' &&
          val['QuestionText'] !== 'SKIP'
            ? Validators.required
            : null
        )
      });
    }
  }

  ngOnInit() {
    if (this._caService.getLocalState('ca-state')) {
      this._caService.InterventionState.next(
        this._caService.getLocalState('ca-state')
      );
    } else {
      let requestPayload: any|null;
      if (this.queryParameters) {
        requestPayload = {
          flag: 'SPRx-RR',
          flowType: this.queryParameters['type'],
          referralId:  this.queryParameters['referralId'],
          smId: this.queryParameters['smId']
        };
        this._caService.getFidBySmId(this.queryParameters['smId']).subscribe(res => {
          if (res.SMLinkages && res.SMLinkages.length > 0) {
            requestPayload['fid'] = res.SMLinkages[0].profileId;
          }
          this.callPatientReferral(requestPayload);
        }, error => this.routeToNextPath());
      } else {
        this.callPatientReferral(null);
      }
    }
  }

  callPatientReferral(requestPayload) {
    this._caService.patientReferralCall(requestPayload).subscribe(res => {
      if (!res) {
        this.routeToNextPath();
        return;
      } else {
        const refdata = [],
          dataarr = [];
        if (res && res['checkoutDetails']) {
          for (const pval of res['checkoutDetails']) {
            if (pval && pval['prescriptionList']) {
              for (const val of pval['prescriptionList']) {
                if (val && val['meId']) {
                  if (val.admin) {
                    dataarr.unshift({
                      referralId: pval.referralId ? pval.referralId : '',
                      patientName: val.patientName ? val.patientName : '',
                      patientId: pval.scriptMedId,
                      admin: val.admin,
                      reviewData: val
                    });
                  } else {
                    dataarr.push({
                      referralId: pval.referralId ? pval.referralId : '',
                      patientName: val.patientName ? val.patientName : '',
                      patientId: pval.scriptMedId,
                      admin: val.admin,
                      reviewData: val
                    });
                  }
                }
              }
            }
          }
        } else {
          this.routeToNextPath();
        }
        if (dataarr.length > 0) {
          sessionStorage.setItem(KEYS.review_page_refresh, 'true');
          const arr = [];
          for (const pval of dataarr) {
            const obj = {
              PatientId: pval.patientId,
              ReferralId: pval.referralId,
              name: pval.patientName ? pval.patientName : '',
              admin: pval.admin ? pval.admin : ''
            };
            const item = obj.ReferralId;
            if (!arr.includes(item)) {
              refdata.push(obj);
              arr.push(item);
            }
          }
          this._caService.processReferralData(refdata);
        } else {
          this.routeToNextPath();
        }
      }
    });
  }

  onAssessmentCall(value?: any) {
    if (this.doassessmentSuppressorFlag) {
      this.currentAssessmentTrackingId = this.suppresAssessmentTrackingId;
      this.currentAssessmentStepId = this.suppresStepId;
      this.currentIntervention.AssessmentIds[this.currentState]['answer'] = [
        { Answer: '5', QuestionId: this.suppresQuestionId }
      ];
      this.doassessmentSuppressorFlag = false;
    }
    this.showLoader = true;
    this.currentIntervention.AssessmentIds[this.currentState][
      'doAssessmenTrackingId'
    ] = this.currentAssessmentTrackingId;
    this.currentIntervention.AssessmentIds[this.currentState][
      'doAssessmentLastStepId'
    ] = this.currentAssessmentStepId;
    const assesmentId = this.currentIntervention.AssessmentIds[
      this.currentState
    ]['id'];
    this._caService
      .doAssessmentCall(
        this._caService.generatePayload(
          this.currentIntervention.AssessmentIds[this.currentState][
            'doAssessmentLastStepId'
          ] === 0
            ? 2
            : 3,
          this.currentState
        )
      )
      .subscribe(
        data => {
            if ((data && data.status > 400) ||
            (data &&
            data.json().DoAssessmentResponse.DoAssessmentResult.Status
              .StatusCode !== '')
          ) {
            this.openModalDialog();
          } else if (
            data &&
            data.json().DoAssessmentResponse.DoAssessmentResult.AssessmentStep
              .Questions &&
            data.json().DoAssessmentResponse.DoAssessmentResult.AssessmentStep
              .AssessmentStepId !== -1
          ) {
              // GTM Tag Changes
              window['dataLayer'] = window['dataLayer'] || [];
              let questions = data.json().DoAssessmentResponse
                .DoAssessmentResult.AssessmentStep.Questions.QuestionType;
              let quesData = questions;
              if (!Array.isArray(quesData)) { quesData = [quesData]; }
              quesData.forEach(element => {
                if (typeof element.QuestionName === 'string') {
                  window['dataLayer'].push({
                    'event': 'newDcaStep',
                    'dcaAssessmentId': assesmentId,
                    'dcaQuestionId': element.QuestionId,
                    'dcaQuestionName': element.QuestionName
                  });
                }
              });
              if (Array.isArray(questions)) {
              questions = questions.map(item => {
                if (
                  item.QuestionText &&
                  item.QuestionText === assesmentConstant.oncologyQuestion
                ) {
                  // tslint:disable-next-line: max-line-length
                  const columns = data.json().DoAssessmentResponse[
                    'DoAssessmentResult'
                  ]['TransactionRows']['TransactionRowType']['Rows']['Row'];
                  const medicines = [];
                  if (Array.isArray(columns)) {
                    columns.forEach(column => {
                      const columnValue =
                        column['Columns']['ColumnType']['Value'];
                      const caseConvertedValue =
                        columnValue.charAt(0).toUpperCase() +
                        columnValue.slice(1).toLowerCase();
                      medicines.push(caseConvertedValue);
                    });
                  } else {
                    medicines.push(columns['Columns']['ColumnType']['Value']);
                  }
                  item.QuestionText = `${
                    assesmentConstant.oncologyQuestionChange
                  } ${medicines.join(', ')}?`;
                }
                return item;
              });
            }
            this.formQuestion = data.json().DoAssessmentResponse
              .DoAssessmentResult
              ? [
                  ...(Array.isArray(questions) ? questions : [questions])
                ].filter(val => !val.ControlType['@nil'])
              : [];
            this.showLoader = false;
            this.createArray(this.formQuestion);
            this.updateAssessmentValues(data.json());
            this._caService.InterventionState.next(this.interventionStateData);
            this.isdisableNext = true;
            for (let i = 0; i < this.formQuestion.length; i++) {
              if (this.formQuestion[i].ControlType === 'label') {
                this.labelCount++;
                if (this.formQuestion.length === this.labelCount) {
                  this.isdisableNext = false;
                }
              }
            }
          } else {
            this.isdisableNext = false;
            this.updateAssessmentValues(data.json());
            this.onCurrentAssessmentComplete(data.json());
          }
        },
        err => {
          this.openModalDialog();
          this.currentIntervention.done = true;
          this.interventionStateData[
            this.currentAssessState
          ] = this.currentIntervention;
          this.currentAssessState++;
        }
      );
  }

  onAssessmentCallSuppresFirst(value?: any) {
    this.showLoader = true;
    this.currentIntervention.AssessmentIds[this.currentState][
      'doAssessmenTrackingId'
    ] = this.currentAssessmentTrackingId;
    this.currentIntervention.AssessmentIds[this.currentState][
      'doAssessmentLastStepId'
    ] = this.currentAssessmentStepId;
    this._caService
      .doAssessmentCall(
        this._caService.generatePayload(
          this.currentIntervention.AssessmentIds[this.currentState][
            'doAssessmentLastStepId'
          ] === 0
            ? 2
            : 3,
          this.currentState
        )
      )
      .subscribe(
        data => {
          if (
            data &&
            data.json().DoAssessmentResponse.DoAssessmentResult.Status
              .StatusCode !== ''
          ) {
            // this.router.navigate(this.nextPath);
            this.routeToNextPath();
          } else if (data) {
            this.suppresStepId = data.json().DoAssessmentResponse.DoAssessmentResult.AssessmentStep.AssessmentStepId;
            this.suppresQuestionId = data.json().DoAssessmentResponse.DoAssessmentResult.AssessmentStep.Questions.QuestionType.QuestionId;
            this.suppresAssessmentTrackingId = data.json().DoAssessmentResponse.DoAssessmentResult.AssessmentTrackingId;
            this.doassessmentSuppressorFlag = true;
            this.onAssessmentCall();
          }
        },
        err => {
          this.currentIntervention.done = true;
          this.interventionStateData[
            this.currentAssessState
          ] = this.currentIntervention;
          this.currentAssessState++;
          this._caService.InterventionState.next(this.interventionStateData);
          // this.router.navigate(this.nextPath);
          this.routeToNextPath();
        }
      );
  }

  onClickNext(formdata: Array<any>) {
    this.labelCount = 0;
    this.isdisableNext = true;
    this.unique = [];
    this.selectBoxObj = {};
    this.textAreaObj = {};
    window.scrollTo(0, 0);
    this.customCheckAnswer = this.sideEffectsListArray.join('|');
    const checkcheckArr = [
      ...this.formQuestion.map(val => val.ControlType === 'checkboxlist')
    ];
    this.formAnswer = formdata['InterventionFromArray'].map((val, i) => ({
      Answer:
        val['question'] &&
        this.formQuestion[i]['Visible'] &&
        this.formQuestion[i]['QuestionText'] !== 'SKIP'
          ? checkcheckArr[i]
            ? // CHECKBOX---------------------
              (Array.isArray(
                this.formQuestion[i]['AllowableAnswers']['AnswerType']
              )
                ? this.formQuestion[i]['AllowableAnswers']['AnswerType']
                : [this.formQuestion[i]['AllowableAnswers']['AnswerType']]
              )
                .filter((cval, j) => {
                  const selected = this.checkedItems.hasOwnProperty(
                    cval.AnswerDisplayText +
                      '|' +
                      this.formQuestion[i].QuestionId
                  );
                  return selected && val['question'][j];
                })
                .map(cval => cval['Answer'])
                .join('|')
            : // NOT CHECKBOX---------------------
              val['question'].toString()
          : this.formQuestion[i]['QuestionText'].ControlType === 'textarea'
          ? ''
          : '0',
      QuestionId: this.formQuestion[i].QuestionId
    }));
    this.currentIntervention.AssessmentIds[this.currentState]['answer'].push(
      ...this.formAnswer
    );
    this.sideEffectsListMap.clear();
    this.sideEffectsListArray = [];
    this.checkedItems = [];
    this.onAssessmentCall();
    while (this.InterventionFromArray.length !== 0) {
      this.InterventionFromArray.removeAt(0);
    }
  }

  updateAssessmentValues(data) {
    if (data.DoAssessmentResponse.DoAssessmentResult.AssessmentStep === '-1') {
      this.currentAssessmentStepId = '0';
    } else {
      if (localStorage.getItem('UpdatePatientIntervention') === 'Success') {
        this.currentAssessmentStepId = '0';
        localStorage.removeItem('UpdatePatientIntervention');
      } else {
        this.currentAssessmentStepId = data.DoAssessmentResponse.DoAssessmentResult.AssessmentStep.AssessmentStepId.toString();
      }
    }
    localStorage.setItem(
      'currentAssessmentStepId',
      this.currentAssessmentStepId
    );
    this.currentAssessmentTrackingId = data.DoAssessmentResponse.DoAssessmentResult[
      'AssessmentTrackingId'
    ].toString();
  }

  onCurrentAssessmentCompleteOld() {
    if (this.currentIntervention) {
      const ref = this.interventionStateData.findIndex(
        val =>
          val['PatientId'] === this.currentIntervention['PatientId'] &&
          val['ReferralId'] === this.currentIntervention['ReferralId']
      );
      const curIntAss = this.currentIntervention['AssessmentIds'][
        this.currentState
      ];
      if (curIntAss && this.currentAssessmentStepId !== '-1') {
        this.interventionData[ref] = this.currentIntervention;
        curIntAss.done = true;
        this.showLoader = false;
      } else {
        this._caService.updateAssessmentCall().subscribe(
          val => {
            this.currentAssessState++;
            this.currentIntervention['done'] = true;
            this.interventionStateData[ref] = this.currentIntervention;
            if (
              this.interventionStateData[ref + 1] &&
              this.currentIntervention['PatientId'] !==
                this.interventionStateData[ref + 1]['PatientId']
            ) {
              this._caService.InterventionState.next(
                this.interventionStateData
              );
              this.showLoader = false;
            } else {
              this._caService.InterventionState.next(
                this.interventionStateData
              );
              // this.router.navigate(this.nextPath);
              this.routeToNextPath();
            }
          },
          error => {
            // this.router.navigate(this.nextPath);
            this.routeToNextPath();
          }
        );
      }
    } else {
      // this.router.navigate(this.nextPath);
      this.routeToNextPath();
    }
  }

  onCurrentAssessmentComplete(response) {
    if (this.currentIntervention) {
      const ref = this.interventionStateData.findIndex(
        val =>
          val['PatientId'] === this.currentIntervention['PatientId'] &&
          val['ReferralId'] === this.currentIntervention['ReferralId']
      );
      const curIntAss = this.currentIntervention['AssessmentIds'][
        this.currentState
      ];
      if (curIntAss && this.currentAssessmentStepId !== '-1') {
        const data =
          response.DoAssessmentResponse.DoAssessmentResult.AssessmentStep
            .Questions;
        if (data === '') {
          setTimeout(() => {
            this.onAssessmentCall();
          }, 0);
        } else {
          this.interventionData[ref] = this.currentIntervention;
          curIntAss.done = true;
          this.showLoader = false;
        }
      } else {
        this._caService.updateAssessmentCall().subscribe(
          val => {
            if ( window && window['ARX_Util'] ) {
              window['ARX_Util'].FORESEE.isDCA( true );
            }
            val._body = JSON.parse(val._body);
            if (
              val._body.UpdatePatientInterventionResponse
                .UpdatePatientInterventionResult.Status.StatusCode !==
              'S_100_DataSavedSucessfully'
            ) {
              // this.router.navigate(this.nextPath);
              this.routeToNextPath();
            } else {
              this.currentAssessState++;
              this.currentIntervention['done'] = true;
              this.doassessmentSuppressorFlag = true;
              this.interventionStateData[ref] = this.currentIntervention;
              //Added for CID
              if (this.checkInterventions()) {
                this.currentAssessmentStepId = '0';
                localStorage.setItem(
                  'currentAssessmentStepId',
                  this.currentAssessmentStepId
                );
                this.runOnStartOnce = true;
                this._caService.InterventionState.next(
                  this.interventionStateData
                );
              } else {
                this._caService.InterventionState.next(
                  this.interventionStateData
                );
                // this.router.navigate(this.nextPath);
                this.routeToNextPath();
              }
            }
          },
          error => {
            // this.router.navigate(this.nextPath);
            this.routeToNextPath();
          }
        );
      }
    } else {
      // this.router.navigate(this.nextPath);
      this.routeToNextPath();
    }
  }

  selectOption(item, value) {
    if (value === '0') {
      delete this.selectBoxObj[item.QuestionId];
    } else {
      this.selectBoxObj[item.QuestionId] = item.Answer;
    }
    this.isenableNext();
  }

  omit_special_char(event) {
    let k;
    k = event.charCode; // only restriction for ^
    return k !== 94;
  }

  updateCheckedOptions(event, key, value, quesId) {
    if (event.target.checked) {
      if (key === '_NONE' || key === 'Prefer not to answer') {
        const arr = Object.keys(this.checkedItems);
        arr.forEach(item => {
          if (item.endsWith(quesId)) {
            delete this.checkedItems[item];
          }
        });
        this.sideEffectsListMap.clear();
        this.sideEffectsListMap.set(key, value);
      } else {
        this.sideEffectsListMap.delete('_NONE');
        this.sideEffectsListMap.delete('Prefer not to answer');
        delete this.checkedItems['_NONE' + '|' + quesId];
        delete this.checkedItems['Prefer not to answer' + '|' + quesId];
      }
      this.sideEffectsListMap.set(key, value);
      this.checkedItems[key + '|' + quesId] = value;
    } else {
      delete this.checkedItems[key + '|' + quesId];
      this.sideEffectsListMap.delete(key);
    }
    this.selectedDropdownVal = this.sideEffectsListMap.size;
    this.sideEffectsListArray = Array.from(this.sideEffectsListMap.values());
    this.sideEffectsListArray.sort(function(a, b) {
      return a - b;
    });

    this.unique = [];
    Object.keys(this.checkedItems).forEach(item => {
      const quesid = item.split('|')[1];
      if (!this.unique.includes(quesid)) {
        this.unique.push(quesid);
      }
    });
    this.isenableNext();
  }

  openModalDialog() {
    this.display = 'block';
  }

  closeModalDialog() {
    this.display = 'none';
    this.showLoader = true;
    // this.router.navigate(this.nextPath);
    this.routeToNextPath();
  }

  checkInterventions() {
    const nextIntervation = this.interventionStateData.find(val => {
      return val.done === false;
    });
    return nextIntervation;
  }
  ngOnDestroy(): void {
    this.subscription2.unsubscribe();
    localStorage.removeItem('ca-state');
    localStorage.removeItem('Isreload');
    localStorage.removeItem('currentAssessmentStepId');
    this.display = 'none';
    // this.router.navigate(['/manageprescriptions']);
  }

  isenableNext() {
    const arr = [].concat(
      ...this.unique,
      ...Object.keys(this.selectBoxObj),
      ...Object.keys(this.textAreaObj)
    );
    const res = arr.length + this.labelCount === this.formQuestion.length;
    this.isdisableNext = !res;
  }
  onTextAreaChange(quesId, value) {
    if (value === '') {
      delete this.textAreaObj[quesId];
    } else {
      this.textAreaObj[quesId] = value;
    }
    this.isenableNext();
  }

  // This function routes to 'speciality-checkout/speciality-refill-checkout' based on url params.
  routeToNextPath() {
    // marking assessment as done before redirection.
    this.isAssessmentDone = true;
    if ( this._refillreminderService.isSpecialtyAvailable() ) {
      this._refillreminderService.updateDCAState(true);
    }
    if (this.queryParameters) {
      this._common.navigate(this.nextPath[0], this.queryParameters);
    } else {
      this._common.navigate(this.nextPath[0]);
    }
  }

  // Format questions in assessment session
  stripUnderscore(q: string) {
    if (q && q.length > 1 && q.startsWith('_')) {
      return q.substring(1);
    } else {
      return q;
    }
  }
}
