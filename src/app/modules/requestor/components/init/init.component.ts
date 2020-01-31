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
  flag = true;
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
    this.flag = false;
    const motionId = this.stateService.newMotionInstance.key;
    const auctionData = this.createAucitonFormInstance(this.requirement, this.bid);
    this.api.newCreateRequest(motionId, auctionData).subscribe( success => {
      const recievedData = success.payload.data();
      console.log('!!!! ', success);
      if(this.stateService.selectedAuction) {
        if(this.stateService.selectedAuction.ask !== recievedData.ask){
          this.flag = true;
        }
      }
      this.stateService.selectedAuction = recievedData;
    },
    err => {
      console.log('!!!!', err);
    });
  }


  onNewBid(bid){
    console.log('Check bid', bid, this.stateService.newMotionInstance.key, this.stateService.selectedAuction.key);
    this.api.updateAuction( this.stateService.newMotionInstance.key, this.stateService.selectedAuction.key ,{bid})
  }
  onAccept() {
    this.stateService.selectedAuction.deal = String(this.stateService.selectedAuction.bid);
    const deal = this.stateService.selectedAuction.ask;
    console.log('Check accept', this.stateService.selectedAuction.deal, this.stateService.newMotionInstance.key, this.stateService.selectedAuction.key);
    this.api.updateAuction( this.stateService.newMotionInstance.key, this.stateService.selectedAuction.key ,{deal})
  }
}
