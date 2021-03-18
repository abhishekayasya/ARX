import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {UserService} from '@app/core/services/user.service';
import {HttpClientService} from '@app/core/services/http.service';
import {RegistrationService} from '@app/core/services/registration.service';

@Injectable()
export class NewInsuranceService {

  allergiesSelected = {};
  healthConditionsSelected = {};

  public insuranceInfo = {
    msEnrollInsuranceBeanForm: {
      msInsProvider: '',
      msInsChId: '',
      msInsGroupNbr: '',
      msInsCardholderName: '',
      msInsCardholderBirthMonth: '0',
      msInsCardholderBirthDay: '0',
      msInsCardholderBirthYear: 0
    },

    allergysList: [],
    healthConditionList: [],
    submitService: true
  };

  constructor(
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _regService: RegistrationService
  ) {}

  cacheInsuranceInformation(insuranceInformationForm: FormGroup) {
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderName
      = insuranceInformationForm.value.cardholderName;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsProvider
      = insuranceInformationForm.value.planName;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsGroupNbr
      = insuranceInformationForm.value.groupNumber;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsChId
      = insuranceInformationForm.value.memberNumber;

    this.prepareCHDOB(insuranceInformationForm.value.cardholderDOB);
  }

  prepareCHDOB(dateString: string) {
    const dob = new Date(dateString);

    let month = (dob.getMonth() + 1).toString();
    let day = dob.getDate().toString();
    month = month.length === 1 ? '0' + month : '' + month;
    day = day.length === 1 ? '0' + day : '' + day;

    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthDay
      = day;
    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthMonth
      = month;

    this.insuranceInfo.msEnrollInsuranceBeanForm.msInsCardholderBirthYear
      = dob.getFullYear();
  }
}
