import {Injectable} from '@angular/core';
import {HttpClientService} from '@app/core/services/http.service';
import {Observable} from 'rxjs/Observable';
import {AppContext} from './app-context.service';

/**
 * Service to fetch/provide content from jahia site content.
 *
 * @author prince.arora
 */
@Injectable()
export class JahiaContentService {

  content_base = '';
  showHeaderMsgContent = true;

  constructor(
    private _http: HttpClientService, private appcontext: AppContext
  ) {
  }

  public getContent(path: string): Observable<any> {
    this.content_base = `/sites/${this.appcontext.sitekey}/contents`;
    if ( path.indexOf(this.content_base) === -1 ) {
      path = `${this.content_base}${path}.json`;
    } else {
      path = `${path}.json`;
    }
    return this._http.getRequest(path, 'application/json', true);
  }

}
