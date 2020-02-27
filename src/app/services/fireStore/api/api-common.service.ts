import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { AuctionInstance } from '@models-app/auction.model';
import { Observable, from, throwError } from 'rxjs';
import { User } from '@models-app/user.model';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiCommonService {

  public readonly motionCollectionName = 'motions';
  public readonly usersCollectionName = 'users';
  public readonly auctionCollectionName = 'auctionsInteraction';
  public readonly itemsCollectionName = 'items';
  public readonly usersRef =  this.db.collection(this.usersCollectionName);
  public readonly motionRef = this.db.collection(this.motionCollectionName);
  public readonly auctionRef = this.db.collection(this.auctionCollectionName);

  constructor(
    private db: AngularFirestore,
  ) { }

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
 * Create a unique id for firebase
 */
  createUniqueId(): string {
    return this.db.createId();
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
  * Add user info to User-collection
  * @param { User } user
  */
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
}


export enum ApiConst {
  name = '[API_SERVICE]',
  addToDbError = 'Error User already registered',
  addMotionSuccessfully = 'Add motions successfully',
  addMotionError = 'Add motions with error',
  addMotionStart = 'Add motion starts',
  auctionList = 'auctions',
  defaultStatus = 'pending',
  relatedAuctions = 'relatedAuctions',
  usersCollectionName = 'users',
  motionCollectionName = 'motions',
}

