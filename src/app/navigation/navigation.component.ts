import { Component, makeEnvironmentProviders } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @description The navigation bar to assist in navigation of the site. 
 * @selector app-navigation
 * @templateUrl ./navigation.component.html
 * @styleUrls ./navigation.component.scss
 */

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(
    public router: Router
  ) { }

  /**
   * Displays the users profile page. 
   */

  profileView(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Displays the main page of the site with all of the movies.
   */

  mainPage(): void {
    this.router.navigate(['movies']);
  }

  /**
   * logs out the user from the site. 
   */

  logoutUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
