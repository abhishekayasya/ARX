import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/core/services/message.service';
import { ROUTES } from '@app/config';

declare let ga;

@Component({
    selector: 'arxrf-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    host: {
        '(document:click)': 'resetIdleTimer()',
        '(document:keyup)': 'resetIdleTimer()',
        '(document:visibilitychange)': 'visibilityChange()',
        '(window:unload)': 'unload()',
    }
})

export class RootComponent implements OnInit, OnDestroy {
    processingSSO = false;

    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    private idleInterval = null;
    public showRootMessage = false;
    private lastRefreshTime = Date.now();

    constructor(
        private _commonUtil: CommonUtil,
        private eltRef: ElementRef,
        private _router: Router,
        public appContext: AppContext,
        private _userService: UserService,
        private _messageService: MessageService
    ) {
        // Initializing parameters need for application context.
        this.initApplicationContext(eltRef);

        /*
          event subscription to manage window scroll on router change.
         */
        this._router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this._messageService.clear();
                if (event.url !== this.lastPoppedUrl) {
                    this.yScrollStack.push(window.scrollY);
                }
            } else if (event instanceof NavigationEnd) {
                // removing root loading on route complete.
                this.appContext.rootLoaderState = false;

                if (event.url === this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else {
                    window.scrollTo(0, 0);
                }

                try {
                    if (sessionStorage.getItem('ga_state') == null) {
                        const tracker = ga.getAll()[0];
                        if (tracker) {
                            tracker.set('page', event.urlAfterRedirects);
                            tracker.send('pageview');
                        }
                    }
                } catch (e) {
                    console.log('ga object not initialized');
                }

                if (sessionStorage.getItem('ga_state') != null) {
                    sessionStorage.removeItem('ga_state');
                }
            }
        });
    }

    ngOnInit() {
        const siteKey = this.appContext.sitekey;
        // this.appContext.setSitekey('sparxweb');
        //console.log('SITEKEY IN ROOT COMPONENT::', siteKey);

        console.log("RootComponent.ngOnInit()");
        this.lastRefreshTime = Date.now();
        this.showRootMessage = false;

        if(this.idleInterval != null) {
            console.log("this.idleInterval: ", this.idleInterval);
            clearInterval(this.idleInterval);
        }

        this.idleInterval = setInterval(this.idleCheck.bind(this), 60000);
    }

    ngOnDestroy() {
        console.log("RootComponent.ngOnDestroy()");
    }

    unload() {
        clearInterval(this.idleInterval);
        console.log("RootComponent.unload()");
    }

    // Will be called on root element ready, to prepare style element of root element.
    getStyle() {
        const style = {
            // "min-height": this._commonUtil.windowHeight() + "px"
        };

        return style;
    }

    // function to prepare application context on root element load.
    // Adding basic parameters to be used over application.
    initApplicationContext(eltRef: ElementRef) {
        this.appContext.rootEltRef = eltRef;

        // Check for sso availability and initiate sso login.
        if (
            eltRef.nativeElement.getAttribute(AppContext.CONST.ssoContentAttr) !==
            undefined &&
            eltRef.nativeElement.getAttribute(AppContext.CONST.ssoContentAttr) !==
            null &&
            eltRef.nativeElement.getAttribute(AppContext.CONST.ssoContentAttr) !== ''
        ) {
            // SSO initiation
            this.processingSSO = true;
            this.appContext.ssoContent = eltRef.nativeElement.getAttribute(
                AppContext.CONST.ssoContentAttr
            );
            this._router.navigateByUrl(ROUTES.sso.absoluteRoute);
        }
    }

    calcIdleMinutes(): number {
        return (Date.now() - this.lastRefreshTime) / 60000;
    }

    // called every minute or when the page/tab becomes visible
    idleCheck() {
        let idleMinutes = this.calcIdleMinutes();
        console.log("idleMinutes: ", idleMinutes);

        // we only care if there is a user logged in or in the process of registering
        console.log("hasJWT(): ", this._userService.hasJWT());
        console.log("checkCookie(): ", this._userService.checkCookie('jwt'));
        if (this._userService.hasJWT() ||
                this._router.url.startsWith(ROUTES.registration.absoluteRoute)) {
            console.log("jwt exists or on /register route");
            if (idleMinutes >= 15.0) {
                console.log("User as been idle for more than 15 minutes, redirecting to logout ...");
                this.showRootMessage = false;
                this._userService.logoutSession().then(resp => {
                    this._commonUtil.disableLeaveSiteConfirmation();
                    this._commonUtil.navigate(ROUTES.login.absoluteRoute);
                    // this._router.navigateByUrl(ROUTES.login.absoluteRoute);
                }).catch(err => {
                    this._commonUtil.disableLeaveSiteConfirmation();
                    this._commonUtil.navigate(ROUTES.login.absoluteRoute);
                    // this._router.navigateByUrl(ROUTES.login.absoluteRoute);
                });
            } else if (idleMinutes >= 13.0) {
                console.log("User has been idle for more than 13 minutes, showing warning message");
                this.showRootMessage = true;
            }
        } else {
            console.log("no jwt or not on /register route");
            this.lastRefreshTime = Date.now();
        }
    }

    // resets idle time on key stroke or click
    resetIdleTimer() {
        if (this.calcIdleMinutes() < 15.0) {
            this.lastRefreshTime = Date.now();
        }
    }

    // method is invoked when user clicks on idle logout warning message
    hardResetIdleTimer() {
        console.log("hardResetIdleTimer()");
        this.showRootMessage = false;
        this.lastRefreshTime = Date.now();
        this._userService.callRefreshToken();
    }

    // in the case of a mobile device where the browser is suspended, the timer will also be suspended
    // so we must check when page becomes visible.
    visibilityChange() {
        console.log("visibilityChange()");
        if (document.visibilityState === 'visible') {
            this.idleCheck();
        }
    }
}
