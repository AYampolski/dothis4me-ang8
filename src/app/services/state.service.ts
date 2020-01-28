import { Injectable } from '@angular/core';
import { MotionAuctionItem, MotionInstance } from '@models-cust/motion.model';

import { User } from '@models-cust/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  newMotionInstance: MotionInstance;


  motion: MotionInstance;
  auction: MotionAuctionItem;
  motionId: string;
  user: User;
  auctionsGroup: MotionAuctionItem[];
  userInfo: string;
  motionInfo: any;
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
