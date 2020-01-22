import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly motionCollectionName = 'motions';
  constructor(private db: AngularFirestore) { }

  mockMotionObject = {
    name: 'Ivan',
    todo: 'nothing'
  }

  addMotion(motionObject = this.mockMotionObject) {
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
