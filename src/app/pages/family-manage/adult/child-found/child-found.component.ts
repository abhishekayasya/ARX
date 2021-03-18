import { Component, OnInit } from '@angular/core';
import { ROUTES } from '@app/config';
import { Router } from '@angular/router';
import { FmService } from '@app/core/services/fm.service';
import { AdultService } from '@app/pages/family-manage/adult/adult.service';

@Component({
  selector: 'arxrf-fm-adilt-childfound',
  templateUrl: './child-found.component.html',
  styleUrls: ['./child-found.component.scss']
})
export class AdultChildFoundComponent implements OnInit {
  ROUTES = ROUTES;

  constructor(
    private _router: Router,
    private adultService: AdultService,
    private manager: FmService
  ) {}

  gotoChild() {
    this._router.navigateByUrl(
      this.ROUTES.family_management.children.child.add.absoluteRoute
    );
  }

  ngOnInit(): void {
    this.manager.disableLoad();
    if (
      this.adultService.add_state !==
      this.adultService.states.underage_proposed.id
    ) {
      this._router.navigateByUrl(
        this.ROUTES.family_management.children.adult.add.absoluteRoute
      );
    }
  }
}
