import {Injectable} from '@angular/core';
import {AppContext} from '@app/core/services/app-context.service';
import {ActivatedRoute} from '@angular/router';
import {CoreConstants} from '@app/config/core.constant';

@Injectable()
export class ResetPasswordService {

  static CONST = {
    resetToken : 'rsPL'
  };
  public state = '';

  public invalidTokenMessage = '';

  phones: any[];
  email: string;

  public username: string;

  authOptionClicked: string;

  constructor(
    public appContext: AppContext
  ) {}


  public processResetPasswordRequest(): Promise<boolean> {
    const promise = new Promise<boolean>((resolve, rejset) => {
      resolve(true);
    });
    return promise;
  }
}
