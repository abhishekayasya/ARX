import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ROUTES } from '@app/config';
import { AssessmentComponent } from './component/assessment/assessment.component';
import { CommonUtil } from '@app/core/services/common-util.service';

@Injectable()
export class ClinicalAssessmentGuard
  implements CanDeactivate<AssessmentComponent> {
  constructor(private _router: Router, private _common: CommonUtil) {}

  canDeactivate(
    component: AssessmentComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const next1: string = nextState.url;

    if (next1 === '/manageprescriptions' || next1 === '/myaccount') {
      if (next1 === '/myaccount') {
        this._common.navigate(ROUTES.refill.route);
        return false;
      }
      return true;
    }
    return true;
  }
}
