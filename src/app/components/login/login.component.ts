import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-cust/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = 'jahala9603@winemail.net';
  password = '111111';

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  loginGoogle(){
    this.authService.googleAuthLogin();
  }

  loginEmail(){
    this.authService.emailPasswordLogin(this.email, this.password);
  }

  logupEmail(){
    this.authService.emailPasswordLogup(this.email, this.password);
  }

}
