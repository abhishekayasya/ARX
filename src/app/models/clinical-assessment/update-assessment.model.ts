export interface UpdateAssessmentModel {
    UpdatePatientIntervention: UpdateAssessmentRequestModel;
}

interface UpdateAssessmentRequestModel {
    updatePatientInterventionRequest: UpdateAssessmentRequestDataModel;
}

interface UpdateAssessmentRequestDataModel {
    Header: AssessmentHeaderModel;
    Identification: AssessmentIdentificationModel;
    Outcome: AssessmentOutcomeModel;
}

interface AssessmentHeaderModel {
    SystemName: string;
    RequestId: string;
    Username: string;
    UserType: string;
}

interface AssessmentIdentificationModel {
    PatientId: string;
    BusinessProcessName: string;
    PatientInterventionId: number;
    Collaborator: AssessmentCollobaratorModel;
}

interface AssessmentCollobaratorModel {
    LoginName: string;
}

interface AssessmentOutcomeModel {
    OutcomeStatusId: number;
    OutcomeSubStatusId: number;
    OutcomeNotes: string;
    WorkStepStatusId: number;
}
