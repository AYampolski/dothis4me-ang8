import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-cust/auth.service';
import { StateService } from '@services-cust/state.service';
import { FirestoreCommonActionsService } from '@services-cust/fireStore/firestore-common-actions.service';
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
    private commonActions: FirestoreCommonActionsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut(){
    this.authService.logOut();
  }

  checkJoin( ) {
    this.router.navigate(['/requestor', this.motionId]);
    this.stateService.motionId = this.motionId;
  }



}
