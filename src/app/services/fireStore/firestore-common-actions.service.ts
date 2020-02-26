import { Injectable } from '@angular/core';

import { ApiService } from '@services-app/fireStore/api.service';
import { StateService } from '@services-app/state.service';
import { map } from 'rxjs/operators';
import { MotionInstance } from '@models-app/motion.model';

import { ToastMessagesService } from '@services-app/toast-messages.service';
import { AuctionInstance } from '@models-app/auction.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCommonActionsService {

  constructor(
    public stateService: StateService,
    private apiService: ApiService,
    private toastrService: ToastMessagesService
  ) { }

  setMotionToState(motion: MotionInstance) {
    this.stateService.motionInstance = motion;
  }

  getActiveItems(userId: string) {
    return this.apiService.getActiveItems(userId);
  }

  getMotionById(id: string) {
    return this.apiService.getMotion(id).pipe(
      map(motion => {
        if (motion.owner) {
          this.setMotionToState(motion);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getMotionInstance(id: string) {
    return this.apiService.getMotion(id);
  }

   updatedAuctionReceive(updatedAuction, index): void {
    if (!updatedAuction.deal) {
      const { iconList } = this.stateService;
      updatedAuction.status = this.stateService.activeSessionsObjects[index].bid === updatedAuction.bid ? iconList.ask : iconList.pending;
      this.toastrService.auctionUpdate(updatedAuction.displayName);
    } else {
      this.toastrService.auctionAccept(updatedAuction.displayName);
    }
    this.stateService.activeSessionsObjects[index] = updatedAuction;
  }

  newAuctionReceive(updatedAuction): void {
    // updatedAuction.status = this.stateService.iconList.pending;
    this.toastrService.auctionNew(updatedAuction.displayName);
    this.stateService.activeSessionsObjects.push(updatedAuction);
  }

  handleAuctions(updatedAuctionSnapshot) {
    if (!updatedAuctionSnapshot) {
      return;
    }
    const updatedAuction = updatedAuctionSnapshot.payload ? updatedAuctionSnapshot.payload.data() : updatedAuctionSnapshot;
    const changedIndex = this.stateService.activeSessionsObjects.findIndex((item: AuctionInstance) => {
      return item.key === updatedAuction.key;
    });
    if (changedIndex > -1) {
      this.updatedAuctionReceive(updatedAuction, changedIndex);
    } else {
      this.newAuctionReceive(updatedAuction);
    }
  }

  createId(): string {
    return this.apiService.createUniqueId();
  }
}
