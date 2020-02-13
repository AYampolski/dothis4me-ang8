import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services-app/fireStore/api.service';
import { MotionForm } from '@models-app/motion.model';
import { AuctionInstance } from '@models-app/auction.model';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { filter, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    ) { }


  createMotion(motionForm: MotionForm, userId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.apiService.createMotion(motionForm, userId)
    .pipe(filter( res => {
      return res !== undefined;
    }));
  }

  refreshConnection(motionId: string) {
    return this.apiService.refreshMotion(motionId).pipe( filter(snapshot => {
      return snapshot !== undefined;
    }),
    map( (item) => {
      const data = item.payload.data();
      return  (data) ;
    }));
  }

  updateAsk(motionId: string, auctionId: string, obj: Partial<AuctionInstance> ): Observable<void> {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }

  getMotionsAuctions(motionId: string) {
    return this.apiService.getMotionsAuctions(motionId);
  }

}
