import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { AuctionInstance } from '@models-cust/auction.model';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, OnChanges {
  ownerName;
  displayName;
  isFirst: boolean;
  @Input() data;
  console = console;
  title; icon; bid;

  constructor(
    private stateService: StateService,
    private api: FirestoreCreatorActionsService
  ) {

  }

  ngOnInit() {



  }

  ngOnChanges() {
    // if(!this.isFirst){
    //   this.data = this.data.map( item => {
    //     return {...item, isAsked: false};
    //   });
    //   this.isFirst = true;
    //   console.log('accordion ', this.data);
    // }
  }

  identifyer = (index: number, item: any) => item.bid || item.isAsked ;


}
