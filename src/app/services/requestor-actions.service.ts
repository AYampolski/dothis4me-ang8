import { Injectable } from '@angular/core';

import { FbApiService } from '@services-cust/fb-api.service';
import { StateService } from '@services-cust/state.service';

@Injectable({
  providedIn: 'root'
})
export class RequestorActionsService {
  mockDate = {
    key: '',
    owner: `Miracle-${Math.floor(Math.random() * 100000)}`,
    requirement: 'Dummy requirements',
    bid: `${Math.floor(Math.random() * 100000)}`,
    ask: '',
    deal: null
  }
  constructor(
    private db: FbApiService,
    private statesService: StateService
  ) { }

  addAuction(motionId = this.statesService.getMotionId(), auctionObj = this.mockDate ){
    const auctionId = this.db.generateUniquePushId();

    this.createMotionAuctionItem(motionId, auctionId, auctionObj);
    this.db.updateListOfAuctions(motionId, auctionId);
    this.createAuction(auctionId, auctionObj).then( () => {
      this.db.listenerAuction(auctionId);
    })

  }

  // createMotionAuctionItem(motionId: string, auctionId: string): void {
  createMotionAuctionItem(motionId, auctionId, auctionItem ) {
    // const auctionId = this.db.generateUniquePushId();
    this.db.createMotionAuctionItem(motionId, auctionId, auctionItem);
    console.log('auctionId ', auctionId );
    return auctionId;
  }

  // \createAucitonItem(auctionId, auctionObj)
  createAuction(auctionId, auctionObj){
    return this.db.createAucitonItem(auctionId, auctionObj);
  }

  bidIt(){
    // updatedValue: AuctionUpdateByAuctionCreator, motionId: string, auctionId: string
    // this.db.updateActionItemByRequestor()
  }
}
