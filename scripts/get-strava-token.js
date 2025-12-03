/**
 * Helper script to get Strava refresh token
 * 
 * Usage:
 * 1. Get your authorization code from the Strava OAuth flow
 * 2. Run: node scripts/get-strava-token.js YOUR_AUTHORIZATION_CODE
 * 
 * Make sure to set these environment variables or update the script:
 * - STRAVA_CLIENT_ID
 * - STRAVA_CLIENT_SECRET
 */

const https = require('https');
const querystring = require('querystring');

const CLIENT_ID = process.env.STRAVA_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
// Use production URL since localhost is not recommended by Strava
const REDIRECT_URI = process.env.STRAVA_REDIRECT_URI || 'https://yaligoldstein.com/api/strava/callback';
const CODE = process.argv[2];

if (!CODE) {
  console.error('Usage: node scripts/get-strava-token.js YOUR_AUTHORIZATION_CODE');
  console.error('\nTo get the authorization code:');
  console.error(`1. Visit: https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=activity:read,profile:read_all`);
  console.error('2. Authorize the app');
  console.error('3. You will be redirected to your website');
  console.error('4. Copy the "code" parameter from the redirect URL, or');
  console.error('   if you see a page with the code displayed, copy it from there');
  process.exit(1);
}

if (CLIENT_ID === 'YOUR_CLIENT_ID' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET') {
  console.error('Please set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET environment variables');
  console.error('Or update the script with your credentials');
  process.exit(1);
}

const postData = querystring.stringify({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  code: CODE,
  grant_type: 'authorization_code'
});

const options = {
  hostname: 'www.strava.com',
  path: '/oauth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
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
      console.log(`STRAVA_CLIENT_ID=${CLIENT_ID}`);
      console.log(`STRAVA_CLIENT_SECRET=${CLIENT_SECRET}`);
      console.log(`STRAVA_REFRESH_TOKEN=${response.refresh_token}\n`);
      if (response.athlete) {
        console.log(`Authorized as: ${response.athlete.firstname} ${response.athlete.lastname}`);
      }
      console.log('\n⚠️  Keep these credentials secure and never commit them to version control!');
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

