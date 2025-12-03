# Spotify API Setup Guide

This guide will walk you through setting up the Spotify API integration for your metrics page.

## ⚠️ Important: Static Export Configuration

**Note**: Your `next.config.ts` currently has `output: 'export'` which creates a static site. API routes require a server environment.

**Options:**

1. **Remove static export** (for Vercel/Netlify/serverless): Remove `output: 'export'` from `next.config.ts`
2. **Use external API**: Deploy API routes separately or use a serverless function service
3. **Client-side only**: Fetch directly from Spotify (requires exposing credentials - not recommended)

For this integration to work, you'll need to either remove the static export or deploy to a platform that supports Next.js API routes (like Vercel).

## Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create App"**
4. Fill in the app details:
   - **App name**: Your Portfolio Metrics (or any name you prefer)
   - **App description**: Portfolio metrics integration
   - **Website**: Your portfolio website URL (e.g., `https://yaligoldstein.com`)
   - **Redirect URI**: `https://yaligoldstein.com/api/spotify/callback`
     - **Note**: Spotify doesn't allow insecure localhost URLs, so use your production URL for both development and production
5. Accept the terms and click **"Save"**

✅ **You've already done this!** Your app is configured with:

- Redirect URI: `https://yaligoldstein.com/api/spotify/callback`

## Step 2: Get Your Client Credentials

1. In your app dashboard, you'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "Show Client Secret" and copy this value

## Step 3: Set Up OAuth Flow (For User-Specific Data)

To access your personal listening data (currently playing, recently played, top tracks), you need to authorize your app with your Spotify account.

### Option A: Using a Refresh Token (Recommended)

**Note**: Since Spotify doesn't allow insecure localhost redirects, we'll use your production callback URL (`https://yaligoldstein.com/api/spotify/callback`) for both local development and production.

1. **Get Authorization Code**:

   - Open this URL in your browser (replace `YOUR_CLIENT_ID` with your actual Client ID from the Spotify dashboard):

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://yaligoldstein.com/api/spotify/callback&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

   - You'll be redirected to Spotify to authorize the app
   - After authorization, you'll be redirected to `https://yaligoldstein.com/api/spotify/callback?code=...`
   - The callback page will display your authorization code (or automatically exchange it in production)
   - Copy the `code` parameter from the URL or from the displayed page

2. **Exchange Code for Refresh Token**:

   **Option 1: Use the Helper Script (Easiest)**

   - Run: `node scripts/get-spotify-token.js YOUR_AUTHORIZATION_CODE`
   - The script will output your refresh token

   **Option 2: Manual Exchange**

   - Make a POST request to `https://accounts.spotify.com/api/token` with:
     ```
     grant_type=authorization_code
     code=YOUR_AUTHORIZATION_CODE
     redirect_uri=https://yaligoldstein.com/api/spotify/callback
     ```
   - Include Basic Auth header: `Authorization: Basic BASE64(CLIENT_ID:CLIENT_SECRET)`
   - The response will include both `access_token` and `refresh_token`
   - **Save the `refresh_token`** - this is what you'll use in your `.env` file

### Option B: Use the Helper Script (Easiest)

We've included a helper script to make this easier:

1. **Set environment variables** (or edit the script):

   ```bash
   export SPOTIFY_CLIENT_ID=your_client_id
   export SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

2. **Get your authorization code**:

   - Visit the authorization URL from Option A, Step 1
   - After redirect, copy the `code` parameter from the URL
   - Or if you see a page displaying the code, copy it from there

3. **Run the script** with your authorization code:

   ```bash
   node scripts/get-spotify-token.js YOUR_AUTHORIZATION_CODE
   ```

4. The script will output your refresh token and all the environment variables you need!

**Note**: The callback route (`/api/spotify/callback`) has been created and will:

- Show your authorization code on a helpful page (for local development)
- Automatically exchange the code for tokens in production (if configured)

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your credentials to `.env`:

   ```
   SPOTIFY_CLIENT_ID=your_actual_client_id
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret
   SPOTIFY_REFRESH_TOKEN=your_actual_refresh_token
   ```

3. **Important**: Make sure `.env` is in your `.gitignore` file to keep your credentials secure!

## Step 5: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/metrics` page
3. The Spotify section should now display your listening data!

## Troubleshooting

### "Failed to authenticate with Spotify"

- Check that your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct
- Verify your refresh token is valid (they don't expire, but can be revoked)

### "No data available"

- Make sure you've granted the correct scopes:
  - `user-read-currently-playing`
  - `user-read-recently-played`
  - `user-top-read`
- Try refreshing your access token manually

### Refresh Token Expired/Revoked

- If your refresh token is revoked, you'll need to go through the authorization flow again (Step 3)
- Refresh tokens can be revoked if you change your Spotify password or revoke app access

## API Scopes Used

- `user-read-currently-playing`: Read what you're currently playing
- `user-read-recently-played`: Read your recently played tracks
- `user-top-read`: Read your top tracks and artists

## Security Notes

- Never commit your `.env` file to version control
- Keep your Client Secret and Refresh Token secure
- Consider using environment variables in your hosting platform (Vercel, Netlify, etc.) instead of `.env` files in production
