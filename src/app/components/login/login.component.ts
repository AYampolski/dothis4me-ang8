import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@services-cust/auth.service';
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
  password = '111111';
  displayName = 'John Sina';

  password2 = '111111';
  displayName2 = 'Andrew Jackman';

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

  login2Email() {
    this.authService.emailPasswordLogin(this.email2, this.password2)
    .subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });

  }

  logup1Email() {
    this.authService.emailPasswordLogup(this.email, this.password, this.displayName).subscribe( next => {

    },
    err => {
      console.log('EROR ....', err);
    });
  }

  logup2Email() {
    this.authService.emailPasswordLogup(this.email2, this.password2, this.displayName2).subscribe( next => {

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
