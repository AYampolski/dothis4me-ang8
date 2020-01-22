import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MotionInstance } from '@models-cust/motion.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly motionCollectionName = 'motions';
  constructor(private db: AngularFirestore) { }

  addMotion(motionObject: MotionInstance) {
    console.log('[API SERVICE] createion start');
    this.db.collection(this.motionCollectionName).add(motionObject)
      .then(res => {
        console.log('[API SERVICE] add motion', res);
      })
      .catch( err => {
        console.log('[API SERVICE] error', err);
      });
  }
}
