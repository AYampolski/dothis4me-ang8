import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-cust/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '03email@winemail.net';
  password = '111111';
  displayName = 'John Sina';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

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

  loginEmail() {
    this.authService.emailPasswordLogin(this.email, this.password)
    .subscribe( next => {
      console.log('!???!?!?!?!?', next);
    },
    err => {
      console.log('EROR ....', err);
    });

  }

  logupEmail() {
    this.authService.emailPasswordLogup(this.email, this.password, this.displayName).subscribe( next => {
      console.log('!???!?!?!?!?', next);
    },
    err => {
      console.log('EROR ....', err);
    });
  }

}
