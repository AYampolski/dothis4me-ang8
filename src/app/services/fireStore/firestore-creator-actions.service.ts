import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services-cust/fireStore/api.service';
import { MotionForm } from '@models-cust/motion.model';
import { AuctionInstance } from '@models-cust/auction.model';


@Injectable({
  providedIn: 'root'
})
export class FirestoreCreatorActionsService {

  constructor(
    private apiService: ApiService,
    ) { }


  createMotion(motionForm: MotionForm): Observable<number | AuctionInstance> {
    return this.apiService.createMotionRefacted(motionForm);
  }

  updateAsk(motionId: string, auctionId: string, obj: any) {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }


}
