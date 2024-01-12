import { Component, Inject } from '@angular/core';
import { UserRegistrationServices } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MoreInfoComponent } from '../more-info/more-info.component';

/**
 * @description Creates cards to display the movies available.
 * @selector app-movie-card
 * @templateUrl ./movie-card.component.html
 * @styleUrls ./movie-card.component.scss
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationServices,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

/**
 * Gets all of the movies available.
 */

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Gets all of the movies from the database. 
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

/**
 * Generates more information about the genre of the movie clicked.
 * @param Genre The genre information stored about the movie being shown.
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
 * Generates more information about the director of the movie clicked.
 * @param Director The director information stored about the movie being shown.
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
 * Generates more information about the movie clicked.
 * @param movie The description information stored about the movie being shown.
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
   * Checks to find the favorite movies of the user. 
   * @param movieID The ID of the movies that are in the users favorite movies array.
   * @returns The movie ID's that are in the users favorites. 
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
   * Allows the user to select a favorite movie and remove a favorite movie. 
   * @param movieID The Id of the movie. 
   * @returns Pop up of if the movie was added or removed from favorites. 
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
