import { Component, OnInit, Input, Output } from '@angular/core';
import { AuctionInstance } from '@models-cust/auction.model';

import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss']
})
export class AccordionItemComponent implements OnInit {

  @Input() item: AuctionInstance;
  @Output() changeIcon: EventEmitter<string> = new EventEmitter();
  aucitonState; // pending | asked | accepted
  statePending; stateAsked; stateAccepted
  showPendingState = true;
  showAskState: boolean;
  showAcceptedState: boolean;
  showStatus: string;


  constructor(
    private api: FirestoreCreatorActionsService,
    private stateService: StateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    // this.aucitonState =
   }

  ngOnInit() {
    this.showStatus = this.item.status;
  }

  setState(state){
    this.clearStates();
    switch(state){
      case 'pending': {
        this.showPendingState = true;
        break;
      }
      case 'ask': {
        this.showAskState = true;
        break;
      }
      case 'success': {
        this.showAcceptedState = true;
        break;
      }
      default: {
        console.warn('THERE IS NOT PROP');
        break;
      }
    }
  }

  clearStates(){
    this.showPendingState = false;
    this.showAcceptedState = false;
    this.showAskState = false;
  }

  onReject(element: AuctionInstance, askForm) {
    console.log('element === ', this.item);
    const motionId = this.stateService.newMotionInstance.key;
    const {key, ask} = this.item;
    // const ask = askForm.value;
    if(!motionId || !key || !ask ){
      console.log('can not reject');
      return;
    }
    const obj = {ask, status: 'ask'};

    this.api.updateAsk(motionId, key, obj).subscribe(ex => {
      // this.setState(this.stateService.iconList.ask);
      // this.changeIcon.emit(this.stateService.iconList.ask);
      this.item.status = 'ask';
      console.log('after ', this.item );
    });
  }

  onAccept(){
    this.item = Object.assign({}, this.item, {deal : this.item.bid, status: 'success'});
    this.showStatus = 'success';
    this.api.updateAsk(this.stateService.newMotionInstance.key, this.item.key, {deal: this.item.bid, status: 'success'}).subscribe(
      res => {
        this.item.status = 'success';
        // this.setState(this.stateService.iconList.success);
        this.changeIcon.emit(this.stateService.iconList.success);
      }
    );
  }

}
