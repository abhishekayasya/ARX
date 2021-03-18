import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { ClinicalAssessmentService } from '../../clinical-assessment.service';
import { AssessmentComponent } from './assessment.component';
import { Observable } from 'rxjs/Observable';

describe('AssessmentComponent', () => {
  let component: AssessmentComponent;
  let fixture: ComponentFixture<AssessmentComponent>;
  let _common: CommonUtil;
  let _router: Router;
  let commonUtilSpy: any;
  let _messageService: MessageService;
  let http: HttpClientService;
  let _userService: UserService;
  let caService: ClinicalAssessmentService;

  beforeEach(async(() => {
    commonUtilSpy = jasmine.createSpyObj('CommonUtil', [
      'removeNaturalBGColor'
    ]);

    TestBed.configureTestingModule({
      declarations: [AssessmentComponent],
      imports: [AppTestingModule],
      // tslint:disable-next-line: no-use-before-declare
      providers: [{ provide: Router, useValue: router }]
    }).compileComponents();
  }));

  const router = { navigate: () => { } };

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentComponent);
    component = fixture.componentInstance;
    _userService = TestBed.get(UserService);
    _common = TestBed.get(CommonUtil);
    _router = TestBed.get(Router);
    _messageService = TestBed.get(MessageService);
    http = TestBed.get(HttpClientService);
    caService = TestBed.get(ClinicalAssessmentService);
  });

  it('should create', () => {
    spyOn(component, 'onInitialRun').and.stub();
    spyOn(caService, 'InterventionState').and.returnValue(
      Observable.of({
        done: false,
        AssessmentIds: [{ done: false }]
      })
    );
    expect(component).toBeTruthy();
  });

  it('should call - onInitialRun', () => {
    spyOn(router, 'navigate').and.stub();
    component.currentIntervention = undefined;
    component.onInitialRun();
  });
  it('should call - onInitialRun - elseif', () => {
    spyOn(_router, 'navigate').and.stub();
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test'
    };
    component.onInitialRun();
  });
  it('should call - onInitialRun - elseif currentAssessmentStepId', () => {
    spyOn(_router, 'navigate').and.stub();
    localStorage.setItem('currentAssessmentStepId', '-1');
    component.onInitialRun();
  });
  it('should call - onInitialRun - else', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'onAssessmentCallSuppresFirst').and.stub();
    component.currentIntervention = {
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 2,
        answer: 'test'
      }]
    };
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 2,
        answer: 'test'
      }]
    };
    caService.getLocalState['Isreload'] = 'yes';
    component.onInitialRun();
  });

  it('should call - createArray ', () => {
    spyOn(router, 'navigate').and.stub();
    const dataval = [
      {
        ControlType: 'label',
        AllowableAnswers: { AnswerType: 'test' }
      }
    ];
    component.createArray(dataval);
  });
  it('should call - createArrayif checkboxlist', () => {
    spyOn(router, 'navigate').and.stub();
    const dataval = [
      {
        ControlType: 'checkboxlist',
        AllowableAnswers: { AnswerType: 'test' }
      }
    ];
    component.createArray(dataval);
  });
  // it('should call - handleAnswerOptionType', () => {
  //   spyOn(router, 'navigate').and.stub();
  //   component.handleAnswerOptionType({ ControlType: 'checkbox' }, null);
  // });
  it('should call - ngOnInit else', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'patientReferralCall').and.returnValue(
      Observable.of({ status: 200 })
    );
    component.ngOnInit();
  });
  it('should call - ngOnInit else', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'patientReferralCall').and.returnValue(
      Observable.of({
        checkoutDetails: [
          {
            prescriptionList: [
              {
                patientName: 'DIGICATWSVN DIGICATWSVN',
                admin: true,
                meId: '11950421941',
                referralId: 1,
                scriptMedId: 1
              }
            ]
          }
        ]
      })
    );
    component.ngOnInit();
  });
  it('should call - ngOnInit else', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'patientReferralCall').and.returnValue(
      Observable.of({
        checkoutDetails: [
          {
            prescriptionList: [
              {
                patientName: 'DIGICATWSVN DIGICATWSVN',
                // admin: false,
                meId: '11950421941',
                referralId: 1,
                scriptMedId: 1
              }
            ]
          }
        ]
      })
    );
    component.ngOnInit();
  });
  it('should call - onAssessmentCall', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.of({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: {
                Status: {
                  StatusCode: 'test'
                }
              }
            }
          };
        }
      })
    );
    component.onAssessmentCall();
  });
  it('should call - onAssessmentCall else', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'updateAssessmentValues').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.of({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: {
                Status: {
                  StatusCode: ''
                },
                Header: {
                  RequestId: 1
                },
                TransactionRows: {
                  TransactionRowType: {
                    Rows: {
                      Row: [{
                        Columns: { ColumnType: { Value: 'test' } }
                      }]
                    }
                  }
                },
                AssessmentStep: {
                  Questions: {
                    QuestionType: [{
                      QuestionText: 'Please confirm that you are refilling the following medication(s)?',
                      ControlType: '@nil'
                    }]
                  },
                  AssessmentStepId: 1
                }
              }
            }
          };
        }
      })
    );
    component.onAssessmentCall();
  });
    it('should call - onAssessmentCall else', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'updateAssessmentValues').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.of({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: {
                Status: {
                  StatusCode: ''
                },
                Header: {
                  RequestId: 1
                },
                TransactionRows: {
                  TransactionRowType: {
                    Rows: {
                      Row: [{
                        Columns: { ColumnType: { Value: 'test' } }
                      }]
                    }
                  }
                },
                AssessmentStep: {
                  Questions: {
                    QuestionType: [{
                      QuestionText: 'Please confirm that you are refilling the following medication(s)?',
                      ControlType: 'label'
                    }]
                  },
                  AssessmentStepId: 1
                }
              }
            }
          };
        }
      })
    );
    component.onAssessmentCall();
  });
  it('should call - onAssessmentCall else1', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'updateAssessmentValues').and.stub();
    spyOn(component, 'onCurrentAssessmentComplete').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.of({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: {
                Status: {
                  StatusCode: ''
                },
                Header: {
                  RequestId: 1
                },
                TransactionRows: {
                  TransactionRowType: {
                    Rows: {
                      Row: [{
                        Columns: { ColumnType: { Value: 'test' } }
                      }]
                    }
                  }
                },
                AssessmentStep: {
                  Questions: {
                    QuestionType: [{
                      QuestionText: 'Please confirm that you are refilling the following medication(s)?',
                      ControlType: 'label'
                    }]
                  },
                  AssessmentStepId: -1
                }
              }
            }
          };
        }
      })
    );
    component.onAssessmentCall();
  });
  it('should call - onAssessmentCall- error', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.throw({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: { Status: { StatusCode: '' } }
            }
          };
        }
      })
    );
    component.onAssessmentCall();
  });
  it('should call - onAssessmentCallSuppresFirst', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.of({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: {
                Status: {
                  StatusCode: 'test'
                }
              }
            }
          };
        }
      })
    );
    component.onAssessmentCallSuppresFirst('test');
  });
  it('should call - onAssessmentCallSuppresFirst else', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'onAssessmentCall').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.of({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: {
                Header: { RequestId: 1 },
                Status: { StatusCode: '' },
                AssessmentTrackingId: 1,
                AssessmentStep: {
                  AssessmentStepId: 1,
                  Questions: {
                    QuestionType: [{
                      QuestionText: 'Please confirm that you are refilling the following medication(s)?',
                      QuestionId: 1
                    }]
                  }
                }
              }
            }
          };
        }
      })
    );
    component.onAssessmentCallSuppresFirst('test');
  });
  it('should call - onAssessmentCallSuppresFirst- error', () => {
    component.doassessmentSuppressorFlag = true;
    component.currentState = 0;
    component.currentIntervention = {
      noAssessment: 'test',
      AssessmentIds: [{
        doAssessmenTrackingId: 1,
        doAssessmentLastStepId: 0,
        answer: [{ Answer: '5', QuestionId: 1 }]
      }]
    };
    spyOn(router, 'navigate').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'doAssessmentCall').and.returnValue(
      Observable.throw({
        json: () => {
          return {
            DoAssessmentResponse: {
              DoAssessmentResult: { Status: { StatusCode: '' } }
            }
          };
        }
      })
    );
    component.onAssessmentCallSuppresFirst('test');
  });
  xit('should call - onClickNext', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(component, 'onAssessmentCall').and.stub();
    component.formQuestion = [{
      ControlType: 'checkboxlist',
      AllowableAnswers: { AnswerType: [{ AnswerDisplayText: 'test', Answer: 'test' }] },
      Visible: true,
      QuestionText: 'textarea',
      QuestionId: 1
    }];
    component.onClickNext([{ InterventionFromArray: [{ question: 'test' }] }]);
  });
  it('should call - updateAssessmentValues', () => {
    const response_data = {
      DoAssessmentResponse: {
        DoAssessmentResult: {
          AssessmentTrackingId: '1',
          AssessmentStep: '-1'
        }
      }
    };
    component.updateAssessmentValues(response_data);
  });
  it('should call - updateAssessmentValues else', () => {
    localStorage.setItem('UpdatePatientIntervention', JSON.stringify('Success'));
    const response_data = {
      DoAssessmentResponse: {
        DoAssessmentResult: {
          AssessmentTrackingId: '1',
          AssessmentStep: {
            AssessmentStepId: '1'
          }
        }
      }
    };
    component.updateAssessmentValues(response_data);
  });
  it('should call - updateAssessmentValues else1', () => {
    const response_data = {
      DoAssessmentResponse: {
        DoAssessmentResult: {
          AssessmentTrackingId: '1',
          AssessmentStep: {
            AssessmentStepId: '1'
          }
        }
      }
    };
    component.updateAssessmentValues(response_data);
  });
  it('should call - onCurrentAssessmentCompleteOld', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'onAssessmentCall').and.stub();
    component.currentState = 0;
    component.currentIntervention = {
      PatientId: 1,
      ReferralId: 2,
      AssessmentIds: [
        {
          doAssessmenTrackingId: 1,
          doAssessmentLastStepId: 2,
          answer: 'test'
        }
      ]
    };
    component.interventionStateData = [
      {
        PatientId: 1,
        ReferralId: 2
      }
    ];
    component.onCurrentAssessmentCompleteOld();
  });
  it('should call - onCurrentAssessmentComplete', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'onAssessmentCall').and.stub();
    component.currentState = 0;
    component.currentIntervention = {
      PatientId: 1,
      ReferralId: 2,
      AssessmentIds: [
        {
          doAssessmenTrackingId: 1,
          doAssessmentLastStepId: 2,
          answer: 'test'
        }
      ]
    };
    component.interventionStateData = [
      {
        PatientId: 1,
        ReferralId: 2
      }
    ];
    const response_data = {
      DoAssessmentResponse: {
        DoAssessmentResult: {
          AssessmentStep: {
            Questions: ''
          }
        }
      }
    };
    component.onCurrentAssessmentComplete(response_data);
  });
  xit('should call - onCurrentAssessmentComplete1', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'onAssessmentCall').and.stub();
    component.currentState = 0;
    component.currentAssessmentStepId = '-1';
    component.currentIntervention = {
      PatientId: 1,
      ReferralId: 2,
      AssessmentIds: [
        {
          doAssessmenTrackingId: 1,
          doAssessmentLastStepId: 2,
          answer: 'test'
        }
      ]
    };
    component.interventionStateData = [
      {
        PatientId: 1,
        ReferralId: 2
      }
    ];
    const response_data = {
      DoAssessmentResponse: {
        DoAssessmentResult: {
          AssessmentStep: {
            Questions: [1, 2, 3]
          }
        }
      }
    };
    component.onCurrentAssessmentComplete(response_data);
  });
  xit('should call - onCurrentAssessmentComplete else', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(caService, 'generatePayload').and.stub();
    spyOn(caService, 'updateAssessmentCall').and.returnValue(Observable.of({
      _body: {
        UpdatePatientInterventionResponse: {
          UpdatePatientInterventionResult: { Status: { StatusCode: 'S_100_DataSavedSucessfully' } }
        }
      }
    }));
    component.currentAssessmentStepId = '-1';
    component.currentState = 0;
    component.currentIntervention = {
      PatientId: 1,
      ReferralId: 2,
      AssessmentIds: [
        {
          doAssessmenTrackingId: 1,
          doAssessmentLastStepId: 2,
          answer: 'test'
        }
      ]
    };
    component.interventionStateData = [{ PatientId: 1, ReferralId: 2 }];
    const response_data = {
      DoAssessmentResponse: {
        DoAssessmentResult: {
          AssessmentStep: {
            Questions: [1, 2, 3]
          }
        }
      }
    };
    component.onCurrentAssessmentComplete(response_data);
  });
  xit('should call - selectOption', () => {
    spyOn(component, 'isenableNext').and.stub();
    component.selectOption({ QuestionId: 11 }, '0');
  });
  it('should call - selectOption else', () => {
    spyOn(component, 'isenableNext').and.stub();
    component.selectOption({ QuestionId: 11, Answer: [1, 2, 3] }, '1');
  });
  it('should call - omit_special_char', () => {
    component.omit_special_char({ charCode: 11 });
  });
  it('should call - updateCheckedOptions', () => {
    component.updateCheckedOptions(
      { target: { checked: true } },
      'None',
      'test',
      1
    );
  });
  it('should call - updateCheckedOptions', () => {
    component.updateCheckedOptions(
      { target: { checked: true } },
      'Prefer not to answer',
      'test',
      1
    );
  });
  it('should call - updateCheckedOptions', () => {
    component.updateCheckedOptions(
      { target: { checked: true } },
      'Prefe',
      'test',
      1
    );
  });
  it('should call - updateCheckedOptions', () => {
    component.updateCheckedOptions(
      { target: { checked: false } },
      'Prefe',
      'test',
      1
    );
  });
  it('should call - closeModalDialog', () => {
    component.closeModalDialog();
  });

  it('should call - checkInterventions', () => {
    component.checkInterventions();
  });

  it('should call - ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('should call - isenableNext', () => {
    component.isenableNext();
  });

  it('should call - onTextAreaChange', () => {
    component.onTextAreaChange('', '');
  });

  it('should call - onTextAreaChange - else', () => {
    component.onTextAreaChange('test', '');
  });
  it('should call - routeToNextPath', () => {
    spyOn(router, 'navigate').and.stub();
    localStorage.setItem('ca-path-refill-remainder', JSON.stringify('test'));
    component.queryParameters = 'test';
    component.routeToNextPath();
  });
  it('should call - routeToNextPath1', () => {
    spyOn(router, 'navigate').and.stub();
    localStorage.setItem('refill-remainder-params', JSON.stringify('test'));
    component.queryParameters = 'test';
    component.routeToNextPath();
  });
});
