import { Injectable } from '@angular/core';
import { MotionAuctionItem, MotionInstance } from '@models-cust/motion.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  motion: MotionInstance;
  auction: MotionAuctionItem;
  motionId: string;
  auctionsGroup: MotionAuctionItem[];
  constructor() { }

  setMotion(motion: MotionInstance){
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
