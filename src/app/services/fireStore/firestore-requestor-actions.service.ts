import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '@services-cust/fireStore/api.service';
import { AuctionForm, AuctionInstance } from '@models-cust/auction.model';

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
    const { bid, requirement } = auctionForm;
    const {displayName, uid} = this.getUserInfo();
    return {
      key: null,
      owner: uid,
      displayName,
      bid,
      isAsked: false,
      requirement,
      ask: null,
      deal: null
    };
  }

  //CREATE REQUEST
  newCreateRequest(motionId: string, auctionForm: AuctionForm) {
    const auctionWithoutKey = this.createRequestObj(auctionForm);

    return this.apiService.addAuction(motionId, auctionWithoutKey);

  }

  updateBid(motionId = '0vMC3VCUbGEmg0qY10lq', aucitonId="W8lXtquuHwSAiFNZ37PZ", bid = 1488){
    this.apiService.doUpdateBid(motionId, aucitonId, bid);
  }

  updateAuction(motionId, auctionId, obj){
    return this.apiService.updateAuctionProps(motionId, auctionId, obj);
  }
}
