# AWS Lambda & API Gateway Deployment Guide

This guide walks you through deploying the Spotify API integration to AWS Lambda and API Gateway, so it works with your static S3-hosted site.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured (optional, but helpful)
- Your Spotify Client ID and Client Secret ready
- Access to AWS Console (Lambda, API Gateway, IAM)

## Step 1: Create Lambda Deployment Packages

### Option A: Using the provided script (Recommended)

```bash
# From the project root
cd lambda
zip spotify-api.zip spotify-api.js
zip spotify-callback.zip spotify-callback.js
cd ..
```

### Option B: Manual creation

1. Navigate to the `lambda` directory
2. Create two zip files:
   - `spotify-api.zip` containing only `spotify-api.js`
   - `spotify-callback.zip` containing only `spotify-callback.js`

**Important**: Only include the `.js` file in each zip, not the directory structure.

## Step 2: Create Lambda Functions

### 2.1 Create `spotify-api` Function

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. Click **"Create function"**
3. Select **"Author from scratch"**
4. Configure:
   - **Function name**: `spotify-api`
   - **Runtime**: `Node.js 20.x` (or latest available)
   - **Architecture**: `x86_64`
   - Click **"Create function"**

5. **Upload code**:
   - Scroll to "Code source"
   - Click **"Upload from"** → **".zip file"**
   - Select `lambda/spotify-api.zip`
   - Click **"Save"**

6. **Configure settings**:
   - Go to **Configuration** tab → **General configuration** → **Edit**
   - Set:
     - **Timeout**: `30 seconds`
     - **Memory**: `256 MB`
   - Click **"Save"**

7. **Set environment variables**:
   - Go to **Configuration** tab → **Environment variables** → **Edit**
   - Add the following:
     ```
     SPOTIFY_CLIENT_ID = your_client_id_here
     SPOTIFY_CLIENT_SECRET = your_client_secret_here
     SPOTIFY_REFRESH_TOKEN = (leave empty for now, add after Step 6)
     ```
   - Click **"Save"**

### 2.2 Create `spotify-callback` Function

Repeat the same steps for the callback function:

1. **Create function**:
   - Function name: `spotify-callback`
   - Runtime: `Node.js 20.x`
   - Architecture: `x86_64`

2. **Upload code**:
   - Upload `lambda/spotify-callback.zip`

3. **Configure settings**:
   - Timeout: `30 seconds`
   - Memory: `256 MB`

4. **Set environment variables** (same as above):
   ```
   SPOTIFY_CLIENT_ID = your_client_id_here
   SPOTIFY_CLIENT_SECRET = your_client_secret_here
   SPOTIFY_REDIRECT_URI = (we'll set this after creating API Gateway)
   ```

## Step 3: Set Up API Gateway

### 3.1 Create REST API

1. Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Click **"Create API"**
3. Select **"REST API"** → Click **"Build"**
4. Choose **"New API"**
5. Configure:
   - **API name**: `spotify-api` (or any name you prefer)
   - **Endpoint Type**: `Regional`
   - Click **"Create API"**

### 3.2 Create Resources and Methods

#### Create `/api` resource:

1. Select the root `/` resource
2. Click **"Actions"** → **"Create Resource"**
3. Configure:
   - **Resource Name**: `api`
   - **Resource Path**: `api`
   - ✅ **Enable API Gateway CORS**: Yes
   - Click **"Create Resource"**

#### Create `/api/spotify` resource:

1. Select the `/api` resource
2. Click **"Actions"** → **"Create Resource"**
3. Configure:
   - **Resource Name**: `spotify`
   - **Resource Path**: `spotify`
   - ✅ **Enable API Gateway CORS**: Yes
   - Click **"Create Resource"**

#### Create GET method for `/api/spotify`:

1. Select the `/api/spotify` resource
2. Click **"Actions"** → **"Create Method"** → Select **"GET"** → Click checkmark
3. Configure:
   - **Integration type**: `Lambda Function`
   - ✅ **Use Lambda Proxy integration**: Yes
   - **Lambda Function**: `spotify-api`
   - Click **"Save"** → Click **"OK"** (to allow API Gateway to invoke Lambda)

#### Create `/api/spotify/callback` resource:

1. Select the `/api/spotify` resource
2. Click **"Actions"** → **"Create Resource"**
3. Configure:
   - **Resource Name**: `callback`
   - **Resource Path**: `callback`
   - ✅ **Enable API Gateway CORS**: Yes
   - Click **"Create Resource"**

#### Create GET method for `/api/spotify/callback`:

1. Select the `/api/spotify/callback` resource
2. Click **"Actions"** → **"Create Method"** → Select **"GET"** → Click checkmark
3. Configure:
   - **Integration type**: `Lambda Function`
   - ✅ **Use Lambda Proxy integration**: Yes
   - **Lambda Function**: `spotify-callback`
   - Click **"Save"** → Click **"OK"**

### 3.3 Enable CORS

#### For `/api/spotify`:

1. Select `/api/spotify` resource
2. Click **"Actions"** → **"Enable CORS"**
3. Configure:
   - **Access-Control-Allow-Origin**: `https://yaligoldstein.com`
   - **Access-Control-Allow-Headers**: `Content-Type`
   - Leave other fields as default
   - Click **"Enable CORS and replace existing CORS headers"**

