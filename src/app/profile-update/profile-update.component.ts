import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationServices } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';

type User = {
  _id?: string, Username?: string, Password?: string,
  Email?: string,
  Birthday?: Date | null, FavoriteMovies?: any[]
};

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
 * @description Allows the user to be able to update the information on their account. 
 * @selector app-profile-update
 * @templateUrl ./profile-update.component.html
 * @styleUrls ./profile-update.component.scss
 */

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.scss',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class ProfileUpdateComponent implements OnInit {
  user: User = {};
  favoriteMovies: any[] = [];

  @Input() userData = {
    Username: '', Password: '', Email: '',
    Birthday: null as Date | null,
  };

  @ViewChild('confirmationModal') confirmationModal!: ElementRef;

  constructor(
    public fetchApiData: UserRegistrationServices,
    public router: Router,
    public dialogRef: MatDialogRef<ProfileUpdateComponent>,
    public snackBar: MatSnackBar
  ) { }

/**
 * 
 * @returns Sets the users information to be used by other components. 
 */

  ngOnInit(): void {
    const user = this.getUser();

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;

    this.userData = {
      Username: user.Username || '',
      Password: '',
      Email: user.Email || '',
      Birthday: user.Birthday || null,
    }
  }

/**
 * 
 * @returns Gets the user information stored in localStorage.
 */

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * Sends put request to update the users information and updates it in localStorage. 
   */

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      this.dialogRef.close();
      localStorage.setItem('user', JSON.stringify(result));
      window.location.reload();
      this.user = result;
      this.snackBar.open('Profile updated successfully', 'OK', {
        duration: 2000,
      });
    });
  }

/**
 * Generates a popup for the user to confirm deletion of their account and delete their account.
 */

  removeUser(): void {
    const confirmation = window.confirm('Are you sure you want to delete your profile?');

    if (confirmation) {
      this.deleteUser();
    }
  }

  private deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(() => {
      this.snackBar.open('Profile successfully deleted', 'OK', {
        duration: 2000,
      });
      localStorage.clear();
      this.router.navigate(['welcome']);
      window.location.reload();
    });
  }
}