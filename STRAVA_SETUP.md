# Strava API Setup Guide

This guide will walk you through setting up the Strava API integration for your metrics page.

## ⚠️ Important: Static Export Configuration

**Note**: Your `next.config.ts` currently has `output: 'export'` which creates a static site. API routes require a server environment.

**Options:**

1. **Remove static export** (for Vercel/Netlify/serverless): Remove `output: 'export'` from `next.config.ts`
2. **Use external API**: Deploy API routes separately or use a serverless function service
3. **Client-side only**: Fetch directly from Strava (requires exposing credentials - not recommended)

For this integration to work, you'll need to either remove the static export or deploy to a platform that supports Next.js API routes (like Vercel), or use AWS Lambda with API Gateway (which is what we're doing).

## Step 1: Create a Strava Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Log in with your Strava account
3. Click **"Create App"** or **"Register Your Application"**
4. Fill in the app details:
   - **Application Name**: Your Portfolio Metrics (or any name you prefer)
   - **Category**: Website
   - **Website**: Your portfolio website URL (e.g., `https://yaligoldstein.com`)
   - **Authorization Callback Domain**: `yaligoldstein.com` (no `https://` or trailing slash)
     - **Note**: Strava requires just the domain name, not the full URL
5. Accept the terms and click **"Create"**

✅ After creating, you'll see:

- **Client ID**: Copy this value
- **Client Secret**: Click "Show Client Secret" and copy this value

## Step 2: Get Your Client Credentials

1. In your app settings, you'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "Show Client Secret" and copy this value

**Important**: Keep these credentials secure! Never commit them to version control.

## Step 3: Set Up OAuth Flow (For User-Specific Data)

To access your personal activity data (recent activities, stats, profile), you need to authorize your app with your Strava account.

### Option A: Using a Refresh Token (Recommended)

**Note**: Since Strava requires a proper callback URL, we'll use your production callback URL (`https://YOUR_API_GATEWAY_URL/prod/api/strava/callback`) after setting up API Gateway.

1. **Get Authorization Code**:

   - First, you need to set up your API Gateway (see Step 4)
   - Once you have your API Gateway URL, update the callback domain in Strava settings
   - Open this URL in your browser (replace `YOUR_CLIENT_ID` and `YOUR_API_GATEWAY_URL`):

   ```
   https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://YOUR_API_GATEWAY_URL/prod/api/strava/callback&scope=activity:read,profile:read_all
   ```

   - You'll be redirected to Strava to authorize the app
   - After authorization, you'll be redirected to your callback URL with a code
   - The callback page will display your refresh token

2. **Exchange Code for Refresh Token**:

   **Option 1: Use the Callback Lambda Function (Easiest)**

   - After authorizing, you'll be redirected to the callback URL
   - The callback Lambda function will automatically exchange the code for tokens
   - The page will display your refresh token - copy it

   **Option 2: Use the Helper Script**

   - Run: `node scripts/get-strava-token.js YOUR_AUTHORIZATION_CODE`
   - The script will output your refresh token

   **Option 3: Manual Exchange**

   - Make a POST request to `https://www.strava.com/oauth/token` with:
     ```
     client_id=YOUR_CLIENT_ID
     client_secret=YOUR_CLIENT_SECRET
     code=YOUR_AUTHORIZATION_CODE
     grant_type=authorization_code
     ```
   - The response will include both `access_token` and `refresh_token`
   - **Save the `refresh_token`** - this is what you'll use in your Lambda environment variables

### Option B: Use the Helper Script (Easiest)

We've included a helper script to make this easier:

1. **Set environment variables** (or edit the script):

   ```bash
   export STRAVA_CLIENT_ID=your_client_id
   export STRAVA_CLIENT_SECRET=your_client_secret
   export STRAVA_REDIRECT_URI=https://YOUR_API_GATEWAY_URL/prod/api/strava/callback
   ```

2. **Get your authorization code**:

   - Visit the authorization URL from Option A, Step 1
   - After redirect, copy the `code` parameter from the URL
   - Or if you see a page displaying the code, copy it from there

3. **Run the script** with your authorization code:

   ```bash
   node scripts/get-strava-token.js YOUR_AUTHORIZATION_CODE
   ```

4. The script will output your refresh token and all the environment variables you need!

## Step 4: Deploy Lambda Functions to AWS

Follow the instructions in `AWS_LAMBDA_DEPLOYMENT.md` to deploy the Strava Lambda functions:

1. **Package the Lambda functions**:

   ```bash
   ./scripts/package-lambda.sh
   ```

   This creates:

   - `lambda/strava-api.zip`
   - `lambda/strava-callback.zip`

