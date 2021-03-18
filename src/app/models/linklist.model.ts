import {LinkModel} from '@app/models/link.model';

export interface LinklistModel {

  title: string;
  cssClass: string;
  links: Array<LinkModel>;
}
