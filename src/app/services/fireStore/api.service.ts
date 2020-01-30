import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { MotionInstance, MotionAuctionItem, MotionForm } from '@models-cust/motion.model';
import { User } from '@models-cust/user.model';
import { switchMap, catchError, mergeMap, tap, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { throwError } from 'rxjs';

import { Router } from '@angular/router';

import { StateService } from '@services-cust/state.service';
import * as firebase from 'firebase';

enum ApiConsts {
  name = '[API_SERVICE]',
  addToDbError = 'Error User alredy registered',
  addMotionSuccessed = 'Add motions successed',
  addMotionError = 'Add motions with error',
  addMotionStart = 'Add motion starts',
  auctionList = 'auctions',
  defaultStatus = 'pending',
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  requestorObj = {
    key: '322Solo',
    owner: 'testOnwer',
    requirement: 'buy something',
    bid: 12,
    ask: null,
    deal: null
  };


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


  motionListener(motionId): Observable<Action<DocumentSnapshot<any>>> {
    return this.motionRef.doc(motionId).snapshotChanges();
  }

  createAuction(motionId) {
    return this.motionRef.doc(motionId)
      .collection(this.auctionCollecitonName)
      .doc('status').set({status: 'pending'});
  }

  autcionListener(motionId) {
    this.motionRef.doc(motionId).collection(this.auctionCollecitonName).snapshotChanges().subscribe(
      snap => {
        console.log('[UPDATES] == ', snap.values().next());
        this.auctionRef
          .doc(motionId)
          .snapshotChanges().subscribe(next => {
            console.log('[!!!! CREATOR] ===> ', next);
           });
      }
    );
  }

  auctionSepListener(aucId, motionId) {
    return this.auctionRef.doc(motionId).collection('auctionsList').doc(aucId).snapshotChanges();
  }


  getMotion(motionId: string = '2n4RvDMe5TI3DTNBPO90') {
    return this.motionRef.doc(motionId).get();
  }



  createRequest(motionId) {
    const id = this.db.createId();
    this.auctionRef.doc(motionId).collection(id).doc(this.requestorObj.key).set(this.requestorObj).then(
      res => {
        this.auctionRef
          .doc(motionId)
          .collection(id)
          .doc(this.requestorObj.key)
          .snapshotChanges().subscribe(next => {
            console.log('[!!!! REQUESTOR] ===> ', next);
           });
      });
    }


  //  =======
    newCreateMotion(motionObject) {
      const id = this.db.createId();
      const ownerInfo = this.stateService.user.displayName;
      const motionObjectSent = Object.assign({}, motionObject, {key: id}, {ownerInfo});
      this.stateService.newMotionInstance = motionObjectSent;

      this.motionRef.doc(id)
        .collection(this.auctionCollecitonName)
        .doc('status').set({status: 'pending'}).then( val => {
          this.motionRef.doc(id).collection(this.auctionCollecitonName).snapshotChanges().subscribe( () => {
            console.log('UPDATED CREATOR');
          });
        });
    }



  //  **************

  testMotionObj(motionId) {
    return {
      key: motionId,
      owner: `test-user-${Math.floor(Math.random() * 100000 )}`,
      title: `test=title=${Math.floor(Math.random() * 1000)}`,
      proposal: `test+propposal+${Math.floor(Math.random() * 100)}`,
      lastCall:  1580205750242
    };
  }

  updatedAction() {
    return {

      bid: '00',

    };
  }

  testAuctionObj(auctionId) {
    return {
      key: auctionId,
      owner: `test-user-${Math.floor(Math.random() * 100000 )}`,
      displayName: `Ted-${Math.floor(Math.random() * 200)}`,
      requirement: `do this for me --- ${Math.floor(Math.random() * 1000)}`,
      bid: `${Math.floor(Math.random() * 100)}`,
      ask: 0,
      deal: null
    };
  }

  createAuctionInstance(auctionId, {uid, displayName}, {requirement, bid}) {
    return {
      key: auctionId,
      owner: uid,
      displayName,
      requirement,
      bid,
      ask: null,
      deal: null
    };
  }

  doUpdateBid(motionId, aucitonId, bid) {

      const ref = this.auctionRef.doc(motionId).collection('auctionList').doc(aucitonId);

      const newRef = firebase.database().ref(`auction/${motionId}/auctionList/${aucitonId}`);
      newRef.transaction( an => {
        console.log('look1', an); return this.updatedAction();
      },
      onComplete => {console.log('look2 > complete', onComplete); }).then( val => console.log('it is a final coutdouw ', val));
  }

  doCreateRequestor(motionId) {
    const auctionId = this.db.createId();
    const auctionObj = this.testAuctionObj(auctionId);
    this.doRequestorAdd(motionId, auctionId, auctionObj).then( v => {
      console.log('??????? add?');
      this.listenerForAuction(motionId, auctionId).subscribe(val => {
        console.log('requestor is updated', val);
        console.log('!!!!', val.payload.data());
      });
      this.doCreateRequestorMotionAuctionList(motionId, auctionId);
    }, err => {console.log(err); });
  }

  doCreateRequestorMotionAuctionList(motionId, auctionId) {
    this.motionRef.doc(motionId).collection(ApiConsts.auctionList).doc(auctionId).set({status: 'pending'});
  }

  createRequestorMotionAuctionList(motionId, auctionId) {
    return this.motionRef
                  .doc(motionId)
                  .collection(ApiConsts.auctionList)
                  .doc(auctionId)
                  .set({status: 'pending'});
  }

  doRequestorAdd(motionId, auctionId, auctionObj) {
    console.log('auctionId ',  auctionId);
    return this.auctionRef.doc(motionId).collection('auctionList').doc(auctionId).set(auctionObj);
  }


  listenerForAuction(motionId, auctionId): Observable<Action<DocumentSnapshot<unknown>>> {
    return this.auctionRef.doc(motionId).collection('auctionList').doc(auctionId).snapshotChanges();
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
          const { id, data } = newAuction.payload.doc;
          this.stateService.activeSessionsIds.push(id);
          this.stateService.activeSessionsObjects.push(data());
          return this.listenerForAuction(motionId, id);
        }
        return from([0]);
      }),

      mergeMap( next => {
        console.log('[!!!] step 3 > ', next);
        return from([1]);
        }
      ),

    );
  }


  /**
   * Adds to selected motion (id) a collection of all related available auctions and leter the motion's creator
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
