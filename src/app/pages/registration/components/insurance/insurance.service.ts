import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {UserService} from '@app/core/services/user.service';
import {HttpClientService} from '@app/core/services/http.service';
import {RegistrationService} from '@app/core/services/registration.service';

@Injectable()
export class InsuranceService {

  allergiesSelected = {};
  healthConditionsSelected = {};

  constructor(
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _regService: RegistrationService
  ) {}

  cacheInsuranceInformation(insuranceInformationForm: FormGroup) {
    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderName
      = insuranceInformationForm.value.cardholderName;
    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsProvider
      = insuranceInformationForm.value.planName;
    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsGroupNbr
      = insuranceInformationForm.value.groupNumber;
    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsChId
      = insuranceInformationForm.value.memberNumber;

    this.prepareCHDOB(insuranceInformationForm.value.cardholderDOB);
  }

  prepareCHDOB(dateString: string) {
    const dob = new Date(dateString);

    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthDay
      = dob.getDate();
    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth
      = dob.getMonth() + 1;

    this._regService.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthYear
      = dob.getFullYear();
  }
}
