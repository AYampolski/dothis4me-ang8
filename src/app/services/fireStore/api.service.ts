import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { MotionInstance, MotionAuctionItem, MotionForm } from '@models-cust/motion.model';
import { User } from '@models-cust/user.model';
import { switchMap, catchError, mergeMap, tap, map } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { throwError } from 'rxjs';

import { Router } from '@angular/router';

import { StateService } from '@services-cust/state.service';
import * as firebase from 'firebase';
import { AuctionInstance } from '@models-cust/auction.model';

enum ApiConsts {
  name = '[API_SERVICE]',
  addToDbError = 'Error User alredy registered',
  addMotionSuccessed = 'Add motions successed',
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
  private readonly auctionCollecitonName = 'auction';
  private readonly usersRef =  this.db.collection(this.usersCollectionName);
  private readonly motionRef = this.db.collection(this.motionCollectionName);
  private readonly auctionRef = this.db.collection(this.auctionCollecitonName);

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
        return throwError(`${ApiConsts.name} | ${ApiConsts.addToDbError}`);
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
    return this.motionRef.doc(motionId).get();
  }

  /**
   * Update standalone auction's ask value for requestor
   * @param { string } motionId
   * @param { string } auctionId
   * @param { number } bid
   */
  updateAuctionBid(motionId: string, auctionId: string, bid: number): Observable<void> {
    return from(this.auctionRef.doc(motionId).collection(ApiConsts.relatedAuctions).doc<AuctionInstance>(auctionId).update({bid}));
  }

  /**
   * Update standalone auction's ask value for creator
   * @param { string } motionId
   * @param { string }auctionId
   * @param { any } ask
   */
  updateAuctionProps(motionId: string, auctionId: string, obj: any): Observable<void> {
    return from(this.auctionRef.doc(motionId).collection(ApiConsts.relatedAuctions).doc<AuctionInstance>(auctionId).update(obj));
  }


  /**
   * Adds event listener to particular auction to determine the changes
   * @param { string } motionId
   * @param { string } auctionId
   */
  listenerForAuction(motionId: string, auctionId: string): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    return this.auctionRef.doc(motionId).collection(ApiConsts.relatedAuctions).doc<AuctionInstance>(auctionId).snapshotChanges();
  }


  /**
   * Add an auction to root level of db.
   *
   * @param { string } motionId
   * @param { AuctionInstance } auctionObj
   */
  addAuction(motionId: string, auctionObj: AuctionInstance): Observable<Action<DocumentSnapshot<AuctionInstance>>> {
    const auctionId = this.db.createId();
    auctionObj.key = auctionId;

    return this.addAuctionCommon(motionId, auctionObj).pipe(
      switchMap( () => {
        return this.addAuctionIdToList(motionId, auctionObj.key);
      }),

      switchMap( () => {
        return this.listenerForAuction(motionId, auctionId);
      }),

      switchMap( (changes) => {
        console.log('there is some changes');
        return of(changes);
      })
    );
  }


  /**
   * Saves a auction instance to db;
   * It will be listening for bid/ask changes in this path
   * @param { string } motionId
   * @param { AuctionInstance } auctionObj
   */
  addAuctionCommon(motionId: string, auctionObj: AuctionInstance): Observable<void> {
    return from(this.auctionRef.doc(motionId).collection(ApiConsts.relatedAuctions).doc(auctionObj.key).set(auctionObj));
  }

  /**
   * Creates motion instance and saves it at db at root level /motions. This collection
   * contains a list of all motions were created.
   * @param { MotionForm } motionForm Partial of MotionInstance object
   */
  createMotionRefacted(motionForm: MotionForm) {

    const motionObj = this.createMotionInstance(motionForm);
    const motionId = motionObj.key;

    this.router.navigate([`/motion/${motionId}`]);
    this.saveToDbMotionCommon(motionObj);

    return this.createMotionAuctionList(motionId).pipe(

      mergeMap( () => {
        return this.listenerForCreator(motionId);
      }),

      mergeMap( (auctionsList: DocumentChangeAction<firebase.firestore.DocumentData>[] ) => {
        const newAuction = auctionsList.find( auction => {
          const id = auction.payload.doc.id;
          return !(id === 'status') && !this.stateService.activeSessionsIds.includes(id);
        });

        if (newAuction) {
          const { id } = newAuction.payload.doc;
          this.stateService.activeSessionsIds.push(id);
          return this.listenerForAuction(motionId, id);
        }
        return from([0]);
      }),

      mergeMap( (updatedAuction: number | Action<DocumentSnapshot<AuctionInstance>>) => {

        if(typeof updatedAuction === 'number') {
          return from([0]);
        }
        return of(updatedAuction.payload.data());

        }
      ),

    );
  }


  /**
   * Adds id of created auction to motion list of auctions
   * @param { string } motionId
   * @param { string } auctionId
   */
  addAuctionIdToList(motionId: string, auctionId: string) {
    return from(this.motionRef.doc(motionId).collection(ApiConsts.auctionList).doc(auctionId).set({auctionId: true}));
  }

  /**
   * Adds a collection of all related available auctions to selected motion (id)  and leter the motion's creator
   * will be available to recieve updates when a new auction will be added to this motion
   * @param {string} motionId
   */
  createMotionAuctionList(motionId: string): Observable<void> {
    return from(this.motionRef.doc(motionId).collection(ApiConsts.auctionList).doc('status').set({status: ApiConsts.defaultStatus }));
  }


  /**
   * Creates a common MotionInstance ready to be send
   * @param { MotionForm } param0
   */
  createMotionInstance({title, proposal, lastCall }: MotionForm): MotionInstance {
    const motionId = this.db.createId();
    const { displayName, uid } = this.auth.auth.currentUser;
    const motionObj = {
      key: motionId,
      owner: uid,
      displayName,
      title,
      proposal,
      lastCall
    };
    this.stateService.newMotionInstance = motionObj;
    return motionObj;
  }

  /**
   * Saves to db a common instance of motion
   * @param { MotionInstance } motionObj
   */
  saveToDbMotionCommon(motionObj): void {
    this.motionRef.doc(motionObj.key).set(motionObj);
  }

  /**
   * Adds a new auctions 'event listener' to selected motion
   * @param { string } motionId
   */
  listenerForCreator(motionId: string): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
    return this.motionRef.doc(motionId).collection(ApiConsts.auctionList).snapshotChanges();
  }

}
