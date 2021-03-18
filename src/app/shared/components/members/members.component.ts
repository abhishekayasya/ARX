import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit
} from "@angular/core";

import { UserService } from "@app/core/services/user.service";
import { HttpClientService } from "@app/core/services/http.service";
import { MemberModel, Message } from "@app/models";
import { AppContext } from "@app/core/services/app-context.service";
import { RefillBaseService } from "@app/core/services/refill-base.service";
import { ROUTES, ARX_MESSAGES } from "@app/config";
import { ActivatedRoute } from "@angular/router";
import { CommonUtil } from "@app/core/services/common-util.service";
import { MessageService } from "@app/core/services/message.service";
import { GaService } from "@app/core/services/ga-service";
import { GAEvent } from "@app/models/ga/ga-event";
import { TwoFaGA } from "@app/config/ga-constants";
import { GaData, TwoFAEnum } from "@app/models/ga/ga-event";
/**
 * Select box for family members listing.
 *
 * Exposes event for on select event to perform an action
 * when any family member is selected in select box.
 *
 */
@Component({
  selector: "arxrf-refill-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"]
})
export class MembersComponent implements AfterViewInit {
  members: Array<MemberModel>;

  currentMember: string;

  queryMemberId: string;

  profileID: string;
  firstName: string;
  lastName: string;
  @Input()
  isHdPrescription = false;
  @Input()
  GAflag = false;
  inputTitle = "Family member";

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect = new EventEmitter<string>();

  /*ngOnInit(): void {
    this.loadMemeberList();
  }*/

  ngAfterViewInit(): void {
    // Fetching family members on view initiated.
    this.loadMemeberList();
  }

  constructor(
    public userService: UserService,
    private _httpService: HttpClientService,
    public appContext: AppContext,
    private _refillService: RefillBaseService,
    private _route: ActivatedRoute,
    private _common: CommonUtil,
    private _message: MessageService,
    private _gaService: GaService
  ) {
    this._route.queryParams.subscribe(params => {
      this.queryMemberId = params["mid"];
    });

    // Update current member from query string
    // istanbul ignore else
    if (this.currentMember === undefined) {
      if (this.queryMemberId) {
        this.currentMember = this.queryMemberId;
      } else {
        this.currentMember = this.userService.getActiveMemberId();
      }
    } else {
      // Update current member from session store if found
      this._refillService.activeMemberId = this.currentMember;
    }
  }

  /**
   * On member change
   */
  gaEventWithData(action, label = "", data = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = TwoFaGA.category.orderstatus_dropdown;
    event.action = action;
    event.label = label;
    // istanbul ignore else
    if (data) {
      event.data = data;
    }
    return event;
  }
  memberChange() {
    if (this.currentMember === "addMember") {
      this.onSelect.emit("addMember");
      this._common.navigate(ROUTES.family_management.absoluteRoute);
      // istanbul ignore else
      if (!this.GAflag && !this.isHdPrescription) {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.ORDER_STATUS_DROPDOWN
        });
      }
    } else {
      const membersData = window.localStorage.getItem("members");
      const members = JSON.parse(membersData);
      const thisPatient = members.filter(
        member => member.profileId === this.currentMember
      );
      this.firstName = thisPatient[0].firstName;
      this.lastName = thisPatient[0].lastName;
      // istanbul ignore else
      if (!this.GAflag && !this.isHdPrescription) {
        this._gaService.sendEvent(
          this.gaEventWithData(
            TwoFaGA.action.orderstatus_fam_mem_changed,
            "",
            this.firstName.concat(" " + this.lastName)
          )
        );
      }
      sessionStorage.setItem(
        AppContext.CONST.memberActiveKey,
        JSON.stringify({
          active: this.currentMember
        })
      );
      this.onSelect.emit(this.currentMember);
    }
  }
  loadMemeberList() {
    const url = "/familymgmt/csrf-disabled/members/fullaccess";
    this._httpService
      .doPost(url, {})
      .then(response => {
        const json = response.json();
        // save members data to local storage
        if (json.members) {
          window.localStorage.setItem("members", JSON.stringify(json.members));
        } else if (json.messages && json.messages.length > 0 && json.messages[0].code === "WAG_I_FA_1010") {
          // WAG_I_FA_1010: No family members
          // Set the logged-in user as the only member and add it to the members list.
          window.localStorage.setItem("members", JSON.stringify([{
            dateOfBirth: this.userService.user.dateOfBirth,
            firstName: this.userService.user.firstName,
            lastName: this.userService.user.lastName,
            profileId: this.userService.user.id,
            type: "Head of Household (You)"
          }]))
        }
        // istanbul ignore else
        if (json.members !== undefined) {
          this.members = json.members.filter(
            function(item, index) {
              // istanbul ignore else
              if (item.profileId !== this.userService.user.id) {
                return true;
              }
            }.bind(this)
          );
          this.prepareFurtherUi();
        }
        this.checkIsPrescriptionFlow();
      })
      .catch(error => {});
  }

  checkIsPrescriptionFlow() {
    if (this.isHdPrescription) {
      this.inputTitle = "Patient name";
    }
  }

  isPrescriptionFlow() {
    return this.isHdPrescription;
  }

  /**
   * Updating members ui further.
   *
   * changing default logged in member name for Default
   */
  prepareFurtherUi() {
    this.members.sort((a: MemberModel, b: MemberModel) => {
      return this.checkMembernames(a, b);
    });
  }
  checkMembernames(a: MemberModel, b: MemberModel): any {
    if (a.firstName.toLocaleLowerCase() < b.firstName.toLocaleLowerCase()) {
      return -1;
    }
    if (a.firstName.toLocaleLowerCase() > b.firstName.toLocaleLowerCase()) {
      return 1;
    }
    return 0;
  }
}
