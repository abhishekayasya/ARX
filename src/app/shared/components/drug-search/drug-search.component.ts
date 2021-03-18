import {Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClientService} from '@app/core/services/http.service';
import {UserService} from '@app/core/services/user.service';
import {CommonUtil} from '@app/core/services/common-util.service';
import {ARX_MESSAGES} from '@app/config';
import { FormControl } from '@angular/forms';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Microservice } from '@app/config';

@Component({
  selector: 'arxrf-checkout-drugsearch',
  templateUrl: './drug-search.component.html',
  styleUrls: ['./drug-search.component.scss'],
  host: {
    '(click)': 'closeDropdown($event)'
  }
})
export class DrugSearchComponent implements OnInit {

  @Input()
  heading: string;

  @Input()
  subHeading: string;

  @Input()
  inputPrompt: string;

  @Input()
  name: string;

  @Input()
  show: boolean;

  @Input()
  showDelete = false;

  result: Array<any> = [];

  selected: Array<any> = [];

  @Input()
  type: string;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  searchQuery: FormControl;

  errorMessage: string;

  suggestions: Array<any> = [];

  @Output()
  close = new EventEmitter<boolean>();

  @Output()
  update = new EventEmitter<Array<any>>();

  constructor(
    private _http: HttpClientService,
    private _userService: UserService,
    private _common: CommonUtil
  ) {}

