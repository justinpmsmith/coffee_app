import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  sqlite: any;
  db: any;
  isDbReady: boolean;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.db = null;
    this.isDbReady = false;
  }

  async initializeDatabase() {
    try {
      if (Capacitor.isNativePlatform()) {
        this.db = await this.sqlite.createConnection(
          'coffeestock.db',
          false,
          'no-encryption',
          1
        );
        
        await this.db.open();
        await this.createTables();
        this.isDbReady = true;
        console.log('Database initialized successfully');
      } else {
        console.log('Running in web - database features limited');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async createTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        barcode TEXT PRIMARY KEY,
        flavor_name TEXT NOT NULL,
        price_per_box REAL NOT NULL,
        price_per_pod REAL NOT NULL,
        pods_per_box INTEGER NOT NULL,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.db.execute(createUsersTable);
    await this.db.execute(createProductsTable);
    console.log('Tables created successfully');
  }
}