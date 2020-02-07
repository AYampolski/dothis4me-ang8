import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@services-app/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  email = '03email@winemail.net';
  email2 = 'bigYolo@winemail.net';
  email3 = 'test3@winemail.net';
  email4 = 'test4@winemail.net';
  email5 = 'test5@winemail.net';
  password = '111111';
  displayName = 'John Sina';

  password2 = '111111';
  displayName2 = 'Andrew Jackson';
  displayName3 = 'Peter Parker';
  displayName4 = 'Ivan Ivanov';
  displayName5 = 'Some Guy';



  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }
  showError(err) {
    this.toastr.error(err);
  }

  loginGoogle() {
    this.authService.googleAuthLogin().subscribe(
      item => console.log('!!!!!!!!!!!!', item),
      err => {
        console.log('error in component check it pls', err);
        this.showError(err);
      }
    );
  }

  login1Email() {
    this.authService.emailPasswordLogin(this.email, this.password)
    .subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });

  }


  logup4Email(){
    this.logupWithEmail(this.email4, this.password, this.displayName4);
  }

  logup3Email(){
    this.logupWithEmail(this.email3, this.password, this.displayName3);
  }

  logup5Email(){
    this.logupWithEmail(this.email5, this.password, this.displayName5);
  }

  login5Email(){
    this.loginWithEmail(this.email5, this.password);
  }

  login4Email(){
    this.loginWithEmail(this.email4, this.password);
  }

  login3Email(){
    this.loginWithEmail(this.email3, this.password);
  }

  logupWithEmail(email, password, displayName){
    this.authService.emailPasswordLogUp(email, password, displayName).subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });
  }

  loginWithEmail(email, password) {
    this.authService.emailPasswordLogin(email, password)
    .subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });

  }

  login2Email() {
    this.authService.emailPasswordLogin(this.email2, this.password2)
    .subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });

  }

  logup1Email() {
    this.authService.emailPasswordLogUp(this.email, this.password, this.displayName).subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });
  }

  logup2Email() {
    this.authService.emailPasswordLogUp(this.email2, this.password2, this.displayName2).subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
}

}
