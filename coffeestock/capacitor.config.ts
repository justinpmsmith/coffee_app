import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coffeestock.app',
  appName: 'CoffeeStock',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8A4B38',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    Camera: {
      permissions: ['camera', 'photos']
    },
    SQLiteConnection: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      androidDatabaseLocation: 'default'
    }
  }
};

export default config;