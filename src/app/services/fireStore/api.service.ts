import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';

import { MotionInstance, MotionAuctionItem} from '@models-cust/motion.model';
import { User } from '@models-cust/user.model';
import { switchMap, catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { throwError } from 'rxjs';

import { Router } from '@angular/router';

import { StateService } from '@services-cust/state.service';

enum ApiConsts {
  name = '[API_SERVICE]',
  addToDbError = 'Error User alredy registered',
  addMotionSuccessed = 'Add motions successed',
  addMotionError = 'Add motions with error',
  addMotionStart = 'Add motion starts',
  auctionList = 'auctions'
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
    private stateService: StateService,
    private router: Router,
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



  //  **************

  testMotionObj(motionId){
    return {
      key: motionId,
      owner: `test-user-${Math.floor(Math.random() * 100000 )}`,
      title: `test=title=${Math.floor(Math.random() * 1000)}`,
      proposal: `test+propposal+${Math.floor(Math.random() * 100)}`,
      lastCall:  1580205750242
    }
  }

  testAuctionObj(auctionId){
    return {
      key: auctionId,
      owner: `test-user-${Math.floor(Math.random() * 100000 )}`,
      displayName: `Ted-${Math.floor(Math.random()*200)}`,
      requirement: `do this for me --- ${Math.floor(Math.random() * 1000)}`,
      bid: `${Math.floor(Math.random() * 100)}`,
      ask: 0,
      deal: null
    }
  }

  doCreateMotion(motionObj){
    const motionId = this.db.createId();
    // if(!motionObj) {
      motionObj = this.testMotionObj(motionId);
      this.stateService.newMotionInstance = motionObj;
    // }
    this.router.navigate([`/motion/${motionId}`]);
    console.log(motionId);
    this.motionRef.doc(motionId).set(motionObj);
    this.doCreateMotionAuctionList(motionId).then( v => {
      this.doListenerForCreator(motionId).subscribe(next => {
        next.forEach( el => {
          const id = el.payload.doc.id;
          if(id == 'status'){
            return;
          }
          if (!this.stateService.activeSessionsIds.includes(id)) {
            this.stateService.activeSessionsIds.push(id);
            // const dataPr = el.payload.doc.data();
            // this.stateService.activeSessionsObjects.push(dataPr);
            console.log(this.stateService.activeSessionsObjects);
            this.yoListenerForAuction(motionId, id).subscribe(val => {
              // if (!this.stateService.activeSessionsIds.includes(id)) {
              if(!this.stateService.activeSessionsObjects.find(el => el.key == id )){
                this.stateService.activeSessionsObjects.push(val.payload.data())
              } else {
                const data = val.payload.data() as MotionAuctionItem;
                if(!data) return;
                this.stateService.activeSessionsObjects = [...this.stateService.activeSessionsObjects.map( (ob: MotionAuctionItem) => {
                  if(ob.key == id){
                    return data;
                  } else {
                    return ob;
                  }
                })]

              }


              // console.log('Check it pls', data);
              // if(data && this.stateService.activeSessionsIds.includes(data.key)){
              //   const ob = this.stateService.activeSessionsObjects.find(obj => obj.key == data.key);
              // } else {

              // }
              console.log('inner listener from creator ==== ', id);
            });
          }
        });

      }, err => {
        console.log('### it is listener with error : ', err);
      })
    });
  }

  doCreateMotionAuctionList(motionId){
    return this.motionRef.doc(motionId).collection(ApiConsts.auctionList).doc('status').set({status: 'pending'});
  }

  doCreateRequestor(motionId){
    const auctionId = this.db.createId();
    const auctionObj = this.testAuctionObj(auctionId);
    this.doRequestorAdd(motionId, auctionId, auctionObj).then( v => {
      console.log('??????? add?');
      this.yoListenerForAuction(motionId, auctionId).subscribe(val => {
        console.log('requestor is updated', val);
        console.log('!!!!', val.payload.data());
      });
      this.doCreateRequestorMotionAuctionList(motionId, auctionId);
    }, err => {console.log(err)});
  }

  doCreateRequestorMotionAuctionList(motionId, auctionId){
    this.motionRef.doc(motionId).collection(ApiConsts.auctionList).doc(auctionId).set({status: 'pending'});
  }

  doRequestorAdd(motionId, auctionId, auctionObj) {
    console.log('auctionId ',  auctionId);
    return this.auctionRef.doc(motionId).collection('auctionList').doc(auctionId).set(auctionObj);
  }

  yoListenerForAuction(motionId, auctionId){
    return this.auctionRef.doc(motionId).collection('auctionList').doc(auctionId).snapshotChanges()
  }

  doListenerForCreator(motionId){
    return this.motionRef.doc(motionId).collection(ApiConsts.auctionList).snapshotChanges();
  }

}
