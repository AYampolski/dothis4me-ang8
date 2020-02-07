import { Injectable } from '@angular/core';
import { MotionAuctionItem, MotionInstance } from '@models-app/motion.model';

import { User } from '@models-app/user.model';
import { AuctionInstance } from '@models-app/auction.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  motionInstance: MotionInstance;

  iconList = {
    pending: 'pending',
    success: 'success',
    ask: 'ask'
  };

  user: User;
  userInfo: string;

  motionId: string;

  activeSessionsIds: string[];
  selectedAuction: AuctionInstance;
  activeSessionsObjects: AuctionInstance[];
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
