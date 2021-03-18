export interface AssessmentRequestModel {
    DoAssessment: DoAssessmentModel;
}

interface DoAssessmentModel {
    request: AssessmentReqModel;
}

interface AssessmentReqModel {
    Header: AssessmentHeaderModel;
    Identification: AssessmentIdentificationModel;
    QuestionAnswers ?: AssessmentQuestionAnswerModel;
    LastCompletedAssessmentStepId: string;
    AssessmentId: string;
    AutoSaveAssessmentStep: string;
}

interface AssessmentHeaderModel {
    SystemName: string;
    RequestId: string;
    Username: string;
    UserType: string;
}

interface AssessmentIdentificationModel {
    PatientId: string;
}

interface AssessmentQuestionAnswerModel {
    QuestionAnswerType: Array<AssessmentQuestionAnswerTypeModel>;
}

interface AssessmentQuestionAnswerTypeModel {
    Answer: string;
    QuestionId: string;
}
