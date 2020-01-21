import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.currentUser = user;
        console.log('[AUTH_SERVICE] you are logged in');
      } else {
        this.currentUser = null;
        console.log('[AUTH_SERVICE] you are not logged in');
      }
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }


    logOut() {
      this.afAuth.auth.signOut().then( res => {
        console.log('You are logged out! ', res);
        this.router.navigate(['/login']);
      })
      .catch( err => {
        console.log('some errors, ', err);
      })
    }



  // detectionLoging(){
    isLogedIn() {
     this.afAuth.auth.onAuthStateChanged(user => {

     })
  }

  // isLogedIn() {
  //   const logIn = this.afAuth.auth.currentUser;
  //   if(logIn){
  //     console.log('You loged in!', logIn);
  //     return true;
  //   }
  //   console.log('You need to log in!', logIn);
  //   return false;

  // }


  googleAuthLogin() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  mailAuthLogin(){
    return this.authLogin(new auth.EmailAuthProvider() )
  }

  authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then( result => {
        console.log('You have been successfully logged in');
        this.router.navigate(['/home']);
      } )
      .catch( err => {
        console.log('Error: ', err);
      })
  }

  emailPasswordLogup(email, password){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then( res => {
        console.log('You are signed up!', res);
        this.router.navigate(['/home']);
      })
      .catch( err => {
        console.log('errors: ', err);
      });
  }

  emailPasswordLogin(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then( res => {
        console.log('You are signed in! ', res);
        this.router.navigate(['/home']);
      })
      .catch( err => {
        console.log('errors', err);
      })
  }


}
