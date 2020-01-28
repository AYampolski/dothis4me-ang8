import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';

import { MotionInstance } from '@models-cust/motion.model';
import { User } from '@models-cust/user.model';
import { switchMap, catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { throwError } from 'rxjs';

import { StateService } from '@services-cust/state.service';

enum ApiConsts {
  name = '[API_SERVICE]',
  addToDbError = 'Error User alredy registered',
  addMotionSuccessed = 'Add motions successed',
  addMotionError = 'Add motions with error',
  addMotionStart = 'Add motion starts',
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
  }


  private readonly motionCollectionName = 'motions';
  private readonly usersCollectionName = 'users';
  private readonly auctionCollecitonName = 'auction';
  private readonly usersRef =  this.db.collection(this.usersCollectionName);
  private readonly motionRef = this.db.collection(this.motionCollectionName);
  private readonly auctionRef = this.db.collection(this.auctionCollecitonName);

  constructor(
    private db: AngularFirestore,
    private stateService: StateService
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

  addMotion(motionObject: MotionInstance): Observable<void> {

    const id = this.db.createId();
    const ownerInfo = this.stateService.user.displayName;
    const motionObjectSent = Object.assign({}, motionObject, {key: id}, {ownerInfo});
    this.stateService.newMotionInstance = motionObjectSent;

    this.createAuction(id).then(v => {
      console.log('??!?!?!', v);
      this.autcionListener(id);
    });

    // this.auctionRef.doc(id).set({some: 'data'}).then(val => {
    //   this.auctionRef
    //   .doc(id)
    //   .collection(id)
    //   .doc(this.requestorObj.key)
    //   .snapshotChanges().subscribe(next => {
    //     console.log('[!!!! REQUESTOR] ===> ', next);
    //    });
    // })

    console.warn(`${ApiConsts.name} | ${ApiConsts.addMotionStart} | ${motionObjectSent}`);
    return from(this.db.collection(this.motionCollectionName).doc(id).set(motionObjectSent));

  }

  motionListener(motionId): Observable<Action<DocumentSnapshot<any>>> {
    return this.motionRef.doc(motionId).snapshotChanges();
  }

  createAuction(motionId) {
    // const id = this.db.createId();
    return this.motionRef.doc(motionId)
      .collection(this.auctionCollecitonName)
      .doc('status').set({status: 'pending'});  //.add({status: 'panding'});
  }

  autcionListener(motionId){
    this.motionRef.doc(motionId).collection(this.auctionCollecitonName).snapshotChanges().subscribe(
      snap => {
        console.log('[UPDATES] == ', snap.values().next());
        const aucitonId =  snap.values().next().value.payload.doc.id;
        this.auctionRef
          .doc(motionId)
          // .collection(aucitonId)
          // .doc(this.requestorObj.key)
          .snapshotChanges().subscribe(next => {
            console.log('[!!!! CREATOR] ===> ', next);
           });
      }
    )
  }




  auctionSepListener(aucId, motionId){
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
    newCreateMotion(motionObject){
      const id = this.db.createId();
      const ownerInfo = this.stateService.user.displayName;
      const motionObjectSent = Object.assign({}, motionObject, {key: id}, {ownerInfo});
      this.stateService.newMotionInstance = motionObjectSent;

      this.motionRef.doc(id)
        .collection(this.auctionCollecitonName)
        .doc('status').set({status: 'pending'}).then( val => {
          this.motionRef.doc(id).collection(this.auctionCollecitonName).snapshotChanges().subscribe( val => {
            console.log('UPDATED CREATOR');
          });
        })
    }

}
