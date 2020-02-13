import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '@services-app/fireStore/api.service';
import { StateService } from '@services-app/state.service';
import { AuctionForm, AuctionInstance } from '@models-app/auction.model';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FirestoreRequestorActionsService {

  constructor(
    private apiService: ApiService,
    private firebaseAuth: AngularFireAuth,
    public stateService: StateService,
  ) { }



  getUserInfo() {
    const {displayName, uid, email, emailVerified } = this.firebaseAuth.auth.currentUser;
    return {displayName, uid, email, emailVerified};
  }

  createRequestObj(auctionForm: AuctionForm): AuctionInstance {
    const lastCall = moment().valueOf();
    const type = 'auction';
    const { bid, requirement, status } = auctionForm;
    const { displayName, uid } = this.getUserInfo();
    return {
      type,
      key: null,
      owner: uid,
      displayName,
      bid,
      status,
      requirement,
      ask: null,
      deal: null,
      lastCall
    };
  }

  createRequest(motionId: string, auctionForm: AuctionForm) {
    const auctionWithoutKey = this.createRequestObj(auctionForm);

    return this.apiService.createAuction(motionId, auctionWithoutKey, this.stateService.user.uid);

  }

  updateAuction(motionId, auctionId, obj): Observable<void> {
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }
}
