import {Injectable} from '@angular/core';
import {ROUTES} from '@app/config';
import {Router} from '@angular/router';

@Injectable()
export class AdultService {

  options = [
    {
      path: ROUTES.family_management.children.adult.add.absoluteRoute,
      route: ROUTES.family_management.children.adult.add.route,
      id: 'information',
      text: 'Use their personal information'
    },
    {
      path: ROUTES.family_management.children.adult.add.absoluteRoute,
      route: ROUTES.family_management.children.adult.add.route,
      id: 'rxnumber',
      text: 'Use their prescription number'
    }
  ];

  memberType = 'adult';

  states = {
    info: {
      id: 'info',
      path: ROUTES.family_management.children.adult.add.absoluteRoute
    },
    send_invite: {
      id: 'send_invite',
      path: ROUTES.family_management.children.adult.invite.absoluteRoute
    },
    no_match_info: {
      id: 'no_match_info'
    },
    info_additional: {
      id: 'info_additional',
      path: ROUTES.family_management.children.adult.search_additional.absoluteRoute
    },
    info_additional_no_match: {
      id: 'info_additional_no_match'
    },
    underage_proposed: {
      id: 'underage_proposed',
      path: ROUTES.family_management.children.adult.child_found.absoluteRoute
    }
  };

  add_option = 'information';

  add_state: string = this.states.info.id;
  personalInfo: any;

  email_exit: string;

  invite_success: string;

  constructor() {}

}
