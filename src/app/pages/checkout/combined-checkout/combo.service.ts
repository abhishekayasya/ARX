import { Injectable } from '@angular/core';
import { CHECKOUT } from 'app/config/checkout.constant';

@Injectable()
export class ComboService {
  loader = false;
  loaderOverlay;
  boolean = false;

  hideHead = false;
  comboState: string = CHECKOUT.type.HD;

  constructor() {}
}
