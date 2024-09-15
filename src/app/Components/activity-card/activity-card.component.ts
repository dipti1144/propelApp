import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {

  @Input() loading: boolean = false;   // specify type
  @Input() status: boolean = false;    // specify type
  @Input() module: string = '';         // specify type
  @Input() count: number = 0;           // specify type

  constructor() {}

  ngOnInit() {}
}
