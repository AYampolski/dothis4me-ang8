import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from '@services-app/fireStore/api.service';
import { AuctionInstance } from '@models-app/auction.model';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { filter, map } from 'rxjs/operators';
import { MotionInstance } from '@models-app/motion.model';


@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    ) { }


  createMotion(motionForm: Partial<MotionInstance>, userId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.apiService.createMotion(motionForm, userId)

    // .pipe(filter( res => {
    //   return res !== undefined;
    // }));
  }

  refreshConnection(motionId: string) {
    return this.apiService.refreshMotion(motionId).pipe(
    map( (item) => {
      if(item){
        return  item.payload.data();
      }
      return of(undefined)
    }));
  }

  updateAsk(motionId: string, auctionId: string, obj: Partial<AuctionInstance> ): Observable<void> {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }

  getMotionsAuctions(motionId: string) {
    return this.apiService.getMotionsAuctions(motionId);
  }

}
