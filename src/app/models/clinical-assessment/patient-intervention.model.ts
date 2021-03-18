export interface GetPatientInterventionsModel {
    GetPatientInterventions: InterventionRequestModel;
}

interface InterventionRequestModel {
    request: InterventionRequestDataModel;
}

interface InterventionRequestDataModel {
    Header: InterventionHeaderModel;
    Identification: InterventionIdentificationModel;
    Criteria: InterventionCriteriaModel;
}

interface InterventionHeaderModel {
    SystemName: string;
    RequestId: string;
    Username: string;
    UserType: string;
}

interface InterventionIdentificationModel {
    PatientId: string;
}

interface InterventionCriteriaModel {
    Collaborator: InterventionCollaboratorModel;
    BusinessProcessName: string;
    ReferralId: string;
}

interface InterventionCollaboratorModel {
    LoginName: string;
}
