import { Component, OnInit } from '@angular/core';

import { StateService } from '@services-cust/state.service';
import { FirestoreRequestorActionsService } from '@services-cust/fireStore/firestore-requestor-actions.service';
import { AuctionForm } from '@models-cust/auction.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  requirement: string;
  bid: number;

  updateObserver = {
    next: success => {
      console.warn('Updated success! Success: ', success);
    },
    error: err => {
      console.warn('Errors witrh updating! ', err);
    },
    complete: () => {
      console.warn('Updated complete! ');
    }
  };

  constructor(
    public stateService: StateService,
    private api: FirestoreRequestorActionsService
  ) { }

  ngOnInit() {
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

  createRequest(): void{

    if (!this.requirement || !this.bid) {
      console.log('fill the form of auction');
      return;
    }

    const motionId = this.stateService.newMotionInstance.key;
    const auctionData = this.createAucitonFormInstance(this.requirement, this.bid, 'pending');

    this.api.createRequest(motionId, auctionData).subscribe( success => {
      this.stateService.selectedAuction = success.payload.data();
    },
    err => {
      console.warn('Error inside creation auctin from requestor: ', err);
    });
  }


  onNewBid(bid): void {
    this.stateService.selectedAuction.status = 'pending';
    const updatedProps = {bid, status: 'pending'};

    this.updateAuctionForm(updatedProps).subscribe(this.updateObserver);
  }

  updateAuctionForm(updatedProps): Observable<void> {
    const motionId = this.stateService.newMotionInstance.key;
    const aucitonId = this.stateService.selectedAuction.key;
    return this.api
      .updateAuction( motionId, aucitonId, updatedProps);
  }

  onAccept(): void {
    this.stateService.selectedAuction.deal = String(this.stateService.selectedAuction.bid);
    const deal = this.stateService.selectedAuction.ask;
    const updatedProps = { deal, status: 'success'};
    this.updateAuctionForm(updatedProps).subscribe(this.updateObserver);
  }


}
