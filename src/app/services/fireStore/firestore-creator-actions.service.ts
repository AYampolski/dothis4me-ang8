import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from '@services-cust/fireStore/api.service';
import { MotionForm } from '@models-cust/motion.model';
import { AuctionInstance } from '@models-cust/auction.model';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    ) { }


  createMotion(motionForm: MotionForm): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.apiService.createMotionRefacted(motionForm)
    .pipe(filter( res => {
      return res !== undefined;
    }))
  }

  updateAsk(motionId: string, auctionId: string, obj: Partial<AuctionInstance> ): Observable<void> {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }


}
