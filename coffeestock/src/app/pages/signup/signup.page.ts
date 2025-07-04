import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserPreferencesService } from '../../services/user-preferences.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userPreferencesService: UserPreferencesService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Clear any previous messages
    this.errorMessage = '';
    this.successMessage = '';
  }

  async onSignup() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    
    // Basic validation
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    // Username validation
    if (this.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long';
      return;
    }

    // Password validation
    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters long';
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.userPreferencesService.createUser(this.username, this.password);
      
      if (result.success) {
        this.successMessage = 'Account created successfully! Redirecting to login...';
        
        // Clear the form
        this.username = '';
        this.password = '';
        
        // Show success toast
        await this.showToast('Account created successfully!', 'success');
        
        // Auto-redirect to login after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        // Username already exists - show toast with options
        await this.showUsernameExistsToast();
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.errorMessage = 'An error occurred during registration. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async showUsernameExistsToast() {
    const toast = await this.toastController.create({
      message: 'Username already taken. Please choose a different username or login with your existing account.',
      duration: 5000,
      position: 'middle',
      color: 'warning',
      buttons: [
        {
          text: 'Go to Login',
          handler: () => {
            this.router.navigate(['/login']);
          }
        },
        {
          text: 'Try Again',
          role: 'cancel',
          handler: () => {
            // Just dismiss the toast, user can try a different username
          }
        }
      ]
    });
    await toast.present();
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
