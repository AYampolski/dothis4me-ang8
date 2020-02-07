import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services-app/fireStore/api.service';
import { MotionForm } from '@models-app/motion.model';
import { AuctionInstance } from '@models-app/auction.model';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    ) { }


  createMotion(motionForm: MotionForm): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.apiService.createMotion(motionForm)
    .pipe(filter( res => {
      return res !== undefined;
    }));
  }

  updateAsk(motionId: string, auctionId: string, obj: Partial<AuctionInstance> ): Observable<void> {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }


}
