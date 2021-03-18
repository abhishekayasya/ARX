import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeDeliveryService {
  hideHead = false;
  showbanner = true;

  globalBannerHide = new BehaviorSubject<boolean>(false);
  globalBannerHideObs = this.globalBannerHide.asObservable();
  
  constructor() {}
}
