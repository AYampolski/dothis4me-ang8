import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { from, Observable, throwError, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { StateService } from '@services-app/state.service';
import { ApiService } from '@services-app/fireStore/api.service';
import { User } from '@models-app/user.model';


enum AuthConst {
  name = '[AUTH_SERVICE]',
  logOutError = 'Sign out with error',
  logOutSuccess = 'Sign out successfully!',
  emailSignUpSuccessfully = 'Sign up email successfully',
  emailSignUpError = 'Sign up email error',
  emailSignInSuccessfully = 'Sign in email successfully',
  emailSignInError = 'Sign in email error',
  logInSuccess = 'Sign in success',
  logInError = 'Sign in error',
  loggedInUserPath = '/home',
  loggedOutPath = '/login'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private stateService: StateService,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) { }

  showSuccess(message) {
    this.toastr.success(message);
  }
  showError(message) {
    this.toastr.error(message);
  }

  checkUserStatus() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.stateService.user = this.createUserObject(user);
        this.showSuccess('You are logged in!');
        this.router.navigate([AuthConst.loggedInUserPath]);
      } else {
        this.showSuccess('You are logged out!');
        this.stateService.user = null;
        this.router.navigate([AuthConst.loggedOutPath]);
      }
    }, err => {
      console.log(`${AuthConst.name} check err => ${err}`);
    }, () => {console.log(AuthConst.name, ' check it . it is complete'); });
  }

  createUserObject(user: firebase.User, name?: string): User {
    const { email, uid, emailVerified } = user;
    let { displayName } = user;
    if (!displayName && name) {
      displayName = name;
    }
    const userObj = Object.assign({}, {uid, email, displayName, emailVerified});
    return userObj;
  }

  authLogin(provider): Observable<void> {
    return from(this.afAuth.auth
      .signInWithPopup(provider)).pipe(
      switchMap( (userResponse: auth.UserCredential) => {
        if (userResponse.additionalUserInfo.isNewUser) {
          return this.apiService.addUserToDb(this.createUserObject(userResponse.user));
        }
        return of(undefined);
      }),
      catchError( e => {
        return throwError(e);
      })
    );
  }

  emailPasswordLogUp(email, password, displayName): Observable<void> {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password)).pipe(
      tap( (userResponse: auth.UserCredential) => { userResponse.user.updateProfile({displayName}); }),
      switchMap( (userResponse: auth.UserCredential) => {
        return this.apiService.addUserToDb(this.createUserObject(userResponse.user, displayName));
      }),
      catchError( e => {
        return throwError(e);
      })
    );
  }

  emailPasswordLogin(email, password): Observable<auth.UserCredential> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
      tap( (logResponse) => {
        console.warn(`${AuthConst.name} | ${AuthConst.emailSignInSuccessfully} | ${logResponse}`);
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  logOut(): void {
    this.afAuth.auth.signOut().then( logResponse => {
      this.stateService.user = null;
      console.warn(`${AuthConst.name} | ${AuthConst.logOutSuccess} | ${logResponse}`);
    })
    .catch( err => {
      console.warn(`${AuthConst.name} | ${AuthConst.logOutError} | ${err}`);
    });
  }

  logOutWithActionsPromise(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  googleAuthLogin(): Observable<void> {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

}
