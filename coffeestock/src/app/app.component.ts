import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) {
    this.initializeApp();
  }

  async initializeApp() {
    console.log('Initializing app...');
    await this.databaseService.initializeDatabase();
    console.log('App initialization complete');
  }
}