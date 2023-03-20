export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_APP_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_APP_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_APP_MEASUREMENT_ID
};

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_APP_API_GA_TRACKING_ID;
export const YM_TRACKING_ID = process.env.NEXT_PUBLIC_APP_API_YM_TRACKING_ID;
export const isProd = process.env.NEXT_PUBLIC_APP_DEPLOY_ENV === 'production';
export const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_APP_RECAPTCHA_KEY;
