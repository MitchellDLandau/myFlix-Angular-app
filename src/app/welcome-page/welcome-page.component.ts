import { Component } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * @description The welcome page of the app allowing users to login or sign up.
 * @selector app-welcome-page
 * @templateUrl ./welcome-page.component.html
 * @styleUrl ./welcome-page.component.scss
 */

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {

  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }

  /**
   * Opens a registration box for the user to create an account. 
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }
  /**
   * Opens the login form for the user to login. 
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }
}
