import { Injectable } from '@angular/core';
import { MotionAuctionItem, MotionInstance } from '@models-cust/motion.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  motion: MotionInstance;
  auction: MotionAuctionItem;
  motionId: string;
  user: any;
  auctionsGroup: MotionAuctionItem[];
  userInfo: string;
  motionInfo = 'Some Guy'
  // motionObject: MotionInstance;
  constructor() { }

  setMotion(motion: MotionInstance){
    console.log('motion set')
    this.motion = motion;
  }

  setMotionId(id) {
    this.motionId = id;
  }

  getMotionId() {
    return this.motionId;
  }
  setAuction(auction: MotionAuctionItem){
    this.auction = auction;
  }

  addAuction(auction: MotionAuctionItem) {
    this.auctionsGroup.push(auction);
  }

  clearAuction(){
    this.auctionsGroup = [];
  }
}
