import { Component, OnInit } from '@angular/core';

import { StateService } from '@services-cust/state.service';
import { FirestoreRequestorActionsService } from '@services-cust/fireStore/firestore-requestor-actions.service';
import { AuctionForm } from '@models-cust/auction.model';

// import { Router } from '@angular/router';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss']
})
export class InitComponent implements OnInit {

  title: string;
  requirement: string;
  bid: number;
  constructor(
    public stateService: StateService,
    private api: FirestoreRequestorActionsService
  ) { }

  ngOnInit() {
    console.log('[REQUESTOR MODULE INIT COMPONENT]' , );
  }

  /**
   * Creates an instance of auction form;
   * @param { string } requirement
   * @param { number } bid
   */
  createAucitonFormInstance(requirement: string, bid: number): AuctionForm {
    return {
      requirement,
      bid
    };
  }

  // HERE!!!
  createRequest(){
    console.log('### key= ', this.stateService.motionId);

    if (!this.requirement || !this.bid) {
      console.log('fill the form of auction');
      return;
    }
    const motionId = this.stateService.newMotionInstance.key;
    const auctionData = this.createAucitonFormInstance(this.requirement, this.bid);
    this.api.newCreateRequest(motionId, auctionData);
  }

  updateRequest() {
    console.log('UPDATE BID > ');
    this.api.updateBid();
  }

}
