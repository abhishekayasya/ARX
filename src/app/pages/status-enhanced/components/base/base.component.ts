import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { OrderCardComponent } from './../order-card/order-card.component';
import { environment } from '@env/environment';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
import mockData from "./mockData";
import { HttpClientService } from 'app/core/services/http.service';
import { Microservice } from '@app/config/microservice.constant';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'status-enhanced-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class StatusEnhancedBaseComponent implements OnInit {
  @ViewChildren(OrderCardComponent) orderCards: Array<OrderCardComponent>;

  public ordersDisplayed;
  
  familyMembers = [];
  mockData: any;
  mockModeEnabled: boolean = true;
  mockButtonText: string = 'off';
  currentPatient: any = null;


  ROUTES = ROUTES;
  constructor(
    private _common: CommonUtil,
    private _httpService: HttpClientService,
    private _userService: UserService
  ) {
    this.mockData = mockData;
    console.log(mockData)
  }

  ngOnInit() {
    this.setMockOrders();
    this.retreiveFamilyMembers()
  }

  setMockOrders() {
    this.ordersDisplayed = mockData;
  }

  retreiveFamilyMembers() {
    this._httpService.postData(Microservice.full_access,{}).subscribe(
      res => {
        console.log("response from full access:", res);
        if(res.members){
          this.familyMembers = res.members.map(member => ({
            key: member.profileId,
            value: member.firstName + " " + member.lastName
          }));
          this.currentPatient = this.familyMembers[0]
        }
      },
      err => {
        console.error("getMembers did not work:", err);
      },
      () => {
        console.log("Complete block in retreive family members observable")
      }
    )
  }

  ordersCallObserveable(){
    const profileId = this._userService.user.id;
    const url = this._common.stringFormate(Microservice.sm_orders, [
      profileId
    ]);
    return this._httpService.getData(url);
  }

  retreiveOrders() {
    this.ordersCallObserveable().subscribe(
      res => {
        console.log("response from /arxwp/order:", res);
      },
      err => {
        console.error("/arxwp/order did not work:", err);
      },
      () => {
        console.log("Hello, I am the often forgotten observeable complete block")
      }

    )
  }

  toggleMockMode() {
    if(this.mockModeEnabled){
      this.retreiveOrders();
    } else {
      this.setMockOrders();
    }
    this.mockModeEnabled = !this.mockModeEnabled;
  }

  showFamilyMemberOrders() {
    //update ordersDisplayed to show for the family member you select

  }

  memberChange(event: any) {
    // const currentMemberId = event.target.value;
    const currentMemberId = event;
    if (currentMemberId) {
      this.currentPatient = this.mockData.familyMembers.find(member => member.profileId === currentMemberId);
    }
  }
}
