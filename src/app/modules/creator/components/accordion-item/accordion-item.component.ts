import { Component, Input } from '@angular/core';

import { AuctionInstance } from '@models-app/auction.model';
import { StateService } from '@services-app/state.service';
import { FirestoreCreatorActionsService } from '@services-app/fireStore/firestore-creator-actions.service';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss', '../../../../shared/common.scss']
})
export class AccordionItemComponent {

  @Input() auction: AuctionInstance;

  constructor(
    public stateService: StateService,
    private api: FirestoreCreatorActionsService,
  ) { }

  onReject(): void {
    const motionId = this.stateService.motionInstance.key;
    const { key, ask } = this.auction;
    const updatedPartial = {ask, status: this.stateService.iconList.ask};
    this.api.updateAsk(motionId, key, updatedPartial).subscribe(res => {

    });
  }

  onAccept(): void {
    const updatedPartial = { deal: String(this.auction.bid), status: this.stateService.iconList.success};
    this.api.updateAsk(this.stateService.motionInstance.key, this.auction.key, updatedPartial ).subscribe(
      res => {

      }
    );
  }

}
