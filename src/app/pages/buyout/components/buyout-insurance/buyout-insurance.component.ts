import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { Microservice } from '@app/config';

@Component({
  selector: 'arxrf-buyout-insurance',
  templateUrl: './buyout-insurance.component.html',
  styleUrls: ['./buyout-insurance.component.scss']
})
export class BuyoutInsuranceComponent implements OnInit {
  insuaranceStatus: string;
  loaderState = true;
  constructor(
    private _http: HttpClientService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.getInsuranceStatus();
  }

  getInsuranceStatus() {
    const activeMemId = this.userService.getActiveMemberId();

    const requestData = {
      fId: ''
    };

    if (activeMemId === this.userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemId;
    }

    this._http.postData(Microservice.retrieve_insurance, requestData).subscribe(
      response => {
        this.loaderState = false;
        if (
          response.msEnrollInsuranceBeanForm.msInsStatusCd &&
          response.msEnrollInsuranceBeanForm.msInsStatusCd <= 2
        ) {
          this.insuaranceStatus = 'Yes';
        } else {
          this.insuaranceStatus = 'No';
          sessionStorage.setItem('insurance_info', JSON.stringify(response));
        }
      },
      err => {
        this.loaderState = false;
        this.insuaranceStatus = 'No';
      }
    );
  }
}
