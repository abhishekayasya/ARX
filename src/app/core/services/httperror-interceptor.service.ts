import { ROUTES } from '../../config/routes.constant';
import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CommonUtil } from './common-util.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import { UserService } from './user.service';
import { AppContext } from './app-context.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    servicePrefixes = ['/svc', '/rx-creditcard', '/ebm', '/dca', '/api'];

    ignoreErrorPaths = [
        '/api/rx-psm',
        '/api/rx-druginfo',
        '/api/productsearch',
        '/api/rx-settings/csrf-disabled/svc/insurance/status',
        '/api/rx-refillhub/csrf-disabled/buyout/status/ARX',
        '/api/account/csrf-disabled/commpref/consent',
        '/dca',
        '/api/rx-status/csrf-disabled/fillhistory',
        '/rx-profile/csrf-disabled/hipaa'
    ];

    constructor(
        private _common: CommonUtil,
        private _userService: UserService,
        private appContext: AppContext) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return <any>next.handle(req)
            .catch((error: HttpErrorResponse) => {
                console.log('HttpErrorInterceptor.catch: ', error);

                let pathname = req.url;
                if (pathname.startsWith('http')) {
                    pathname = new URL(req.url).pathname;
                }

                if ((error.status === 401 || error.status === 403) && this.isServiceUrl(pathname)) {
                    // If a service request returns a 401/403 then the safest thing is to logout
                    // the user and force them to relogin to generate a new access token
                    console.log('Received 401/403, redirecting to logout ...');
                    this._userService
                        .logoutSession()
                        .then(res => {
                            this._common.navigate(ROUTES.login.absoluteRoute);
                        })
                        .catch(err => {
                            this._common.navigate(ROUTES.login.absoluteRoute);
                        });
                } else if (error.status >= 500 && this.isCritical(pathname)) {
                    console.log('Received critical 5XX , showing error page ...')
                    this.appContext.showGatewayError.next(true);
                } else if (error.status === 404) {
                    console.log('Received 404, doing nothing ...');
                }

                return Observable.throw(error.error);
            });
    }

    // checks if the request path belongs to a a service url
    private isServiceUrl(requestPath: string) {
        let flag = false;
        for (const prefix of this.servicePrefixes) {
            if (requestPath.startsWith(prefix)) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    // checks if errors on the request path should be ignored
    private isCritical(requestPath) {
        let flag = true;
        for (const path of this.ignoreErrorPaths) {
            if (requestPath.startsWith(path)) {
                flag = false;
                break;
            }
        }
        return flag;
    }
}
