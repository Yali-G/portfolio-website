/**
 * Helper script to get Spotify refresh token
 * 
 * Usage:
 * 1. Get your authorization code from the Spotify OAuth flow
 * 2. Run: node scripts/get-spotify-token.js YOUR_AUTHORIZATION_CODE
 * 
 * Make sure to set these environment variables or update the script:
 * - SPOTIFY_CLIENT_ID
 * - SPOTIFY_CLIENT_SECRET
 */

const https = require('https');
const querystring = require('querystring');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
// Use production URL since localhost is not allowed by Spotify
const REDIRECT_URI = 'https://yaligoldstein.com/api/spotify/callback';
const CODE = process.argv[2];

if (!CODE) {
  console.error('Usage: node scripts/get-spotify-token.js YOUR_AUTHORIZATION_CODE');
  console.error('\nTo get the authorization code:');
  console.error(`1. Visit: https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read`);
  console.error('2. Authorize the app');
  console.error('3. You will be redirected to your website');
  console.error('4. Copy the "code" parameter from the redirect URL, or');
  console.error('   if you see a page with the code displayed, copy it from there');
  process.exit(1);
}

if (CLIENT_ID === 'YOUR_CLIENT_ID' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET') {
  console.error('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables');
  console.error('Or update the script with your credentials');
  process.exit(1);
}

const postData = querystring.stringify({
  grant_type: 'authorization_code',
  code: CODE,
  redirect_uri: REDIRECT_URI
});

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

const options = {
  hostname: 'accounts.spotify.com',
  path: '/api/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${auth}`,
    'Content-Length': postData.length
  }
};

console.log('Exchanging authorization code for tokens...\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.error) {
        console.error('Error:', response.error);
        console.error('Description:', response.error_description);
        process.exit(1);
      }
      console.log('✅ Success! Add these to your .env file:\n');
      console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
      console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
      console.log(`SPOTIFY_REFRESH_TOKEN=${response.refresh_token}\n`);
      console.log('⚠️  Keep these credentials secure and never commit them to version control!');
    } catch (error) {
      console.error('Error parsing response:', error);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  process.exit(1);
});

req.write(postData);
req.end();

