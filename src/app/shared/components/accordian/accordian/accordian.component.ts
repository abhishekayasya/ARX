import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnInit,
  Input,
} from "@angular/core";
import { AccordianItemComponent } from "../accordian-item/accordian-item.component";
import { Observable } from "rxjs";
import { startWith, map, delay } from "rxjs/operators";
import { AccordianHeadComponent } from "../accordian-head/accordian-head.component";

@Component({
  selector: 'arxrf-accordian',
  templateUrl: './accordian.component.html',
  styleUrls: ['./accordian.component.scss']
})
export class AccordianComponent implements AfterContentInit {
  @Input('direction') direction?: 'up' | 'down' | 'middle' = 'up';
  @Input('toggle-body') toggleBody?: boolean = false;
  @Input('column') column?: number = 0;
  @Input('toggle-button') toggleButton?: boolean = false;

  @ContentChildren(AccordianItemComponent) accordianList: QueryList<AccordianItemComponent>;
  accordianItems$: Observable<AccordianItemComponent[]>;
  activeAccordian: AccordianItemComponent;

  constructor() { }

  ngAfterContentInit(): void {
    this.accordianItems$ = this.accordianList.changes
      .pipe(
        startWith(""), delay(0),
        map(() => this.accordianList.toArray()),
        map((itemArray: any, index: number) => {
          if(window.innerWidth < 1024) {
            this.column = 1;
          }

          const sepgap = Math.ceil(itemArray.length / this.column);
          const viewArray = [];
          const resultArray = [];

          for (var i = 0; i <= sepgap; i++) {
            const innerArray = [];
            for (var j = 0; j < this.column; j++) {
              innerArray.push(itemArray[i * this.column + j])
            }
            viewArray.push(innerArray);
          }

          for (let i = 0; i < this.column; i++) {
            const innerArray = [];
            for (let j = 0; j < sepgap; j++) {
              if (viewArray[j] && viewArray[j][i]) {
                innerArray.push(viewArray[j][i]);
              }
            }
            resultArray.push(innerArray);
          }
          return resultArray;
        })
      );
  }

  selectAccordian(accordianItem: AccordianItemComponent) {
    if (this.toggleBody) {
      if (this.activeAccordian === accordianItem) {
        return;
      }
      if (this.activeAccordian) {
        this.activeAccordian.isActive = false;
      }
      this.activeAccordian = accordianItem;
      accordianItem.isActive = true;
    } else {
      accordianItem.isActive = !accordianItem.isActive;
      this.activeAccordian = accordianItem;
    }
  }
}