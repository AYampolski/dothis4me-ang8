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
  @Output() changeIcon: EventEmitter<string> = new EventEmitter();

  showPendingState = true;
  showAskState: boolean;
  showAcceptedState: boolean;
  showStatus: string;


  constructor(
    private api: FirestoreCreatorActionsService,
    private stateService: StateService,
  ) { }

  ngOnInit() {
    this.showStatus = this.auction.status;
  }

  onReject(element: AuctionInstance, askForm) {
    const motionId = this.stateService.newMotionInstance.key;
    const {key, ask} = this.auction;

    if(!motionId || !key || !ask ){
      console.log('can not reject');
      return;
    }
    const obj = {ask, status: 'ask'};

    this.api.updateAsk(motionId, key, obj).subscribe(ex => {
      this.auction.status = 'ask';
    });
  }

  onAccept(){
    this.auction = Object.assign({}, this.auction, {deal : this.auction.bid, status: 'success'});
    this.showStatus = 'success';
    this.api.updateAsk(this.stateService.newMotionInstance.key, this.auction.key, {deal: this.auction.bid, status: 'success'}).subscribe(
      res => {
        this.auction.status = 'success';
        this.changeIcon.emit(this.stateService.iconList.success);
      }
    );
  }

}
