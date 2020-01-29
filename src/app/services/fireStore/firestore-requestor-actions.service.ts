import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApiService } from '@services-cust/fireStore/api.service';
import { } from '@services-cust/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreRequestorActionsService {

  constructor(
    private apiService: ApiService,
    private firebaseAuth: AngularFireAuth,
  ) { }

  // createRequest(motionId){
  //   this.apiService.createRequest(motionId);
  // }

  createRequest(motionId){
    this.apiService.doCreateRequestor(motionId);
  }

  getUserInfo() {
    const {displayName, uid, email, emailVerified } = this.firebaseAuth.auth.currentUser;
    return {displayName, uid, email, emailVerified};
  }

  createRequestObj({bid, requirement}){
    const {displayName, uid} = this.getUserInfo();
    return {
      key: null,
      owner: uid,
      displayName,
      bid,
      requirement,
      ask: null,
      deal: null
    }
  }

  newCreateRequest(requestorOptions) {
    const reqObj = this.createRequestObj(requestorOptions);
    console.log(reqObj);
  }

  updateBid(motionId = '0vMC3VCUbGEmg0qY10lq', aucitonId="W8lXtquuHwSAiFNZ37PZ", bid = 1488){
    this.apiService.doUpdateBid(motionId, aucitonId, bid);
  }
}
