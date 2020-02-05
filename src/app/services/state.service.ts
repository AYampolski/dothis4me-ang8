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
  };

  user: User;
  userInfo: string;

  motionId: string;
  motionInfo: any;

  activeSessionsIds = [];
  selectedAuction: AuctionInstance;
  activeSessionsObjects = [];
  auctionsGroup: MotionAuctionItem[];


  constructor() { }

  clearAuctionMotionData(): void {
    this.clearMotion();
    this.clearSelectedAuction();
  }

  clearSelectedAuction(): void {
    this.selectedAuction = null;
    this.activeSessionsIds = [];
    this.activeSessionsObjects = [];
    this.auctionsGroup = null;
  }

  clearMotion(): void {
    this.motionId = null;
    this.motionId = null;
  }

}
