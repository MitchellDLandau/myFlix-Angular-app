import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description Component that displays more information when requested. 
 * @selector app-more-info
 * @templateUrl ./more-info.component.html
 * @styleUrls ./more-info.component.scss
 */

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.scss'
})
export class MoreInfoComponent {

  /**
   * Generates more information for the movie clicked. 
   */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string,
      content: string
    }
  ) { };
  onCloseClick(): void {

  }
}
