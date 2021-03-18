import { Injectable, OnDestroy } from "@angular/core";
import { HttpClientService } from "@app/core/services/http.service";
import { fromPromise } from "rxjs/observable/fromPromise";
// tslint:disable-next-line: import-blacklist
import { Observable, Subject, Subscription } from "rxjs";
import { delay, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs/observable/forkJoin";
import { CAConstants } from "./model/clinical-assessment.constant";
import { of } from "rxjs/observable/of";
import { CheckoutService } from "@app/core/services/checkout.service";

@Injectable()
export class ClinicalAssessmentService implements OnDestroy {
  referralData = [];
  assessmentData = [];
  activePatientId;
  activeReferralId;
  currentAssessmentUser = [];

  // State management variables ----------------------------------------------
  assessmentState = new Subject<
    Array<{
      patientId: number;
      surveyId: number;
      intervention?: any;
      done: boolean;
    }>
  >();
  assessmentStateData = [];
  InterventionState = new Subject<Array<any>>();
  interventionStateData = [];

  subscription1: Subscription;
  subscription2: Subscription;
  currentIntervention: any;
  GetPatientDatabaseException = false;

  tempReferralId;
  // -------------------------------------------------------------------------

  constructor(
    private _http: HttpClientService,
    private router: Router,
    private _checkoutService: CheckoutService
  ) {
    this.subscription1 = this.assessmentState.subscribe((currState: any) => {
      this.assessmentStateData = [] = currState;
      this.interventionStateData = [] = currState;
      this.processReferralData(currState.find(val => val.done === false));
      this.setLocalState("ca-state", currState);
    });
    this.subscription2 = this.InterventionState.subscribe((state: any) => {
      this.interventionStateData = state;
      this.setLocalState("ca-state", state);
      this.currentIntervention = state.find(val => val.done === false);
    });
  }

  // LOCALSTORAGE functions
  setLocalState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocalState(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  // API calling methods --------------------------------------------------------
  patientReferralCall(data?: any): Observable<any> {
    if (data) {
      return this._checkoutService.deliveryOptions(data);
    } else {
      return this._checkoutService.deliveryOptions();
    }
  }

  getFidBySmId(smId: string): Observable<any> {
    return this._checkoutService.getPatientIdBySmId(smId);
  }

  getPatientInterventionCall(data?: any): Observable<any> {
    return fromPromise(
      this._http.doPost(
        CAConstants.getPatientInterventions,
        this.generatePayload(1, data),
        true
      )
    ).pipe(catchError(() => of((this.GetPatientDatabaseException = true))));
  }

  doAssessmentCall(data?: any): Observable<any> {
    return fromPromise(
      this._http.doPost(CAConstants.doAssessment, data, true)
    ).pipe(catchError((err) => {
      console.log(err)
      return  of(err)}))
  }

  updateAssessmentCall(): Observable<any> {
    return fromPromise(
      this._http.doPost(
        CAConstants.updatePatientIntervention,
        this.generatePayload(5),
        true
      )
    ).pipe(delay(500));
  }

  // Process Patient Percepition
  processReferralData(refdata) {
    if (refdata) {
      this.assessmentData = [];
      const callList = refdata.reduce(
        (sum, data) =>
          (sum = [
            ...sum,
            this.getPatientInterventionCall([data.PatientId, data.ReferralId])
          ]),
        []
      );
      forkJoin(callList).subscribe(
        (response: any) => {
          response.map((data, i) =>
            this.processPatientIntervention(refdata[i], data)
          );
          this.InterventionState.next(this.assessmentData);
        },
        error => {}
      );
    }
  }
  processPatientIntervention(refdata: any, response: any) {
    let localAssessmentdata = {};
    if (response && response.type === 2 && response.status === 200) {
      const data = response.json();
      if (
        data &&
        data.GetPatientInterventionsResponse.GetPatientInterventionsResult
          .Status.StatusCode !== ""
      ) {
        this.GetPatientDatabaseException = true;
      } else if (
        data &&
        data["GetPatientInterventionsResponse"][
          "GetPatientInterventionsResult"
        ]["BusinessProcesses"]["BusinessProcess"] &&
        data["GetPatientInterventionsResponse"][
          "GetPatientInterventionsResult"
        ]["BusinessProcesses"]["BusinessProcess"]["WorkStages"]["WorkStage"]
      ) {
        this.currentAssessmentUser =
          data["GetPatientInterventionsResponse"][
            "GetPatientInterventionsResult"
          ]["Patient"];

        for (const pval of data["GetPatientInterventionsResponse"][
          "GetPatientInterventionsResult"
        ]["BusinessProcesses"]["BusinessProcess"]["WorkStages"]["WorkStage"]) {
          if (pval && pval["Interventions"]["Intervention"]) {
            if (!Array.isArray(pval["Interventions"]["Intervention"])) {
              const item = pval.Interventions.Intervention;
              delete pval.Interventions.Intervention;
              pval.Interventions.Intervention = [item];
            }
            for (const val of pval["Interventions"]["Intervention"]) {
              if (
                val &&
                val["Activities"]["Activity"] &&
                val["WorkStepName"]
                // && val['WorkStepName'].replace(/\s/g, '').toLowerCase() === 'pccrefillassessment'
              ) {
                const activitylocal = Array.isArray(
                  val["Activities"]["Activity"]
                )
                  ? val["Activities"]["Activity"]
                  : [val.Activities.Activity];
                const activitydata = [];
                for (const cval of activitylocal) {
                  activitydata.push({
                    id: cval["Assessment"]["AssessmentProtocolId"],
                    doAssessmentLastStepId: 0,
                    doAssessmenTrackingId: null,
                    answer: [],
                    done: false
                  });
                }
                localAssessmentdata = {
                  name: refdata["name"],
                  PatientId: refdata["PatientId"],
                  ReferralId: refdata["ReferralId"],
                  PatientInterventionId: val["PatientInterventionId"],
                  AssessmentIds: activitydata,
                  done: false
                };

                this.assessmentData.push(localAssessmentdata);
              }
            }
          }
        }
      }
    }
  }

  // To generate payload four type of payload:
  // 1. GetPatientInterventions:
  // 2. DoAssessment:
  // 3. DoAssessment(for Q/A):
  // 4. GetAssessmentSummary:
  // 5. UpdatePatientIntervention:
  generatePayload(type, currentState?, formAnswer?) {
    if (this.currentIntervention) {
      this.tempReferralId = this.currentIntervention.ReferralId;
    }
    const _header = {
      SystemName: "WagEcomm",
      RequestId: "23",
      Username: "WAGECOMM",
      UserType: "self"
    };
    const _identification = {
      PatientId: this.currentIntervention
        ? this.currentIntervention["PatientId"].toString()
        : ""
    };
    switch (type) {
      case 1:
        const [patientId, referralId] = currentState;
        return {
          GetPatientInterventions: {
            request: {
              Header: _header,
              Identification: { PatientId: patientId },
              Criteria: {
                Collaborator: {
                  LoginName: "WAGECOMM"
                },
                BusinessProcessName: "referral",
                ReferralId: referralId
              }
            }
          }
        };
      case 2:
        return {
          DoAssessment: {
            request: {
              Header: _header,
              Identification: _identification,
              LastCompletedAssessmentStepId: "0",
              AssessmentId: this.currentIntervention.AssessmentIds[
                currentState
              ]["id"].toString(),
              AutoSaveAssessmentStep: "1"
            }
          }
        };
      case 3:
        return {
          DoAssessment: {
            request: {
              Header: _header,
              Identification: _identification,
              QuestionAnswers: {
                QuestionAnswerType: this.currentIntervention.AssessmentIds[
                  currentState
                ]["answer"]
              },
              LastCompletedAssessmentStepId: this.currentIntervention
                .AssessmentIds[currentState]["doAssessmentLastStepId"],
              AssessmentTrackingId: this.currentIntervention.AssessmentIds[
                currentState
              ]["doAssessmenTrackingId"],
              AssessmentId: this.currentIntervention.AssessmentIds[
                currentState
              ]["id"].toString(),
              AutoSaveAssessmentStep: "1",
              Criteria: {
                ReferralId: this.currentIntervention.ReferralId
              }
            }
          }
        };
      case 4:
        return {
          GetAssessmentSummary: {
            request: {
              Header: _header,
              Identification: {
                ..._identification,
                ExternalPatientId: ""
              },
              SurveyId: ""
            }
          }
        };
      case 5:
        return {
          UpdatePatientIntervention: {
            updatePatientInterventionRequest: {
              Header: _header,
              Identification: {
                ..._identification,
                BusinessProcessName: "referral",
                PatientInterventionId: +this.currentIntervention[
                  "PatientInterventionId"
                ],
                Collaborator: {
                  LoginName: "WAGECOMM"
                }
              },
              Outcome: {
                OutcomeStatusId: 3,
                OutcomeSubStatusId: 3,
                OutcomeNotes: "Done",
                WorkStepStatusId: 100
              }
            }
          }
        };
      default:
        return false;
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
