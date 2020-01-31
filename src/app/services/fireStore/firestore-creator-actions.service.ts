import { Injectable } from '@angular/core';

import { ApiService } from '@services-cust/fireStore/api.service';

import { StateService } from '@services-cust/state.service';
import { MotionForm } from '@models-cust/motion.model';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuctionInstance } from '@models-cust/auction.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    ) { }


  addListener(motionId) {
    return this.apiService.motionListener(motionId).subscribe(val => {
      console.log('[CREATETOR UPDATER] ', val);
    },
      err => {
        console.log('[CREATETOR UPDATER] ', err);
      }
    );
  }


  // =====================

  createMotion(motionForm: MotionForm): Observable<number | AuctionInstance> {
    return this.apiService.createMotionRefacted(motionForm); //.subscribe(res => console.log(res));
    // this.apiService.createMotion(motionForm);
  }

  // motionId: string, auctionId: string, ask: number
  updateAsk(motionId: string, auctionId: string, obj: any) {
    return this.apiService.updateAuctionAsk(motionId, auctionId, obj);
  }


}
