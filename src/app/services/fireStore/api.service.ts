import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot, DocumentChangeAction, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';
import { from, Observable, of, throwError, combineLatest } from 'rxjs';
import * as moment from 'moment';


import { MotionInstance } from '@models-app/motion.model';
import { User } from '@models-app/user.model';
import { StateService } from '@services-app/state.service';
import { AuctionInstance } from '@models-app/auction.model';

enum ApiConst {
  name = '[API_SERVICE]',
  addToDbError = 'Error User already registered',
  addMotionSuccessfully = 'Add motions successfully',
  addMotionError = 'Add motions with error',
  addMotionStart = 'Add motion starts',
  auctionList = 'auctions',
  defaultStatus = 'pending',
  relatedAuctions = 'relatedAuctions',
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly motionCollectionName = 'motions';
  private readonly usersCollectionName = 'users';
  private readonly auctionCollectionName = 'auctionsInteraction';
  private readonly itemsCollectionName = 'items';
  private readonly usersRef =  this.db.collection(this.usersCollectionName);
  private readonly motionRef = this.db.collection(this.motionCollectionName);
  private readonly auctionRef = this.db.collection(this.auctionCollectionName);

  constructor(
    private db: AngularFirestore,
    private stateService: StateService,
    private router: Router,
    private auth: AngularFireAuth
    ) { }

  addUserToDb(user: User): Observable<void> {
    return from(this.usersRef.doc(user.uid).get()).pipe(
     switchMap(userResponse => {
       if (userResponse.exists) {
        return throwError(`${ApiConst.name} | ${ApiConst.addToDbError}`);
       } else {
        return from(this.usersRef.doc(user.uid).set(user));
       }
     }),
     catchError(error => {
       return throwError(error);
     })
    );
  }
  getMotion(motionId: string) {
    return this.motionRef.doc(motionId).get().pipe(
      map(item => {
        if(item.data()) {
          return item.data() as MotionInstance;
        } else {
          return this.createMotionError('There is no motion with this id');
        }
      }),
      // catchError( () => of('caught'))
    );
  }

  addActiveItems(item: MotionInstance | AuctionInstance, type: string) {
    return this.usersRef.doc(item.owner)
                        .collection(this.itemsCollectionName)
                        .doc(item.key)
                        .set(Object.assign({}, item, type));
  }

  createUniqueId(): string{
    return this.db.createId();
  }

  /**
   * Get user's active motions/auctions
   * @param { string } userId
   */
  getActiveItems(userId: string) {
    const currentTime = moment().valueOf();
    return this.usersRef.doc(userId)
                        .collection(this.itemsCollectionName, ref => ref.where('lastCall', '>=', currentTime))
                        .snapshotChanges();
  }


  /**
   * Get user's active motion
   * @param { string } userId
   */
  getActiveMotion(userId: string) {
    return this.usersRef.doc(userId)
                        .collection(this.motionCollectionName, ref => ref.where('status', '==', '0'));
  }

  /**
   * Get user's active auctions
   * @param { string } userId
   */
  getActiveAuctions(userId: string): AngularFirestoreCollection<firebase.firestore.DocumentData> {
    const currentTime = moment().valueOf();
    return this.usersRef.doc(userId)
                        .collection(this.auctionCollectionName, ref => ref
                                      .where('status', '==', 'pending')
                                      .where('lastCall', '>=', currentTime)
                                    );
  }

  /**
   * Add a motion to user's motion list created by the user.
   * @param { string } userId
   * @param { MotionInstance } motionInstance
   */
  addMotionToUser(userId: string, motionInstance: MotionInstance): Observable<void> {
    return from(this.usersRef.doc(userId)
                             .collection(this.motionCollectionName)
                             .doc(motionInstance.key)
                             .set(motionInstance));
  }

  /**
   * Add an auction to user's auction list created by the user.
   * @param { string } userId
   * @param { AuctionInstance } auctionInstance
   */
  addAuctionToUser(userId: string, auctionInstance: AuctionInstance ): Observable<void> {
    return from(this.usersRef.doc(userId)
                             .collection(this.auctionCollectionName)
                             .doc(auctionInstance.key)
                             .set(auctionInstance));
  }

  /**
   * Update standalone auction's ask value for requestor
   * @param { string } motionId
   * @param { string } auctionId
   * @param { number } bid
   */
  updateAuctionBid(motionId: string, auctionId: string, bid: number): Observable<void> {
    return from(this.auctionRef.doc(motionId)
                               .collection(ApiConst.relatedAuctions)
                               .doc<AuctionInstance>(auctionId)
                               .update({bid}));
  }

  /**
   * Update standalone auction's ask value for creator
   * @param { string } motionId
   * @param { string }auctionId
   * @param { any } ask
   */
  updateAuctionProps(motionId: string, auctionId: string, obj: Partial<AuctionInstance>) {
    return from(this.auctionRef.doc(motionId)
                               .collection(ApiConst.relatedAuctions)
                               .doc<AuctionInstance>(auctionId)
                               .update(obj));
  }


