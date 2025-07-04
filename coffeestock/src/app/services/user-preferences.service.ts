import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import * as bcrypt from 'bcryptjs';

export interface User {
  username: string;
  passwordHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly USERS_KEY = 'coffeestock_users';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly LOGIN_STATUS_KEY = 'isLoggedIn';
  
  currentUser: string | null = null;
  isLoggedIn: boolean = false;

  constructor() { }

  // Get all users from preferences
  private async getUsers(): Promise<User[]> {
    try {
      const result = await Preferences.get({ key: this.USERS_KEY });
      if (result.value) {
        return JSON.parse(result.value);
      }
      return [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Save users array to preferences
  private async saveUsers(users: User[]): Promise<void> {
    try {
      await Preferences.set({ 
        key: this.USERS_KEY, 
        value: JSON.stringify(users) 
      });
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  }

  // Check if username already exists
  async userExists(username: string): Promise<boolean> {
    const users = await this.getUsers();
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
  }

  // Create new user
  async createUser(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already exists
      if (await this.userExists(username)) {
        return { 
          success: false, 
          error: 'Username already taken. Please choose a different username or login with your existing account.' 
        };
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Get current users and add new user
      const users = await this.getUsers();
      const newUser: User = {
        username: username.trim(),
        passwordHash: passwordHash
      };

      users.push(newUser);
      await this.saveUsers(users);

      console.log('User created successfully:', username);
      return { success: true };

    } catch (error) {
      console.error('Error creating user:', error);
      return { 
        success: false, 
        error: 'An error occurred while creating your account. Please try again.' 
      };
    }
  }

  // Validate login credentials
  async validateCredentials(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const users = await this.getUsers();
      
      // Find user (case insensitive)
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Compare password with stored hash
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Set session on successful login
      this.currentUser = user.username;
      this.isLoggedIn = true;
      await this.setSession(user.username);

      console.log('Login successful for user:', username);
      return { success: true };

    } catch (error) {
      console.error('Error validating credentials:', error);
      return { 
        success: false, 
        error: 'An error occurred during login. Please try again.' 
      };
    }
  }

  // Set user session in preferences
  async setSession(username: string): Promise<void> {
    try {
      await Preferences.set({ key: this.CURRENT_USER_KEY, value: username });
      await Preferences.set({ key: this.LOGIN_STATUS_KEY, value: 'true' });
      this.currentUser = username;
      this.isLoggedIn = true;
    } catch (error) {
      console.error('Error setting session:', error);
    }
  }

  // Check authentication status
  async checkAuthStatus(): Promise<boolean> {
    try {
      const userData = await Preferences.get({ key: this.CURRENT_USER_KEY });
      const loginStatus = await Preferences.get({ key: this.LOGIN_STATUS_KEY });
      
      if (userData.value && loginStatus.value === 'true') {
        this.currentUser = userData.value;
        this.isLoggedIn = true;
        return true;
      }
      
      this.currentUser = null;
      this.isLoggedIn = false;
      return false;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      this.currentUser = null;
      this.isLoggedIn = false;
      await Preferences.remove({ key: this.CURRENT_USER_KEY });
      await Preferences.remove({ key: this.LOGIN_STATUS_KEY });
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Get user by username (for future use)
  async getUser(username: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Get current logged in username
  getCurrentUser(): string | null {
    return this.currentUser;
  }

  // Check if user is logged in
  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  // Clear all users (for development/testing)
  async clearAllUsers(): Promise<void> {
    try {
      await Preferences.remove({ key: this.USERS_KEY });
      console.log('All users cleared from preferences');
    } catch (error) {
      console.error('Error clearing users:', error);
    }
  }
}