import { Component, OnInit, Input } from '@angular/core';
import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  ownerName;
  displayName;

  @Input() data;

  title; icon; bid;

  constructor(
    private stateService: StateService
  ) { }

  ngOnInit() {
    console.log('accordion ', this.data);

  }

  identifyer = (index:number, item: any) => item.bid;
}
