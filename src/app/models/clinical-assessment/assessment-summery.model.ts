export interface AssessmentSummeryModel {
    GetAssessmentSummary: AssessmentSummeryRequestModel;
}

interface AssessmentSummeryRequestModel {
    request: AssessmentSummeryRequestDataModel;
}

interface AssessmentSummeryRequestDataModel {
    Header: AssessmentSummeryHeaderModel;
    Identification: AssessmentSummeryIdentificationModel;
    SurveyId: string;
}

interface AssessmentSummeryHeaderModel {
    SystemName: string;
    RequestId: string;
    Username: string;
    UserType: string;
}

interface AssessmentSummeryIdentificationModel {
    PatientId: string;
    ExternalPatientId: string;
}
