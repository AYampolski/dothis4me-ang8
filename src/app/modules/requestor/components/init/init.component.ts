import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StateService } from '@services-cust/state.service';
import { FirestoreRequestorActionsService } from '@services-cust/fireStore/firestore-requestor-actions.service';
import { ToastMessagesService } from '@services-cust/toast-messages.service';
import { AuctionForm, AuctionInstance } from '@models-cust/auction.model';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss', '../../../../shared/common.scss']
})
export class InitComponent implements OnInit, OnDestroy {

  startBid: FormGroup;
  controls;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading: boolean;


  updateObserver = {
    next: success => { },
    error: err => {
      console.warn('Errors witrh updating! ', err);
    }
  };

  constructor(
    public stateService: StateService,
    private api: FirestoreRequestorActionsService,
    private formBuilder: FormBuilder,
    private toastService: ToastMessagesService,
  ) {
    this.startBid = this.formBuilder.group({
      requirement: new FormControl('', Validators.required),
      bid: new FormControl('', Validators.required)
    });

    this.controls = this.startBid.controls;
  }

  ngOnInit() {
    console.log('check init');
  }

  /**
   * Creates an instance of auction form;
   * @param { string } requirement
   * @param { number } bid
   * @param { string } status
   */
  createAucitonFormInstance(requirement: string, bid: number, status: string): AuctionForm {
    return {
      requirement,
      bid,
      status
    };
  }

  createRequest(): void {
    const controls = this.startBid.controls;
    const requirement = controls.requirement.value;
    const bid = controls.bid.value;

    const motionId = this.stateService.motionInstance.key;
    const auctionData = this.createAucitonFormInstance(requirement, bid, this.stateService.iconList.pending);

    this.isLoading = true;
    this.api.createRequest(motionId, auctionData)
      .pipe(takeUntil(this.destroy$))
      .subscribe( (updatedAuction: Action<DocumentSnapshot<AuctionInstance>>) => {
        const data = updatedAuction.payload.data();

        switch (data.status) {
          case this.stateService.iconList.pending : {
            this.toastService.auctionUpdate('You');
            break;
          }
          case this.stateService.iconList.ask: {
            this.toastService.auctionUpdate('By auciton owner');
            break;
          }
          case this.stateService.iconList.success: {
            this.toastService.auctionAccept('GRATS');
          }
        }
        this.stateService.selectedAuction = updatedAuction.payload.data();
        this.isLoading = false;
      },
      err => {
        console.warn('Error inside creation auctin from requestor: ', err);
      });
  }


  onNewBid(bid): void {
    this.stateService.selectedAuction.status = this.stateService.iconList.pending;
    const updatedProps = {bid, status: this.stateService.iconList.pending};
    this.updateAuctionForm(updatedProps).subscribe(this.updateObserver);
  }

  updateAuctionForm(updatedProps): Observable<void> {
    const motionId = this.stateService.motionInstance.key;
    const aucitonId = this.stateService.selectedAuction.key;
    return this.api
      .updateAuction( motionId, aucitonId, updatedProps);
  }

  onAccept(): void {
    this.stateService.selectedAuction.deal = String(this.stateService.selectedAuction.bid);
    const deal = this.stateService.selectedAuction.ask;
    const updatedProps = { deal, status: this.stateService.iconList.success};
    this.updateAuctionForm(updatedProps).subscribe(this.updateObserver);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
