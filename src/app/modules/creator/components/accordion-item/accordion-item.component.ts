import { Component, Input, OnDestroy } from '@angular/core';

import { AuctionInstance } from '@models-app/auction.model';
import { StateService } from '@services-app/state.service';
import { FirestoreMotionsService } from '@services-app/fireStore/firestore-motions.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss', '../../../../shared/common.scss']
})
export class AccordionItemComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() auction: AuctionInstance;

  constructor(
    public stateService: StateService,
    private api: FirestoreMotionsService,
  ) { }

  onReject(): void {
    const motionId = this.stateService.motionInstance.key;
    const { key, ask } = this.auction;
    const updatedPartial = {ask, status: this.stateService.iconList.ask};
    this.api.updateAsk(motionId, key, updatedPartial)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {

      });
  }

  onAccept(): void {
    const updatedPartial = { deal: String(this.auction.bid), status: this.stateService.iconList.success};
    this.api.updateAsk(this.stateService.motionInstance.key, this.auction.key, updatedPartial )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {

        }
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
