import { Component } from '@angular/core';
import { RouterEvent, NavigationStart, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';

import { AuthService } from '@services-cust/auth.service';
import { StateService } from '@services-cust/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dothis4me-ang8';
  loading = false;

  constructor(
    public stateService: StateService,
    private authService: AuthService,
    private router: Router,

  ) {
    this.router.events.subscribe( (routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });
    this.authService.checkUserStatus();
  }

  logOut() {
    // this.router.navigate(['/login/page']);
    this.router.navigate(['/login'], { queryParams: { logout: true } });
    //this.authService.logOut();
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart ) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationCancel
        || routerEvent instanceof NavigationEnd
        || routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }



}
