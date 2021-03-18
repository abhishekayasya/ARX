import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'arxrf-like-dislike-btn',
  templateUrl: './like-dislike-btn.component.html',
  styleUrls: ['./like-dislike-btn.component.scss']
})
export class LikeDislikeBtnComponent implements OnInit {

  @Input() likeBtnIcon: string;
  @Input() unlikeBtnIcon: string;
  @Input() btnIcon: string;

  constructor() { }

  ngOnInit() {
  }

}
