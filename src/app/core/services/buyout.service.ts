import { Injectable } from '@angular/core';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { HttpClientService } from '@app/core/services/http.service';
import { Microservice } from '@app/config';
import { UserService } from './user.service';

@Injectable()
export class BuyoutService {
  constructor(
    private _http: HttpClientService,
    private _userService: UserService
  ) {}

  available(profileId: string): Observable<any> {
    const requestData = {
      fId: ''
    };
    // istanbul ignore else
    if (profileId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = profileId;
    }
    return this._http.postData(Microservice.buyout_status, requestData);
  }
}
