import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-cust/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  motionId;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  logOut(){
    this.authService.logOut();
  }

}
