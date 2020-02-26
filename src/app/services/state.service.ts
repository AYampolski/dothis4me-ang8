import { Injectable } from '@angular/core';
import { MotionAuctionItem, MotionInstance } from '@models-app/motion.model';

import { User } from '@models-app/user.model';
import { AuctionInstance } from '@models-app/auction.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  motionInstance: MotionInstance;
  activeItems;
  activeMotions = [];
  activeAuctions = [];
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


  constructor() {
    this.activeSessionsIds = [];
    this.activeSessionsObjects = [];
    this.auctionsGroup = [];
  }

  setActiveItems(activeItems){
    this.activeItems = activeItems;
    this.sortActiveItems(this.activeItems);
  }

  sortActiveItems(activeItems) {
    this.activeMotions = activeItems.filter( item => item.type === 'motion');
    this.activeAuctions = activeItems.filter( item => item.type === 'auction');
  }

  clearStates(): void {
    this.activeSessionsIds = [];
    this.activeSessionsObjects = [];
    this.activeAuctions = [];
    this.activeMotions = [];
    this.activeItems = null;
    this.auctionsGroup = [];
    this.motionInstance = null;
    this.motionId = null;
    this.selectedAuction = null;
  }

}
