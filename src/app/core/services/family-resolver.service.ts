import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class FamilyMembersResolver implements Resolve<any> {
  constructor(private http: HttpClientService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.http
      .doPost('/familymgmt/csrf-disabled/members/fullaccess', {})
      .then(response => {
        const json = response.json();
        return json.members;
      })
      .catch(ex => {
        console.error(ex);
      });
  }
}
