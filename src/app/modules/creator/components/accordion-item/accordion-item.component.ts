import { Component, Input } from '@angular/core';

import { AuctionInstance } from '@models-cust/auction.model';
import { StateService } from '@services-cust/state.service';
import { FirestoreCreatorActionsService } from '@services-cust/fireStore/firestore-creator-actions.service';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss', '../../../../shared/common.scss']
})
export class AccordionItemComponent {

  @Input() auction: AuctionInstance;

  constructor(
    private api: FirestoreCreatorActionsService,
    private stateService: StateService,
  ) { }

  onReject() {
    const motionId = this.stateService.motionInstance.key;
    const {key, ask} = this.auction;
    const updatedPartial = {ask, status: this.stateService.iconList.ask};
    this.api.updateAsk(motionId, key, updatedPartial).subscribe(res => {

    });
  }

  onAccept(){
    const updatedPartial = { deal: String(this.auction.bid), status: this.stateService.iconList.success};
    this.api.updateAsk(this.stateService.motionInstance.key, this.auction.key, updatedPartial ).subscribe(
      res => {

      }
    );
  }

}
