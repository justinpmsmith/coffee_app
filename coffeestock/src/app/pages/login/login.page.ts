import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userPreferencesService: UserPreferencesService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Clear any previous error messages
    this.errorMessage = '';
  }

  async onLogin() {
    // Reset error message
    this.errorMessage = '';
    
    // Basic validation
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.userPreferencesService.validateCredentials(this.username, this.password);
      
      if (result.success) {
        console.log('Login successful');
        await this.showToast('Welcome back!', 'success');
        
        // Navigate to products page
        this.router.navigate(['/products']);
      } else {
        this.errorMessage = 'Invalid credentials';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'An error occurred during login. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}