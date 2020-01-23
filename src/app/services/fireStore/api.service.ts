import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

// import { MotionInstance } from '@models-cust/motion.model';

import { MotionInstance } from '@models-cust/motion.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly motionCollectionName = 'motions';
  private readonly motionRef = this.db.collection(this.motionCollectionName);
  constructor(private db: AngularFirestore) { }

  addMotion(motionObject: MotionInstance) {
    console.log('[API SERVICE] createion start');
    const id = this.db.createId();
    motionObject.key = id;
    console.log('[API SERVICE] instance: ', motionObject);
    const ref = this.db.collection(this.motionCollectionName).doc(id).set(motionObject)
      .then(res => {
        console.log('[API SERVICE] add motion', res);
      })
      .catch( err => {
        console.log('[API SERVICE] error', err);
      });
  }

  getMotion(motionId= '2n4RvDMe5TI3DTNBPO90') {
    return this.motionRef.doc(motionId).get();
    // .subscribe(doc => {
    //   if(doc.exists){
    //     console.log('[API SERVICE] doc exists', doc);
    //   } else {
    //     console.log('[API SERVICE] doc does not exist');
    //   }

    // }, err => {
    //   console.log('[API SERVICE] getmotion error', err)
    // })
    //  toPromise().then(doc => {})

  }
}
