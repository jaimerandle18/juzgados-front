import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.datajury.app',
  appName: 'Data Jury',
  webDir: 'public',

  server: {
    url: 'https://juzgados-front.vercel.app',
    cleartext: false
  }
};

export default config;
