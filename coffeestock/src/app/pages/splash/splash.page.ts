import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false,
})
export class SplashPage implements OnInit {

  constructor(
    private router: Router,
    private userPreferencesService: UserPreferencesService
  ) { }

  async ngOnInit() {
    // Show splash for 2 seconds then check auth status
    setTimeout(async () => {
      const isLoggedIn = await this.userPreferencesService.checkAuthStatus();
      
      if (isLoggedIn) {
        // User is logged in, go to products page
        this.router.navigate(['/products']);
      } else {
        // User not logged in, go to login page
        this.router.navigate(['/login']);
      }
    }, 2000);
  }
}