#### For `/api/spotify/callback`:

1. Select `/api/spotify/callback` resource
2. Click **"Actions"** → **"Enable CORS"**
3. Configure:
   - **Access-Control-Allow-Origin**: `https://yaligoldstein.com`
   - **Access-Control-Allow-Headers**: `Content-Type`
   - Click **"Enable CORS and replace existing CORS headers"**

### 3.4 Deploy API

1. Click **"Actions"** → **"Deploy API"**
2. Configure:
   - **Deployment stage**: `[New Stage]`
   - **Stage name**: `prod`
   - **Stage description**: `Production stage`
   - Click **"Deploy"**

3. **Important**: Note the **Invoke URL** shown at the top
   - Format: `https://{api-id}.execute-api.{region}.amazonaws.com/prod`
   - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`
   - **Save this URL** - you'll need it for the next steps!

### 3.5 Update Lambda Environment Variable

1. Go back to Lambda Console
2. Select `spotify-callback` function
3. Go to **Configuration** → **Environment variables** → **Edit**
4. Add/Update:
   ```
   SPOTIFY_REDIRECT_URI = https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback
   ```
   (Replace `YOUR_API_GATEWAY_URL` with your actual API Gateway URL from Step 3.4)
5. Click **"Save"**

## Step 4: Update Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click **"Edit Settings"**
4. Under **"Redirect URIs"**, add:
   ```
   https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback
   ```
   (Replace with your actual API Gateway URL)
5. Click **"Add"** → **"Save"**

## Step 5: Get Your Refresh Token

1. Construct the authorization URL (replace `YOUR_CLIENT_ID` with your actual Client ID):
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

2. Open this URL in your browser
3. Authorize the app with your Spotify account
4. You'll be redirected to your API Gateway callback URL
5. The page will display your **refresh token**
6. **Copy the refresh token**

## Step 6: Add Refresh Token to Lambda Functions

1. Go to Lambda Console
2. Select `spotify-api` function
3. Go to **Configuration** → **Environment variables** → **Edit**
4. Update `SPOTIFY_REFRESH_TOKEN` with the token you copied
5. Click **"Save"**
6. Repeat for `spotify-callback` function

## Step 7: Configure Frontend Environment Variable

You need to set the API Gateway URL as an environment variable for your Next.js build.

### Option A: For CI/CD (GitHub Actions, etc.)

Add this to your CI/CD workflow or build environment:

```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://YOUR_API_GATEWAY_URL/prod
```

### Option B: For Local Development

Create or update `.env.local`:

```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://YOUR_API_GATEWAY_URL/prod
```

### Option C: For Static Build (if your CI/CD doesn't support env vars)

You can hardcode it temporarily in `src/config/api.ts`:

```typescript
export const API_BASE_URL = "https://YOUR_API_GATEWAY_URL/prod";
```

**Note**: Make sure to use the environment variable approach for production to keep it flexible.

## Step 8: Test the Integration

1. **Rebuild your site**:
   ```bash
   npm run build
   ```

2. **Deploy to S3** (your CI/CD should handle this automatically)

3. **Visit your metrics page**:
   - Go to `https://yaligoldstein.com/metrics`
   - The Spotify section should now load your listening data!

## Troubleshooting

### 403 Forbidden from API Gateway

- Check that CORS is enabled on both resources
- Verify the `Access-Control-Allow-Origin` header includes your domain
- Check CloudWatch logs for the Lambda function

### 401 Unauthorized

- Verify environment variables are set correctly in Lambda
- Check that the refresh token is valid (not expired/revoked)
- Check CloudWatch logs for authentication errors

### CORS Errors in Browser

- Verify CORS is enabled on API Gateway resources
- Check that your domain matches exactly (including `https://`)
- Clear browser cache and try again

### Lambda Timeout

- Increase Lambda timeout to 30 seconds (or more if needed)
- Check CloudWatch logs for slow API calls

### No Data Showing

- Check browser console for errors
- Verify the API Gateway URL is correct
- Check Network tab to see if requests are being made
- Verify Lambda function logs in CloudWatch

## Monitoring

- **CloudWatch Logs**: Each Lambda function has its own log group
- **API Gateway Logs**: Enable CloudWatch logging in API Gateway settings
- **Lambda Metrics**: Check invocations, errors, and duration in CloudWatch

## Cost Considerations

- **Lambda**: First 1M requests/month are free, then $0.20 per 1M requests
- **API Gateway**: First 1M requests/month are free, then $3.50 per 1M requests
- For a personal portfolio, you'll likely stay within free tier

## Security Best Practices

- ✅ Never commit `.env` files or Lambda zip files with secrets
- ✅ Use AWS Secrets Manager for sensitive data (optional upgrade)
- ✅ Restrict API Gateway access if needed (API keys, usage plans)
- ✅ Regularly rotate refresh tokens if compromised
- ✅ Monitor CloudWatch logs for suspicious activity

## Next Steps

Once this is working:
1. Consider adding error handling and retry logic
2. Add caching to reduce API calls
3. Set up CloudWatch alarms for errors
4. Consider adding API rate limiting if needed

