import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiAuctionService } from '@services-app/fireStore/api/api-auction.service';
import { StateService } from '@services-app/state.service';
import { AuctionInstance } from '@models-app/auction.model';
import { Observable } from 'rxjs';
import { ApiCommonService } from '@services-app/fireStore/api/api-common.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FirestoreAuctionsService {

  constructor(
    private apiService: ApiAuctionService,
    private apiCommon: ApiCommonService,
    private firebaseAuth: AngularFireAuth,
    public stateService: StateService,
  ) { }



  getUserInfo() {
    const {displayName, uid, email, emailVerified } = this.firebaseAuth.auth.currentUser;
    return {displayName, uid, email, emailVerified};
  }

  createRequestObj(auctionForm: Partial<AuctionInstance>): AuctionInstance {
    const lastCall = moment().valueOf();
    const type = 'auction';
    const { bid, requirement, status, key } = auctionForm;
    const { displayName, uid } = this.getUserInfo();
    return {
      type,
      key,
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

  createRequest(motionId: string, auctionForm: Partial<AuctionInstance>) {
    const auctionWithoutKey = this.createRequestObj(auctionForm);

    return this.apiService.createAuction(motionId, auctionWithoutKey, this.stateService.user.uid);

  }

  refreshAuctionConnection(motionId, auctionId) {
    return this.apiService.refreshAuction(motionId, auctionId);
  }

  updateAuction(motionId, auctionId, obj): Observable<void> {
    return this.apiCommon.updateAuctionProps(motionId, auctionId, obj);
  }
}
