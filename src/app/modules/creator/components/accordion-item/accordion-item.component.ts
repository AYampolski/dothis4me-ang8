import { Component, OnInit, Input, Output } from '@angular/core';
import { AuctionInstance } from '@models-cust/auction.model';
import { EventEmitter } from '@angular/core';

import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss']
})
export class AccordionItemComponent implements OnInit {

  @Input() auction: AuctionInstance;

  showPendingState = true;
  showAskState: boolean;
  showAcceptedState: boolean;



  constructor(
    private api: FirestoreCreatorActionsService,
    private stateService: StateService,
  ) { }

  ngOnInit() {

  }

  onReject() {
    const motionId = this.stateService.newMotionInstance.key;
    const {key, ask} = this.auction;

    const updatedPartial = {ask, status: 'ask'};

    this.api.updateAsk(motionId, key, updatedPartial).subscribe(res => {

    });
  }

  onAccept(){
    const updatedPartial = { deal: String(this.auction.bid), status: 'success' };
    this.api.updateAsk(this.stateService.newMotionInstance.key, this.auction.key, updatedPartial ).subscribe(
      res => {

      }
    );
  }

}