  /**
   * Adds event listener to particular auction to determine the changes
   * @param { string } motionId
   * @param { string } auctionId
   */
  listenerUpdatedAuction(motionId: string, auctionId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.auctionRef.doc(motionId)
                          .collection(ApiConst.relatedAuctions)
                          .doc<AuctionInstance>(auctionId).snapshotChanges();
  }

  /**
   * Refresh connection to auction, its listener
   * @param motionId
   * @param auctionId
   */
  refreshAuction(motionId,auctionId) {
    return this.getChangeableAuction(motionId,auctionId).pipe(
      switchMap( (motion) => {
        console.log('[Check = check ]', motion);
        return this.listenerUpdatedAuction(motionId, auctionId);
      }),
    )
  }

  /**
   * Add an auction to root level of db.
   *
   * @param { string } motionId
   * @param { AuctionInstance } auctionObj
   */
  createAuction(motionId: string, auctionObj: AuctionInstance, userId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    // const auctionId = this.db.createId();
    // auctionObj.key = auctionId;

    return combineLatest([
      this.addAuctionCollection(motionId, auctionObj),
      this.addAuctionToUser(userId, auctionObj),
      this.addMotionAuctionInstance(motionId, auctionObj.key),
      this.addActiveItems(auctionObj, 'auction'),
    ]).pipe(
      switchMap( () => {
        return this.listenerUpdatedAuction(motionId, auctionObj.key);
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
    return from(this.auctionRef.doc(motionId)
                               .collection(ApiConst.relatedAuctions)
                               .doc(auctionObj.key)
                               .set(auctionObj));
  }

  /**
   * Creates motion instance and saves it at db at root level /motions. This collection
   * contains a list of all motions were created.
   * @param { MotionForm } motionForm Partial of MotionInstance object
   */
  createMotion(motionForm: Partial<MotionInstance>, userId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {

    const motionObj = this.createMotionInstance(motionForm);
    this.stateService.motionInstance = motionObj;
    this.stateService.motionId = motionObj.key;
    const motionId = motionObj.key;

    // this.router.navigate([`/motion/${motionId}`]);


    return combineLatest([
                  this.addMotionCollection(motionObj),
                  this.addMotionAuctionCollection(motionId),
                  this.addMotionToUser(userId, motionObj),
                  this.addActiveItems(motionObj, 'motion')
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
                  return this.listenerUpdatedAuction(motionId, newAuction.auctionId);
                }
                return of(undefined);
              })
            );
  }

  getChangeableAuction(motionId: string, auctionId: string) {
    return this.auctionRef.doc(motionId).collection('relatedAuctions').doc(auctionId).get();
  }

  getMotionsAuctions(motionId: string) {
    return this.auctionRef.doc(motionId).collection('relatedAuctions').get();
  }


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
              id =>  this.listenerUpdatedAuction(this.stateService.motionInstance.key, id)
            ),
        );
      }),
    );
  }


  /**
   * Adds id of created auction to motion list of auctions
   * @param { string } motionId
   * @param { string } auctionId
   */
  addMotionAuctionInstance(motionId: string, auctionId: string) {
    return from(this.motionRef.doc(motionId).collection(ApiConst.auctionList).doc(auctionId).set({auctionId}));
  }

  /**
   * Adds a collection of all related available auctions to selected motion (id)  and leter the motion's creator
   * will be available to recieve updates when a new auction will be added to this motion
   * @param {string} motionId
   */
  addMotionAuctionCollection(motionId: string): Observable<void> {
    return from(this.motionRef.doc(motionId).collection(ApiConst.auctionList).doc('status').set({status: ApiConst.defaultStatus }));
  }


  /**
   * Creates a common MotionInstance ready to be send
   * @param { MotionForm } param0
   */
  createMotionInstance({title, proposal, lastCall, key }: Partial<MotionInstance>): MotionInstance {
    const { displayName, uid } = this.auth.auth.currentUser;
    const motionObj = {
      key,
      owner: uid,
      displayName,
      title,
      proposal,
      lastCall,
      status: 0
    };
    this.stateService.motionInstance = motionObj;
    this.stateService.motionId = motionObj.key;
    return motionObj;
  }


  createMotionError(error) {
    return {
      key: null,
      owner: null,
      displayName: null,
      title: null,
      proposal: null,
      lastCall: null,
      status: error
    };
  }

  /**
   * Saves to db a common instance of motion
   * @param { MotionInstance } motionObj
   */
  addMotionCollection(motionObj): Observable<void> {
    return from(this.motionRef.doc(motionObj.key).set(motionObj));
  }

  /**
   * Adds a new auctions 'event listener' to selected motion
   * @param { string } motionId
   */
  // listenerAddedActions(motionId: string): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
  listenerAddedActions(motionId: string) {
    return this.motionRef.doc(motionId).collection(ApiConst.auctionList).snapshotChanges();
  }

  /**
   * Finds a new auction in a list of all created auctions
   * @param { DocumentChangeAction<firebase.firestore.DocumentData>[] } auctionList
   */
  private findNewAuction(auctionList) {
    if (!auctionList) {
      return null;
    }
    if(this.stateService.activeSessionsIds.length === 0) {
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

  private addAuctionRefreshed(auctionList) {

      this.stateService.activeSessionsIds = auctionList;


  }

}
