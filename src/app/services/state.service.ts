import { Injectable } from '@angular/core';
import { MotionAuctionItem, MotionInstance } from '@models-cust/motion.model';

import { User } from '@models-cust/user.model';
import { AuctionInstance } from '@models-cust/auction.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {



  newMotionInstance: MotionInstance;
  iconList = {
    pending: 'pending',
    success: 'success',
    ask: 'ask'
  }
  activeSessionsIds = [];
  activeSessionsObjects = [];
  motion: MotionInstance;
  auction: MotionAuctionItem;
  motionId: string;
  user: User;
  auctionsGroup: MotionAuctionItem[];
  userInfo: string;
  motionInfo: any;
  selectedAuction: AuctionInstance;
  // motionObject: MotionInstance;
  constructor() { }

  setMotion(motion: MotionInstance) {
    console.log('motion set');
    this.motion = motion;
  }

  setMotionId(id) {
    this.motionId = id;
  }

  getMotionId() {
    return this.motionId;
  }
  setAuction(auction: MotionAuctionItem) {
    this.auction = auction;
  }

  addAuction(auction: MotionAuctionItem) {
    this.auctionsGroup.push(auction);
  }

  clearAuction() {
    this.auctionsGroup = [];
  }
}
