# Quick Start Guide - AWS Lambda Deployment

This is a condensed version of the full deployment guide. For detailed instructions, see [AWS_LAMBDA_DEPLOYMENT.md](./AWS_LAMBDA_DEPLOYMENT.md).

## Prerequisites Checklist

- [ ] AWS Account with Lambda and API Gateway access
- [ ] Spotify Client ID and Client Secret (from Spotify Developer Dashboard)
- [ ] Lambda deployment packages created (run `./scripts/package-lambda.sh`)

## Quick Deployment Steps

### 1. Package Lambda Functions

```bash
./scripts/package-lambda.sh
```

This creates:
- `lambda/spotify-api.zip`
- `lambda/spotify-callback.zip`

### 2. Create Lambda Functions in AWS

**Function 1: `spotify-api`**
- Runtime: Node.js 20.x
- Upload: `lambda/spotify-api.zip`
- Timeout: 30 seconds
- Memory: 256 MB
- Environment variables:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`
  - `SPOTIFY_REFRESH_TOKEN` (add after Step 5)

**Function 2: `spotify-callback`**
- Same settings as above
- Upload: `lambda/spotify-callback.zip`
- Environment variables:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`
  - `SPOTIFY_REDIRECT_URI` (add after Step 3)

### 3. Create API Gateway

1. Create REST API (Regional)
2. Create resources:
   - `/api` → `/api/spotify` → `/api/spotify/callback`
3. Create GET methods:
   - `/api/spotify` → Lambda: `spotify-api`
   - `/api/spotify/callback` → Lambda: `spotify-callback`
4. Enable CORS on both resources
5. Deploy to stage: `prod`
6. **Save the Invoke URL** (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

### 4. Update Configurations

**Lambda `spotify-callback`:**
- Add environment variable: `SPOTIFY_REDIRECT_URI = https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback`

**Spotify App:**
- Add redirect URI: `https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback`

### 5. Get Refresh Token

1. Visit authorization URL:
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback&scope=user-read-currently-playing%20user-read-recently-played%20user-top-read
   ```

2. Authorize → Copy refresh token from callback page

3. Add to both Lambda functions: `SPOTIFY_REFRESH_TOKEN = your_token`

### 6. Configure Frontend

**For CI/CD:**
Add to your build environment:
```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://YOUR_API_GATEWAY_URL/prod
```

**For local development:**
Add to `.env.local`:
```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://YOUR_API_GATEWAY_URL/prod
```

### 7. Deploy & Test

1. Push to GitHub (your CI/CD will build and deploy)
2. Visit `https://yaligoldstein.com/metrics`
3. Spotify data should load! 🎉

## Troubleshooting

- **403 errors**: Check CORS settings in API Gateway
- **401 errors**: Verify environment variables in Lambda
- **No data**: Check browser console and CloudWatch logs
- **CORS errors**: Verify domain matches exactly in CORS settings

For detailed troubleshooting, see [AWS_LAMBDA_DEPLOYMENT.md](./AWS_LAMBDA_DEPLOYMENT.md).

