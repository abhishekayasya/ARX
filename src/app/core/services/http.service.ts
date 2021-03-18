import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Http,
  Response,
  RequestOptions,
  Headers,
  URLSearchParams
} from '@angular/http';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';

// Service to perform http requests and retrieve json data.
@Injectable()
export class HttpClientService {
  private options;
  // Service constructor for injecting angular http handler.
  constructor(
    // tslint:disable-next-line: deprecation
    private _http: Http,
    private http: HttpClient,
    private router: Router,
    private _appContext: AppContext,
    private _messageService: MessageService,
    private _common: CommonUtil,
    private _cookieService: CookieService
  ) {
    this.options = this.setRequestOptions();
  }

  getDataWithParams(url: string, data: any) {
    this.preRequestHandler();
    let params = new HttpParams();
    const keys = Object.keys(data);

    for (const prop of keys) {
      params = params.append(prop, data[prop]);
    }

    this.options.params = params;
    return this.http
      .get(this.prepareServiceUrl(url), this.options)
      .pipe(catchError(this.handleError));
  }

  getData(url: string, retainMessages: boolean = false): Observable<any> {
    this.preRequestHandler(retainMessages);
    url = this.addTimeStamp(url);
    return this.http
      .get(this.prepareServiceUrl(url), this.options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get request.
   *
   * @param url
   * @param retainMessages
   */
  getRequest(
    url: string,
    dataType: string,
    withCredentials: boolean = true
  ): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': dataType,
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT'
      }),
      withCredentials: withCredentials
    };
    url = this.addTimeStamp(url);
    return this.http.get(url, httpOptions).pipe(catchError(this.handleError));
  }

  /**
   * Adding time stamp as query parameter in url.
   * this will help in cache burst for get requests.
   *
   * @param {string} url
   * @returns {string}
   */
  addTimeStamp(url: string): string {
    if (url.indexOf('?') === -1) {
      url = `${url}?rmdt=${new Date().getTime()}`;
    } else {
      url = `${url}&rmdt=${new Date().getTime()}`;
    }

    return url;
  }

  private setRequestOptionsCCToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
        Authorization: 'Bearer ' + this._cookieService.get('jwt')
      }),
      withCredentials: true,
      observe: 'response'
    };

    return httpOptions;
  }

  postData(
    url: string,
    data: any,
    omitFlow: boolean = false,
    retainMessages: boolean = false
  ): Observable<any> {
    this.preRequestHandler(retainMessages);
    if (data !== undefined && data !== null && !omitFlow) {
      data['flow'] = 'ARX';
    }
    return this.http
      .post(this.prepareServiceUrl(url), JSON.stringify(data), this.options)
      .pipe(catchError(this.handleError));
  }

  postRxData(
    url: string,
    data: any,
    omitFlow: boolean = false,
    retainMessages: boolean = false
  ): Observable<any> {
    this.preRequestHandler(retainMessages);

    return this.http
      .post(this.prepareServiceUrl(url), JSON.stringify(data), this.options)
      .pipe(catchError(this.handleError));
  }

  postAuthData(
    url: string,
    data: any,
    omitFlow: boolean = false,
    retainMessages: boolean = false
  ): Observable<any> {
    this.preRequestHandler(retainMessages);
    const getDeviceInfo = sessionStorage.getItem('deviceinfo');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        deviceInfo: getDeviceInfo,
        observe: 'response'
      })
    };
    if (data !== undefined && data !== null && !omitFlow) {
      data['flow'] = 'ARX';
    }

    return this.http
      .post(this.prepareServiceUrl(url), JSON.stringify(data), httpOptions)
      .pipe(catchError(this.handleError));
  }

  postNullData(url: string): Observable<any> {
    return this.http
      .post(this.prepareServiceUrl(url), this.options)
      .pipe(catchError(this.handleError));
  }

  putData(url: string, data: any, omitFlow: boolean = false): Observable<any> {
    this.preRequestHandler();
    if (data !== undefined && data !== null && !omitFlow) {
      data['flow'] = 'ARX';
    }
    return this.http
      .put(this.prepareServiceUrl(url), JSON.stringify(data), this.options)
      .pipe(catchError(this.handleError));
  }

  deleteData(
    url: string,
    data: any = {},
    omitFlow: boolean = false
  ): Observable<any> {
    this.preRequestHandler();
    if (data !== undefined && data !== null && !omitFlow) {
      data['flow'] = 'ARX';
    }

    return this.delete(this.prepareServiceUrl(url), data);
  }

  private handleError(error: any) {

    console.error("HttpClientService.handleError: ", error);
    
    //return an ErrorObservable with a user-facing error message
    return new ErrorObservable('Something bad happened.  Please try again later.');
  }

  // Execute get request and return promise to process response.
  // tslint:disable-next-line: deprecation
  doGet(url: string, prepareUrl: boolean = true): Promise<Response> {
    this.preRequestHandler();
    const requestOptions = this.baseRequestOptions();
    url = this.addTimeStamp(url);
    const promise = this._http
      .get(prepareUrl ? this.prepareServiceUrl(url) : url, requestOptions)
      .toPromise();
    return promise;
  }

  // Execute get request with query parameters.
  // Returning a Promise for response.
  // tslint:disable-next-line: deprecation
  doGetWithParameters(
    url: string,
    // tslint:disable-next-line: deprecation
    parameters: URLSearchParams
    // tslint:disable-next-line: deprecation
  ): Promise<Response> {
    this.preRequestHandler();
    const requestOptions = this.baseRequestOptions();
    requestOptions.params = parameters;

    const promise = this._http
      .get(this.prepareServiceUrl(url), requestOptions)
      .toPromise();
    return promise;
  }

  // Executing http post request with provided request body
  // and request options.
  //
  // Will provide promise to manage post response.
  // tslint:disable-next-line: deprecation
  doPost(url: string, body: any, headerOptions?: any): Promise<Response> {
    this.preRequestHandler();

    const requestOptions = headerOptions
      ? headerOptions
      : this.baseRequestOptions()
    if (body !== undefined && body !== null) {
      body['flow'] = 'ARX';
    }
    const promise = this._http
      .post(this.prepareServiceUrl(url), body, requestOptions)
      .toPromise();
    return promise;
  }

  // tslint:disable-next-line: deprecation
  doPostWFlow(url: string, body: any, headerOptions?: any): Promise<Response> {
    this.preRequestHandler();

    const requestOptions =
      headerOptions === undefined ? this.baseRequestOptions() : headerOptions;
    const promise = this._http
      .post(this.prepareServiceUrl(url), body, requestOptions)
      .toPromise();
    return promise;
  }

  // this is for login with deviceinfo
  // tslint:disable-next-line: deprecation
  doPostLogin(url: string, body: any, deviceinfo: any): Promise<Response> {
    this.preRequestHandler();
    const requestOptions = this.baseRequestOptionsLogin(deviceinfo);
    if (body !== undefined && body !== null) {
      body['flow'] = 'ARX';
    }
    const promise = this._http
      .post(this.prepareServiceUrl(url), body, requestOptions)
      .toPromise();
    return promise;
  }

  // Executing http put request with provided request body
  // and request options.
  //
  // Will provide promise to manage post response.
  // tslint:disable-next-line: deprecation
  doPut(url: string, body: any, setRandomHeader?: boolean): Promise<Response> {
    this.preRequestHandler();
    const requestOptions = this.baseRequestOptions(setRandomHeader);
    if (body !== undefined && body !== null) {
      body['flow'] = 'ARX';
    }
    const promise = this._http
      .put(this.prepareServiceUrl(url), body, requestOptions)
      .toPromise();
    return promise;
  }

  // Preparing full service url with service host and resource.
  private prepareServiceUrl(url: string): string {
    let serviceUrl: string;
    if (url.startsWith('https')) {
      serviceUrl = url;
    } else if (url.startsWith('/svc/member')) {
      serviceUrl = this._appContext.serviceHost + url;
    } else if (url.startsWith('/svc')) {
      serviceUrl = this._appContext.serviceHost + '/svc' + url;
    } else if (url.startsWith('/rx-creditcard')) {
      serviceUrl = this._appContext.serviceHost + url;
    } else if (url.startsWith('/arxwp')) {
      serviceUrl = this._appContext.serviceHost + url;
    } else if (url.startsWith('/dca')) {
      serviceUrl = this._appContext.serviceHost + url;
    } else if (url.startsWith('/ebm')) {
      serviceUrl = this._appContext.serviceHost + url;
    } else if (url.startsWith('/')) {
      serviceUrl =
        this._appContext.serviceHost + this._appContext.serviceUrlPrefix + url;
    } else if (url.startsWith('#')) {
      serviceUrl = url.replace('#', '/');
    } else if (url.startsWith('http://')) {
      serviceUrl = url;
    } else {
      serviceUrl =
        this._appContext.serviceHost +
        this._appContext.serviceUrlPrefix +
        '/' +
        url;
    }
    return serviceUrl;
  }

  // Base request options for all service requests.
  // tslint:disable-next-line: deprecation
  private baseRequestOptions(setRandomHeader?: boolean): RequestOptions {
    // tslint:disable-next-line: deprecation
    const opts = new RequestOptions();
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    if (setRandomHeader) {
      headers.append(
        'assessment-request-id',
        'digital-assess-id-' + Math.ceil(Math.random() * 1000000)
      );
    }
    opts.headers = headers;
    opts.withCredentials = true;
    return opts;
  }

  // this is only for login service
  // tslint:disable-next-line: deprecation
  private baseRequestOptionsLogin(deviceinfo): RequestOptions {
    // tslint:disable-next-line: deprecation
    const opts = new RequestOptions();
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('deviceInfo', deviceinfo);
    opts.headers = headers;
    opts.withCredentials = true;
    return opts;
  }

  private setRequestOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT'
      }),
      withCredentials: true
    };

    return httpOptions;
  }

  /**
   * Actions needed to perform before sending a request.
   */
  preRequestHandler(retainMessages: boolean = false): void {
    // clearing all messages on screen.
    if (!retainMessages) {
      this._messageService.clear();
    }
  }

  private delete(url: string, data: any): Observable<any> {
    return Observable.create(function(observable) {
      const xhttp = new XMLHttpRequest();
      xhttp.open('DELETE', url, true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.withCredentials = true;

      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            observable.next(JSON.parse(xhttp.response));
            observable.completed();
          } else {
            observable.error(xhttp.response);
          }
        }
      };

      if (data) {
        xhttp.send(JSON.stringify(data));
      } else {
        xhttp.send('');
      }
    });
  }
}
