import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationServices } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfileUpdateComponent } from '../profile-update/profile-update.component';
import { MoreInfoComponent } from '../more-info/more-info.component';
import { DatePipe } from '@angular/common';

type User = {
  _id?: string, Username?: string, Password?: string,
  Email?: string,
  Birthday?: Date | null, FavoriteMovies?: any[]
};

/**
 * @description The users profile page with their favorite movies and personal information. 
 * @selector app-profile-page
 * @templateUrl ./profile-page.component.html
 * @styleUrls ./profile-page.component.scss
 */

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})

export class ProfilePageComponent {
  user: User = {};
  favoriteMovies: any[] = [];

  @Input() userData = {
    Username: '', Password: '', Email: '',
    Birthday: null as Date | null,
  };

  constructor(
    public fetchApiData: UserRegistrationServices,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) { }

/**
 * 
 * Initiates the generation of the page and gets the users information and favorite movies. 
 */

  ngOnInit(): void {
    const user = this.getUser();

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;
    this.getFavoriteMovies();


    this.userData = {
      Username: user.Username || '',
      Password: '',
      Email: user.Email || '',
      Birthday: user.Birthday || null,
    }
  }

/**
 * Opens the profile update componanet for the user to edit their data. 
 */

  openProfileUpdateDialog(): void {
    this.dialog.open(ProfileUpdateComponent, {
      width: '280px'
    });
  }

  public back(): void {
    this.router.navigate(['movies']);
  }

  /**
   * 
   * @returns The users information stored in local storage. 
   */

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  /**
   * 
   * @param Genre The genre of the movie displayed for the user to request more information.
   */
  openGenre(Genre: any): void {
    this.dialog.open(MoreInfoComponent, {
      data: {
        Title: Genre.Name,
        content: Genre.Description,
      }
    })
  }

  /**
   * 
   * @param Director The director of the movie displayed for the user to request more information.
   */

  openDirector(Director: any): void {
    this.dialog.open(MoreInfoComponent, {
      data: {
        Title: Director.Name,
        content: Director.Bio,
      }
    })
  }

  /**
   * 
   * @param movie The description of the movie displayed for the user to request more information.
   */

  openDescription(movie: any): void {
    this.dialog.open(MoreInfoComponent, {
      data: {
        Title: movie.Title,
        content: movie.Description,
      }
    })
  }

/**
 * Using locals Storage and the movies array this displays only the movies the user has favorited. 
 */

  getFavoriteMovies(): void {
    if (this.user && Array.isArray(this.user.FavoriteMovies)) {
      this.fetchApiData.getAllMovies().subscribe((movies) => {
        this.favoriteMovies = movies.filter((movie: any) =>
          this.user.FavoriteMovies!.includes(movie._id)
        );
      });
    } else {
      console.error('User or user\'s favorite movies are undefined or not an array.');
    }
  }

  /**
   * 
   * @param movieID The id of the movies in the users favorites. 
   * @returns The ID of the movies that are in the users favorite movies array. 
   */

  isFavorite(movieID: string): boolean {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('User not found in local storage.');
      return false;
    }
    const user = JSON.parse(userString);
    return user.FavoriteMovies.includes(movieID);
  }

/**
 * 
 * @param movieID The id of the movies in the users favorites.
 * @returns displays the movies in the users favorite movies array.
 */

  toggleFavorite(movieID: string): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('User not found in local storage.');
      return;
    }
    const user = JSON.parse(userString);
    const userName = user.Username;

    if (this.isFavorite(movieID)) {
      // Remove from favorites
      this.fetchApiData.deleteFavorite(userName, movieID).subscribe((resp: any) => {
        this.snackBar.open('Removed from favorites!', 'OK', {
          duration: 2000
        });
      });
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(userName, movieID).subscribe((resp: any) => {
        this.snackBar.open('Added to favorites!', 'OK', {
          duration: 2000
        });
      });
    }
  }
}