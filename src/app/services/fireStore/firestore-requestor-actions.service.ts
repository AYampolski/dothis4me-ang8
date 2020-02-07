import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '@services-cust/fireStore/api.service';
import { AuctionForm, AuctionInstance } from '@models-cust/auction.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreRequestorActionsService {

  constructor(
    private apiService: ApiService,
    private firebaseAuth: AngularFireAuth,
  ) { }



  getUserInfo() {
    const {displayName, uid, email, emailVerified } = this.firebaseAuth.auth.currentUser;
    return {displayName, uid, email, emailVerified};
  }

  createRequestObj(auctionForm: AuctionForm): AuctionInstance {
    const { bid, requirement, status } = auctionForm;
    const { displayName, uid } = this.getUserInfo();
    return {
      key: null,
      owner: uid,
      displayName,
      bid,
      isAsked: false,
      status,
      requirement,
      ask: null,
      deal: null
    };
  }

  createRequest(motionId: string, auctionForm: AuctionForm) {
    const auctionWithoutKey = this.createRequestObj(auctionForm);

    return this.apiService.addAuction(motionId, auctionWithoutKey);

  }

  updateAuction(motionId, auctionId, obj): Observable<void> {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }
}
