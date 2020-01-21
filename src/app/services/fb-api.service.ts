import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { MotionInstance, MotionAuctionItem, AuctionUpdateByMotionCreator, AuctionUpdateByAuctionCreator } from '@models-cust/motion.model';

@Injectable({
  providedIn: 'root'
})
export class FbApiService {

  private readonly motionInstanceRef = '/motions/';
  private readonly motionsAuctionsRef = '/motions-auctions/';
  private readonly acutionRef = '/aucitons';
  private readonly auctionFullInfo = '/moition-acutions-list';
  private readonly dataBase = this.db.database;
  constructor(
    private db: AngularFireDatabase
  ) { }

    createListOfAucitonsForCreator(motionId){
       this.dataBase.ref(`${this.auctionFullInfo}/${motionId}`);
    }

    updateListOfAuctions(motionId, auctionId){
      this.dataBase.ref(`${this.auctionFullInfo}/${motionId}/${auctionId}`)
      //  this.dataBase.ref(`${this.auctionFullInfo}/${motionId}`)
        .set({key: auctionId})
    }

    // MOTION CREATOR'S METHODS ==>
    createMotionInstance(motionObj: MotionInstance, motionId: string): void {
      // const motionId = this.db.createPushId();
      this.dataBase
        .ref(`${this.motionInstanceRef}${motionId}`)
        .set(motionObj)
        // .then(res => { console.log('Motion is created!', res); })
        // .catch( err => { console.log('There is an err (MotionCreated)', err); });
    }

    addAuctionId(motionId, aucitonId){
      this.dataBase.ref(`${this.acutionRef}/${motionId}`)
        .set(aucitonId);
    }

    listenerMotion(motionId){
      return this.dataBase.ref(`${this.auctionFullInfo}/${motionId}/`);

    }

    askRequest(id, value){
      this.dataBase.ref(`${this.motionsAuctionsRef}/${id}`)
        .update({
          ask: value
        })
    }

    // ????
    createMotionAuctionInstance(motionId: string): void {
      this.dataBase
        .ref(`${this.motionsAuctionsRef}/${motionId}`)
        .set({jee: 11})
        // .then(res => { console.log('Motion auction instance is created!', res); })
        // .catch( err => {console.log('There is an err (Motion auction instance is created!)', err); });
    }

    updateAuctionItemByCreator(updatedValue: AuctionUpdateByMotionCreator, motionId: string, auctionId: string): void {
      this.dataBase
        .ref(`${this.motionsAuctionsRef}/${motionId}/${auctionId}`)
        .update(updatedValue)
        // .then(res => { console.log('Auction item is updated by motion creator!', res); })
        // .catch( err => {console.log('There is an err (Auction item is updated by motion creator)', err); });
    }

    // <== MOTION CREATOR'S METHODS


    // MOTION REQUESTOR'S METHODS ==>

    createMotionAuctionItem(motionId: string, auctionId: string, auctionItem: MotionAuctionItem): void {
        this.dataBase
          .ref(`${this.motionsAuctionsRef}/${motionId}/${auctionId}`)
          .set(auctionItem)
          // .then(res => { console.log('Motion Auction Item is created!', res); })
          // .catch( err => {console.log('There is an err (Motion Auction Item is created!)', err); });
    }


    createAucitonItem(auctionId, auctionObj) {
      const updateItem = {bid: auctionObj.bid, ask: auctionObj.ask}
      return this.dataBase
        .ref(`${this.acutionRef}/${auctionId}`)
        .set(updateItem)
    }


    updateActionItemByRequestor(updatedValue: AuctionUpdateByAuctionCreator, motionId: string, auctionId: string): void {
      this.dataBase
        .ref(`${this.motionsAuctionsRef}/${motionId}/${auctionId}`)
        .update(updatedValue)
        // .then(res => { console.log('Auction item is updated by requestor!', res); })
        // .catch( err => {console.log('There is an err (MotionCreated)', err); });
    }

    // <== MOTION REQUESTOR'S METHODS


    // COMMON ACTIONS ==>
    generateUniquePushId(): string {
      return this.db.createPushId();
    }

    listenerAuction(aucId){
      this.dataBase.ref(`${this.acutionRef}/${aucId}`).on('value', (snapShot)=> {
        console.log(`UPDATE REQUESTOR ${aucId}`, snapShot.val());
      });

    }

    // REFACT
    listenerAuctionCreator(aucId){
      this.dataBase.ref(`${this.acutionRef}/${aucId}`).on('value', (snapShot)=> {
        console.log('UPDATE CREATOR BID/ASK', snapShot.val());
      });

    }

    // <== COMMON ACTIONS


}
