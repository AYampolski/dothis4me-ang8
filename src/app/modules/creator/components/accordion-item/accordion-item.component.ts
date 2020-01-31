import { Component, OnInit, Input } from '@angular/core';
import { AuctionInstance } from '@models-cust/auction.model';

import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss']
})
export class AccordionItemComponent implements OnInit {

  @Input() item: AuctionInstance;
  constructor(
    private api: FirestoreCreatorActionsService,
    private stateService: StateService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {

   }

  ngOnInit() {
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
    const obj = {ask, isAsked: true};

    this.api.updateAsk(motionId, key, obj).subscribe(ex => {
      // console.log('LOOKT AT THIS', this.item);
      // this.item.ask = ask;

      // this.item = Object.assign({}, this.item , {isAsked : true}); //re-rendered
      // // this.item.isAsked = true;
      console.log('after ', this.item );
    });
  }

  onAccept(){
    this.item = Object.assign({}, this.item, {deal : this.item.bid}); //re-rendered
    // this.item.deal = String(this.item.bid);
    console.log('===>', this.item);
    this.api.updateAsk(this.stateService.newMotionInstance.key, this.item.key, {deal: this.item.bid});
  }

}
