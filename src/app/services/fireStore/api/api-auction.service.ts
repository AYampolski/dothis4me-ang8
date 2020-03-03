import { Injectable } from '@angular/core';
import { from, Observable, combineLatest } from 'rxjs';
import { AuctionInstance } from '@models-app/auction.model';
import { ApiCommonService, ApiConst } from '@services-app/fireStore/api/api-common.service';
import { switchMap } from 'rxjs/operators';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiAuctionService {

  constructor(
    private apiCommon: ApiCommonService,
  ) { }

  /**
   * Adds id of created auction to motion list of auctions
   * @param { string } motionId
   * @param { string } auctionId
   */
  addMotionAuctionInstance(motionId: string, auctionId: string) {
    return from(this.apiCommon.motionRef.doc(motionId).collection(ApiConst.auctionList).doc(auctionId).set({auctionId}));
  }

  /**
   * Add an auction to root level of db.
   *
   * @param { string } motionId
   * @param { AuctionInstance } auctionObj
   */
  createAuction(motionId: string, auctionObj: AuctionInstance, userId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return combineLatest([
      this.addAuctionCollection(motionId, auctionObj),
      this.addAuctionToUser(userId, auctionObj),
      this.addMotionAuctionInstance(motionId, auctionObj.key),
    ]).pipe(
      switchMap( () => {
        return this.apiCommon.listenerUpdatedAuction(motionId, auctionObj.key);
      }),
    );
  }

  /**
   * Saves a auction instance to db;
   * It will be listening for bid/ask changes in this path
   * @param { string } motionId
   * @param { AuctionInstance } auctionObj
   */
  addAuctionCollection(motionId: string, auctionObj: AuctionInstance): Observable<void> {
    return from(this.apiCommon.auctionRef.doc(motionId)
                               .collection(ApiConst.relatedAuctions)
                               .doc(auctionObj.key)
                               .set(auctionObj));
  }

  /**
   * Add an auction to user's auction list created by the user.
   * @param { string } userId
   * @param { AuctionInstance } auctionInstance
   */
  addAuctionToUser(userId: string, auctionInstance: AuctionInstance ): Observable<void> {
    return from(this.apiCommon.usersRef.doc(userId)
                             .collection(this.apiCommon.auctionCollectionName)
                             .doc(auctionInstance.key)
                             .set(auctionInstance));
  }

  /**
   * Get active auction with changeable properties
   * @param { string } motionId
   * @param { string } auctionId
   */
  getChangeableAuction(motionId: string, auctionId: string) {
    return this.apiCommon.auctionRef.doc(motionId).collection('relatedAuctions').doc(auctionId).get();
  }

  /**
   * Refresh connection to auction, its listener
   * @param motionId
   * @param auctionId
   */
  refreshAuction(motionId,auctionId) {
    return this.getChangeableAuction(motionId, auctionId).pipe(
      switchMap( (motion) => {
        return this.apiCommon.listenerUpdatedAuction(motionId, auctionId);
      }),
    );
  }
}