2. **Create Lambda Functions in AWS**:

   - Function 1: `strava-api`

     - Runtime: Node.js 20.x
     - Upload: `lambda/strava-api.zip`
     - Timeout: 30 seconds
     - Memory: 256 MB
     - Environment variables:
       - `STRAVA_CLIENT_ID`
       - `STRAVA_CLIENT_SECRET`
       - `STRAVA_REFRESH_TOKEN` (add after Step 3)

   - Function 2: `strava-callback`
     - Same settings as above
     - Upload: `lambda/strava-callback.zip`
     - Environment variables:
       - `STRAVA_CLIENT_ID`
       - `STRAVA_CLIENT_SECRET`
       - `STRAVA_REDIRECT_URI` (add after creating API Gateway)

3. **Add API Gateway Resources**:

   - Add `/api/strava` resource (GET method → `strava-api` Lambda)
   - Add `/api/strava/callback` resource (GET method → `strava-callback` Lambda)
   - Enable CORS on both resources
   - Deploy to `prod` stage

4. **Update Redirect URI**:
   - In Strava app settings: Add `https://YOUR_API_GATEWAY_URL/prod/api/strava/callback`
   - In Lambda `strava-callback` environment: `STRAVA_REDIRECT_URI = https://YOUR_API_GATEWAY_URL/prod/api/strava/callback`

## Step 5: Configure Environment Variables

### For Lambda Functions (AWS Console):

1. Go to AWS Lambda Console
2. For both `strava-api` and `strava-callback` functions:
   - Go to **Configuration** → **Environment variables**
   - Add:
     ```
     STRAVA_CLIENT_ID = your_actual_client_id
     STRAVA_CLIENT_SECRET = your_actual_client_secret
     STRAVA_REFRESH_TOKEN = your_actual_refresh_token (for strava-api only)
     STRAVA_REDIRECT_URI = https://YOUR_API_GATEWAY_URL/prod/api/strava/callback (for strava-callback only)
     ```
   - Click **"Save"**

### For Local Development (Optional):

1. Create `.env.local` file (if it doesn't exist):

   ```bash
   cp .env.example .env.local
   ```

2. Add your credentials to `.env.local`:

   ```
   STRAVA_CLIENT_ID=your_actual_client_id
   STRAVA_CLIENT_SECRET=your_actual_client_secret
   STRAVA_REFRESH_TOKEN=your_actual_refresh_token
   ```

3. **Important**: Make sure `.env.local` is in your `.gitignore` file to keep your credentials secure!

## Step 6: Test the Integration

1. Make sure your Lambda functions are deployed and configured
2. Make sure your API Gateway is deployed
3. Navigate to `/metrics` page on your website
4. The Strava section should now display your activity data!

## Troubleshooting

### "Failed to authenticate with Strava"

- Check that your `STRAVA_CLIENT_ID` and `STRAVA_CLIENT_SECRET` are correct
- Verify your refresh token is valid (they don't expire, but can be revoked)
- Make sure the refresh token is set in the `strava-api` Lambda function

### "No data available"

- Make sure you've granted the correct scopes:
  - `activity:read` - Required for activities
  - `profile:read_all` - Required for athlete stats
- Try refreshing your access token manually
- Check CloudWatch logs for the Lambda function to see any errors

### Refresh Token Expired/Revoked

- If your refresh token is revoked, you'll need to go through the authorization flow again (Step 3)
- Refresh tokens can be revoked if you change your Strava password or revoke app access in Strava settings

### Rate Limits

- Strava has rate limits: 200 requests per 15 minutes, 2,000 requests per day
- If you hit rate limits, the API will return a 429 status code
- The Lambda function will handle this gracefully and show an error message

### CORS Errors

- Make sure CORS is enabled on both `/api/strava` and `/api/strava/callback` resources in API Gateway
- Verify the `Access-Control-Allow-Origin` header includes your website URL

## API Scopes Used

- `activity:read` - Read user activities (required)
- `profile:read_all` - Read user profile and statistics (required)

## Security Notes

- Never commit your `.env` or `.env.local` files to version control
- Keep your Client Secret and Refresh Token secure
- Use environment variables in AWS Lambda instead of hardcoding credentials
- Consider using AWS Secrets Manager for production deployments

## API Endpoints Used

The integration uses the following Strava API endpoints:

- `GET /api/v3/athlete` - Get athlete profile
- `GET /api/v3/athlete/activities` - Get recent activities
- `GET /api/v3/athletes/{id}/stats` - Get athlete statistics

## Rate Limits

Strava API rate limits:

- **Default**: 200 requests per 15 minutes
- **Daily**: 2,000 requests per day

The Lambda function fetches data once per page load, so you should stay well within these limits.
