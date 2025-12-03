# Strava Integration - Your Action Items

This document outlines the steps you need to complete to get Strava working on your website.

## ✅ What's Already Done

I've implemented all the code changes:

1. ✅ Created `lambda/strava-api.js` - Fetches Strava activity data
2. ✅ Created `lambda/strava-callback.js` - Handles OAuth callback (only needed if you don't have a token)
3. ✅ Created `scripts/get-strava-token.js` - Helper script for token exchange
4. ✅ Updated `src/app/components/MetricsPage.tsx` - Added Strava data display
5. ✅ Updated `scripts/package-lambda.sh` - Added Strava packaging commands
6. ✅ Created `STRAVA_SETUP.md` - Complete setup documentation

---

## 📋 Main Steps (If You Already Have a Refresh Token)

### Step 1: Register Strava Application

1. Go to https://www.strava.com/settings/api
2. Log in with your Strava account
3. Click **"Create App"** or **"Register Your Application"**
4. Fill in:
   - **Application Name**: Your Portfolio Metrics (or any name)
   - **Category**: Website
   - **Website**: `https://yaligoldstein.com`
   - **Authorization Callback Domain**: `yaligoldstein.com` (just the domain, no https://)
5. Click **"Create"**
6. **Save your Client ID and Client Secret** - you'll need these later

### Step 2: Package Lambda Functions

Run this command from your project root:

```bash
./scripts/package-lambda.sh
```

This will create:

- `lambda/strava-api.zip`
- `lambda/strava-callback.zip` (you won't need this if you have a token)

### Step 3: Create Lambda Function in AWS

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)

2. **Create `strava-api` function**:
   - Click **"Create function"**
   - Select **"Author from scratch"**
   - Function name: `strava-api`
   - Runtime: `Node.js 20.x`
   - Architecture: `x86_64`
   - Click **"Create function"**
   - Upload `lambda/strava-api.zip`
   - Go to **Configuration** → **General configuration** → **Edit**
     - Timeout: `30 seconds`
     - Memory: `256 MB`
   - Go to **Configuration** → **Environment variables**
     - Add:
       - `STRAVA_CLIENT_ID` = (your client ID from Step 1)
       - `STRAVA_CLIENT_SECRET` = (your client secret from Step 1)
       - `STRAVA_REFRESH_TOKEN` = (your existing refresh token)
   - Click **"Save"**

### Step 4: Add API Gateway Resource

1. Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Select your existing API (the one you used for Spotify)
3. **Create `/api/strava` resource**:

   - Select the `/api` resource
   - Click **"Actions"** → **"Create Resource"**
   - Resource Name: `strava`
   - Resource Path: `strava`
   - ✅ Enable API Gateway CORS: Yes
   - Click **"Create Resource"**
   - Select `/api/strava` resource
   - Click **"Actions"** → **"Create Method"** → Select **"GET"**
   - Integration type: `Lambda Function`
   - ✅ Use Lambda Proxy integration: Yes
   - Lambda Function: `strava-api`
   - Click **"Save"** → Click **"OK"**

4. **Enable CORS**:

   - Select `/api/strava` resource
   - Click **"Actions"** → **"Enable CORS"**
   - Access-Control-Allow-Origin: `https://yaligoldstein.com`
   - Access-Control-Allow-Headers: `Content-Type`
   - Click **"Enable CORS and replace existing CORS headers"**

5. **Deploy API**:
   - Click **"Actions"** → **"Deploy API"**
   - Deployment stage: `prod` (or your existing stage)
   - Click **"Deploy"**
   - **Note the Invoke URL** (e.g., `https://abc123.execute-api.us-west-1.amazonaws.com/prod`)

### Step 5: Test the Integration

1. Go to your website: `https://yaligoldstein.com/metrics`
2. The Strava section should now display:
   - Your athlete profile (name, location, profile picture)
   - Statistics (YTD totals, recent totals)
   - Recent activities (last 5 activities with details)

## 🎉 You're Done!

Your Strava integration should now be working. The metrics page will automatically fetch and display your Strava activity data.

---

## 🔄 Alternative: Getting a Refresh Token (If You Don't Have One)

**Only follow these steps if you need to generate a new refresh token.**

### Additional Step A: Create Callback Lambda Function

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. **Create `strava-callback` function**:
   - Click **"Create function"**
   - Select **"Author from scratch"**
   - Function name: `strava-callback`
   - Runtime: `Node.js 20.x`
   - Architecture: `x86_64`
   - Click **"Create function"**
   - Upload `lambda/strava-callback.zip`
   - Go to **Configuration** → **Environment variables**
     - Add:
       - `STRAVA_CLIENT_ID` = (your client ID)
       - `STRAVA_CLIENT_SECRET` = (your client secret)
       - `STRAVA_REDIRECT_URI` = (you'll set this after creating the API Gateway endpoint)

### Additional Step B: Create Callback API Gateway Endpoint

1. Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Select your existing API
3. **Create `/api/strava/callback` resource**:

   - Select `/api/strava` resource
   - Click **"Actions"** → **"Create Resource"**
   - Resource Name: `callback`
   - Resource Path: `callback`
   - ✅ Enable API Gateway CORS: Yes
   - Click **"Create Resource"**
   - Select `/api/strava/callback` resource
   - Click **"Actions"** → **"Create Method"** → Select **"GET"**
   - Integration type: `Lambda Function`
   - ✅ Use Lambda Proxy integration: Yes
   - Lambda Function: `strava-callback`
   - Click **"Save"** → Click **"OK"**
   - Enable CORS (same settings as `/api/strava`)
   - Deploy the API

4. **Update Lambda `strava-callback` environment variable**:

   - Go to AWS Lambda Console
   - Select `strava-callback` function
   - Go to **Configuration** → **Environment variables**
   - Add/Update: `STRAVA_REDIRECT_URI` = `https://YOUR_API_GATEWAY_URL/prod/api/strava/callback`
   - Click **"Save"**

5. **Update Strava App Settings**:
   - Go to https://www.strava.com/settings/api
   - Find your app
   - Add redirect URI: `https://YOUR_API_GATEWAY_URL/prod/api/strava/callback`
   - Replace `YOUR_API_GATEWAY_URL` with your actual API Gateway URL

### Additional Step C: Get Refresh Token via OAuth

1. **Get Authorization Code**:

   - Visit this URL (replace `YOUR_CLIENT_ID` and `YOUR_API_GATEWAY_URL`):
     ```
     https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://YOUR_API_GATEWAY_URL/prod/api/strava/callback&scope=activity:read,profile:read_all
     ```
   - Authorize the app
   - You'll be redirected to your callback URL
   - The callback page will display your refresh token

2. **Add Refresh Token to Lambda**:
   - Copy the refresh token from the callback page
   - Go to AWS Lambda Console
   - Select `strava-api` function
   - Go to **Configuration** → **Environment variables**
   - Add/Update: `STRAVA_REFRESH_TOKEN` = (paste your refresh token)
   - Click **"Save"**

---

## 🔧 Troubleshooting

If something doesn't work:

1. **Check CloudWatch Logs**:

   - Go to AWS Lambda Console
   - Select the `strava-api` function
   - Click **"Monitor"** tab → **"View CloudWatch logs"**
   - Look for any error messages

2. **Verify Environment Variables**:

   - Make sure all environment variables are set correctly in the `strava-api` Lambda function
   - Check that the refresh token is valid

3. **Check API Gateway**:

   - Make sure the `/api/strava` resource is deployed
   - Verify CORS is enabled
   - Test the endpoint directly in API Gateway

4. **Check Strava App Settings**:
   - Verify your Client ID and Secret are correct
   - Make sure the callback domain is set correctly (if you used the callback flow)

## 📚 Additional Resources

- Full setup guide: `STRAVA_SETUP.md`
- AWS Lambda deployment: `AWS_LAMBDA_DEPLOYMENT.md`
- Strava API docs: https://developers.strava.com/docs/
