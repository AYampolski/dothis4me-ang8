import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MotionInstance } from '@models-cust/motion.model';
import { User } from '@models-cust/user.model';
import { switchMap, catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { throwError } from 'rxjs';


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

  private readonly motionCollectionName = 'motions';
  private readonly usersCollectionName = 'users';
  private readonly usersRef =  this.db.collection(this.usersCollectionName);
  private readonly motionRef = this.db.collection(this.motionCollectionName);

  constructor(private db: AngularFirestore) { }

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

  addMotion(motionObject: MotionInstance): void {

    const id = this.db.createId();
    const motionObjectSent = Object.assign({}, motionObject, {key: id});

    console.warn(`${ApiConsts.name} | ${ApiConsts.addMotionStart} | ${motionObjectSent}`);
    this.db.collection(this.motionCollectionName).doc(id).set(motionObjectSent)
      .then(motionRes => {
        console.warn(`${ApiConsts.name} | ${ApiConsts.addMotionSuccessed} | ${motionRes}`);
      })
      .catch( err => {
        console.warn(`${ApiConsts.name} | ${ApiConsts.addMotionError} | ${err}`);
      });
  }

  getMotion(motionId: string = '2n4RvDMe5TI3DTNBPO90') {
    return this.motionRef.doc(motionId).get();
  }

}
