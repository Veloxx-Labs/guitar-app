import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noodle.guitar',
  appName: 'Noodle',
  webDir: 'out',
  server: {
    // for dev: uncomment to load from dev server (hot reload on device)
    // url: 'http://192.168.0.252:3000',
    // cleartext: true,
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#faf9f5',
    },
  },
  android: {
    backgroundColor: '#faf9f5',
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#faf9f5',
  },
};

export default config;