  ngOnInit() {
    this.searchQuery = new FormControl('');
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((e: any) => e.target.value),
        filter(val => val.length > 2),
        distinctUntilChanged(),
        switchMap(term => {
          let url;

          if (this.type === 'Medications') {

            url = this.getMedicationSearchUrl( this.searchQuery.value );
            return  this._http.getData(url);

          } else {

            url = Microservice.health_history_drugsearch;
            const requestPayload = {
                 searchText: this.searchQuery.value,
                healthHistoryType: this.type
            };
          return this._http.postData(url, requestPayload);
          }
        }
        ))
        .subscribe(response => {
            if ( response.drugContents !== undefined ) {

              //remove trailing space from drug name
              for (let i = 0; i < response.drugContents.length; i++ ) {
                response.drugContents[i].drugName = response.drugContents[i].drugName.trim();
              }

              this.suggestions = response.drugContents;
            } else if ( response.responseMessage.message !== undefined ) {
              this.suggestions = [];
            } else if (response.messages !== undefined) {
              this.errorMessage = response.messages[0].message;
            }

          }
        );

  }


  /**
   * get list of drugs for given search query.
   */
  getDrugs() {
    let url = Microservice.health_history_drugsearch;

    if ( this.searchQuery.value !== undefined && this.searchQuery.value !== '') {
      this.errorMessage = undefined;
      if (this.type === 'Medications') {

        url = this.getMedicationSearchUrl( this.searchQuery.value );
        this._http.getData(url)
        .subscribe(
          (response) => {
            if ( response.drugContents !== undefined && response.drugContents.length > 0 ) {
              response.drugContents.forEach(function(el) {
                el['isChecked'] = false;
              });
              this.result = response.drugContents;
            } else if ( response.messages !== undefined ) {
              this.errorMessage = response.messages[0].message;
            }

          },

          (error) => {
            this.errorMessage = ARX_MESSAGES.ERROR.wps_cto;
          }
        );

      } else {
        url = Microservice.health_history_drugsearch;

        const requestPayload = <any>{};
        requestPayload.searchText = this.searchQuery.value;
        requestPayload.healthHistoryType = this.type;

       this._http.postData(url, requestPayload)
        .subscribe(
          (response) => {
            if ( response.drugContents !== undefined && response.drugContents.length > 0 ) {
              response.drugContents.forEach(function(el) {
                el['isChecked'] = false;
              });
              this.result = response.drugContents;
            } else if ( response.responseMessage.message !== undefined ) {
              this.errorMessage = response.responseMessage.message.message;
            }

          },

          (error) => {
            this.errorMessage = ARX_MESSAGES.ERROR.wps_cto;
          }
        );
    }
  }
  }

  selectSuggestion(item) {
    this.searchQuery.setValue(item.drugName);
    this.suggestions = [];
  }

  changeDrugSelection(event, drug: any, itemindex, isSub: boolean = false ) {
    event.stopPropagation();
    const mq = window.matchMedia( '(min-width: 480px)' );
    if (mq.matches) {
      this.selectDrug(event, drug, itemindex, isSub);
    } else {
      if (event.target.checked) {
        drug.isChecked = true;
        this.selectDrug(event, drug, itemindex, isSub);
      } else {
        drug.isChecked = false;
        this.removeDrug(null, drug.drugId);
      }
      // event.target.checked ? this.selectDrug(event, drug, isSub) : this.removeDrug(null, drug.id);
    }
  }

  expandSubitems(event, drug, itemindex) {
    event.stopPropagation();
    if (drug.subCategory && drug.subCategory.length) {
      drug.showSubItems = !drug.showSubItems;
      return;
    }
    this.selectDrug(event, drug, itemindex);
  }

  /**
   * send request to select a drug.
   *
   * @param drug
   */
  selectDrug( event, drug: any, itemindex, isSub: boolean = false ): void {
    event.stopPropagation();
    const isDrugAllergy = this.type === 'Drug Allergies' ? true : false;
    this.errorMessage = undefined;
    const exists = this.selected.filter(item => {
      let check = false;
      if (isDrugAllergy && item.allergyCode) {
        check = item.allergyCode === drug.allergyCode;
      } else {
        check = item.drugId === drug.drugId;
      }
      return check;
    }).length;
    if (exists !== 0 && !isSub) {
      drug.showSubItems = !drug.showSubItems;
    }
    if ( exists === 0 ) {
      const requestPayload = {
        //drugName: drug.drugName,
        healthHistoryType: this.type,
        searchText: this.searchQuery.value
      };

      if ( isSub ) {
        const obj = {drugName: drug.drugName};
        if (isDrugAllergy && drug['allergyCode']) {
          obj['allergyCode'] = drug['allergyCode'];
        } else {
          obj['drugId'] = drug.drugId;
        }
        this.selected.push(obj);
      } else if ( this.type === 'Health Conditions' || isSub ) {
        this.selected.push({
          drugName: drug.drugName,
          drugId: drug.drugId
        });
      } else {
      //  let url = `/svc/profiles/${this._userService.user.id}/healthhistorydetail`;
      drug.showSubItems = !drug.showSubItems;
      let url;

          if (this.type === 'Medications') {

            url = this.getMedicationSearchUrl( this.searchQuery.value );
            this._http.getData(url).subscribe(
              (response) => {
                if ( response.messages === undefined ) {
                  response.drugContents[itemindex].subCategory.forEach(function(el) {
                    el['isChecked'] = false;
                  });
                  drug.subCategory = response.drugContents[itemindex].subCategory;
                } else if ( response.messages[0].code === 'WAG_E_HEALTH_HISTORY_DOSAGE_SEARCH_001' ) {
                  this.selected.push({
                    drugName: drug.drugName,
                    drugId: drug.drugId
                  });
                } else {
                  this.errorMessage = response.messages[0].message;
                }
              },

              (error) => {
                this.errorMessage = ARX_MESSAGES.ERROR.wps_cto;
              }
            );

          } else {
            url = Microservice.health_history_drugsearch;
            this._http.postData(
              url,
              requestPayload
            ).subscribe(
                (response) => {
                  if ( response.responseMessage === undefined ) {
                    response.drugContents[itemindex].subCategory.forEach(function(el) {
                      el['isChecked'] = false;
                    });
                    drug.subCategory = response.drugContents[itemindex].subCategory;
                  } else if ( response.responseMessage.message.code === 'WAG_E_HEALTH_HISTORY_DOSAGE_SEARCH_001' ) {
                    this.selected.push({
                      drugName: drug.drugName,
                      drugId: drug.drugId
                    });
                  }  else if ( response.responseMessage.message.code === 'WAG_E_HEALTH_HISTORY_SEARCH_015' ) {
                    this.errorMessage = response.responseMessage.message.message;
                  } else {
                    this.errorMessage = response.responseMessage.message.message;
                  }
                },

                (error) => {
                  this.errorMessage = ARX_MESSAGES.ERROR.wps_cto;
                }
              );
          }
      }
    }

  }

  /**
   * modal close action.
   */
  closeAction() {
    this.show = false;
    this.result = [];

    if ( this.selected.length > 0 ) {
      this.selected = [];
      this.searchQuery.setValue('');
    }

    this.close.emit(this.show);
  }

  removeDrug( index, drugId ): void {
    this.setIsCheckedFalse(drugId);
    this.selected = this.selected.filter(
      (item) => {
        return item.drugId !== drugId;
      }
    );
  }

  /**
   * Call on submit click
   */
  onSubmit() {
    this.update.emit(this.selected);
    this.closeAction();
  }

  closeDropdown(evt) {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.suggestions = [];
    }
  }

  setIsCheckedFalse(drugId) {
    this.result.forEach(function(item) {
      if (item.subCategory && item.subCategory.length > 0) {
        item.subCategory.forEach(function(subItem) {
          if (subItem.drugId === drugId) {
            subItem.isChecked = false;
          }
        });
      } else {
        if (item.drugId === drugId) {
          item.isChecked = false;
        }
      }
    });
  }

  getId(item) {
    return (this.type === 'Drug Allergies' && item.allergyCode) ? item.allergyCode : item.drugId;
  }

  /**
   * Medication search url with encoded search value (query) as path param.
   *
   * @param query search query text
   */
  private getMedicationSearchUrl( query ) {
    query = encodeURIComponent( query );
    return this._common.stringFormate(Microservice.health_history_medications_drugsearch, [query]);
  }
}
