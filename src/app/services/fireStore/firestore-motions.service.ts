import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiMotionService } from '@services-app/fireStore/api/api-motion.service';
import { AuctionInstance } from '@models-app/auction.model';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { MotionInstance } from '@models-app/motion.model';
import { ApiCommonService } from '@services-app/fireStore/api/api-common.service';


@Injectable({
  providedIn: 'root'
})
export class FirestoreMotionsService {

  constructor(
    private apiService: ApiMotionService,
    private apiCommon: ApiCommonService
    ) { }


  createMotion(motionForm: Partial<MotionInstance>, userId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.apiService.createMotion(motionForm, userId);
  }

  refreshConnection(motionId: string) {
    return this.apiService.refreshMotion(motionId).pipe(
    map( (item) => {
      if (item) {
        return  item.payload.data();
      }
      return of(undefined);
    }));
  }

  updateAsk(motionId: string, auctionId: string, obj: Partial<AuctionInstance> ): Observable<void> {
    return this.apiCommon.updateAuctionProps(motionId, auctionId, obj);
  }

  getMotionsAuctions(motionId: string) {
    return this.apiService.getMotionsAuctions(motionId);
  }

}
