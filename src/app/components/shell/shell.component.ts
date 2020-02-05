import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-cust/auth.service';
import { StateService } from '@services-cust/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  motionId;
  constructor(
    private authService: AuthService,
    private stateService: StateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut() {
    this.authService.logOut();
  }

  joinToMotion( ) {
    this.router.navigate(['/requestor', this.motionId]);
    this.stateService.motionId = this.motionId;
  }

  clearAllMotionInfo(): void {
    this.stateService.clearAuctionMotionData();
  }



}
