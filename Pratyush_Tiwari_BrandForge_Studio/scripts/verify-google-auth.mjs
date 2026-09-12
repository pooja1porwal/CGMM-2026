import { getGoogleAccessToken } from '../server/google-auth.mjs';

if (process.env.VERCEL_ENV !== 'production') {
  console.log('Google authentication check is limited to Vercel production.');
  process.exit(0);
}

try {
  await getGoogleAccessToken();
  console.log('Google Cloud keyless authentication verified. No model generation requested.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
