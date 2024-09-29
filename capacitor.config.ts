import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'propelApp',
  webDir: 'www',
  plugins: {
    BarcodeScanner: {
      // Configuration options for BarcodeScanner if needed
    }
  },
};

export default config;
