import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DocumentChangeAction } from '@angular/fire/firestore';

import { from, Observable, combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { StateService } from '@services-app/state.service';
import { MotionInstance, errorMotionInstance, formMotionInstance } from '@models-app/motion.model';
import { ApiCommonService, ApiConst } from '@services-app/fireStore/api/api-common.service';

enum ErrorMessages  {
  noId = 'There is no motion with this id',
}

@Injectable({
  providedIn: 'root'
})
export class ApiMotionService {

  constructor(
    private stateService: StateService,
    private auth: AngularFireAuth,
    private apiCommon: ApiCommonService,
    ) { }

  /**
   * Get auctions related to the specific motion
   * @param { string } motionId
   */
  getMotionsAuctions(motionId: string) {
    return this.apiCommon.auctionRef.doc(motionId).collection('relatedAuctions').get();
  }

  /**
   * Add a motion created by the user to user's motion list .
   * @param { string } userId
   * @param { MotionInstance } motionInstance
   */
  addMotionToUser(userId: string, motionInstance: MotionInstance): Observable<void> {
    return from(this.apiCommon.usersRef.doc(userId)
                             .collection(ApiConst.motionCollectionName)
                             .doc(motionInstance.key)
                             .set(motionInstance));
  }

  /**
   *  Get motion by its id. If there is no motion it returns an object of MotionInstance with error in status
   * @param { string } motionId
   */
  getMotion(motionId: string): Observable<MotionInstance> {
    return this.apiCommon.motionRef.doc<MotionInstance>(motionId).get().pipe(
      map((item: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => {
        if (item.data()) {
          return item.data() as MotionInstance;
        } else {
          return errorMotionInstance(ErrorMessages.noId);
        }
      }),
    );
  }

  /**
   * Refresh connection/listening to a created motion after reload
   * @param { string } motionId
   */
  refreshMotion(motionId: string) {
    return this.getMotion(motionId).pipe(
      map(motion => {
        this.stateService.motionInstance = motion;
        return motion;
      }),
      mergeMap(motions => {
        return motions.key ? this.listenerAddedActions(motions.key) : of([]);
      }),
      map(ids => {
        const activeSnapshots = ids.filter( aucId => {
            const item = aucId.payload.doc.data().auctionId;
            return item;
          }
        );
        return activeSnapshots.map( snapshot => {
          return snapshot.payload.doc.data().auctionId;
        });
      }),
      map(ids => {
        if (this.stateService.activeSessionsIds.length === 0) {
          this.addAuctionRefreshed(ids);
          return ids;
        }  else {

          const newAuction = this.findNewAuction(ids);
          return [newAuction];
        }
      }),
      mergeMap( (activeIds: string[]) => {
        if (activeIds.length === 0) {
          return of(undefined);
        }
        return from(activeIds).pipe(
          mergeMap (
              id =>  this.apiCommon.listenerUpdatedAuction(this.stateService.motionInstance.key, id)
            ),
        );
      }),
    );
  }

  /**
   * Creates a common MotionInstance ready to be send
   * @param { MotionForm } param0
   */
  createMotionInstance(motionForm: Partial<MotionInstance>): MotionInstance {
    const { displayName, uid } = this.auth.auth.currentUser;
    const form = Object.assign({}, motionForm, {displayName, owner: uid});
    const motionObj = formMotionInstance(form);
    this.stateService.motionInstance = motionObj;
    this.stateService.motionId = motionObj.key;
    return motionObj;
  }

  /**
   * Saves to db a common instance of motion
   * @param { MotionInstance } motionObj
   */
  addMotionCollection(motionObj): Observable<void> {
    return from(this.apiCommon.motionRef.doc(motionObj.key).set(motionObj));
  }

  /**
   * Adds a collection of all related available auctions to selected motion (id)  and leter the motion's creator
   * will be available to recieve updates when a new auction will be added to this motion
   * @param {string} motionId
   */
  addMotionAuctionCollection(motionId: string): Observable<void> {
    return from(this.apiCommon.motionRef
                              .doc(motionId)
                              .collection(ApiConst.auctionList)
                              .doc('status')
                              .set({status: ApiConst.defaultStatus }));
  }

  /**
   * Adds a new auctions 'event listener' to selected motion
   * @param { string } motionId
   */
    listenerAddedActions(motionId: string) {
      return this.apiCommon.motionRef
                           .doc(motionId)
                           .collection(ApiConst.auctionList)
                           .snapshotChanges();
    }

  /**
   * Creates motion instance and saves it at db at root level /motions. This collection
   * contains a list of all motions were created.
   * @param { MotionForm } motionForm Partial of MotionInstance object
   */
  createMotion(motionForm: Partial<MotionInstance>, userId: string) {

    const motionObj = this.createMotionInstance(motionForm);
    this.stateService.motionInstance = motionObj;
    this.stateService.motionId = motionObj.key;
    const motionId = motionObj.key;

    return combineLatest([
                  this.addMotionCollection(motionObj),
                  this.addMotionAuctionCollection(motionId),
                  this.addMotionToUser(userId, motionObj),
            ])
            .pipe(

              mergeMap( () => {
                return this.listenerAddedActions(motionId);
              }),

              map( auctionsList => {
                return auctionsList.map(auction => auction.payload.doc.data()).filter(auction => auction.auctionId);
              }),

              mergeMap( (auctionsList: DocumentChangeAction<firebase.firestore.DocumentData>[] ) => {
                const newAuction = this.findNewAuction(auctionsList);
                if (newAuction) {
                  this.stateService.activeSessionsIds.push(newAuction.auctionId);
                  return this.apiCommon.listenerUpdatedAuction(motionId, newAuction.auctionId);
                }
                return of(undefined);
              })
            );
  }

  /**
   * Set active session ids
   * @param auctionList
   */
  private addAuctionRefreshed(auctionList) {
    this.stateService.activeSessionsIds = auctionList;
  }

  /**
   * Finds a new auction in a list of all created auctions
   * @param { DocumentChangeAction<firebase.firestore.DocumentData>[] } auctionList
   */
  private findNewAuction(auctionList) {
    if (!auctionList) {
      return null;
    }

    if (this.stateService.activeSessionsIds.length === 0) {
      const newAuction = auctionList.find( auction => {
        return auction.auctionId !== 'status';
      });
      if (newAuction) {
        return newAuction;
      }
    }

    return auctionList.find( auction => {
      return !(auction.auctionId === 'status') &&
            this.stateService.activeSessionsIds &&
            !this.stateService.activeSessionsIds.includes(auction.auctionId);
    });
  }
}
