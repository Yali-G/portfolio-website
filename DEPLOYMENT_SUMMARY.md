# Deployment Summary

## What Has Been Implemented

✅ **Lambda Functions Created**
- `lambda/spotify-api.js` - Fetches Spotify listening data
- `lambda/spotify-callback.js` - Handles OAuth callback and token exchange

✅ **Frontend Updated**
- `src/config/api.ts` - API configuration with environment variable support
- `src/app/components/MetricsPage.tsx` - Updated to use API Gateway URL

✅ **Helper Scripts**
- `scripts/package-lambda.sh` - Packages Lambda functions for deployment

✅ **Documentation**
- `AWS_LAMBDA_DEPLOYMENT.md` - Complete step-by-step deployment guide
- `QUICK_START.md` - Condensed quick reference guide
- `SPOTIFY_SETUP.md` - Original Spotify API setup guide

## What You Need to Do

### 1. Package Lambda Functions

```bash
./scripts/package-lambda.sh
```

This creates the zip files needed for AWS Lambda deployment.

### 2. Deploy to AWS

Follow the detailed instructions in `AWS_LAMBDA_DEPLOYMENT.md`:

1. **Create Lambda Functions** (2 functions)
   - `spotify-api`
   - `spotify-callback`
   - Upload the zip files
   - Set environment variables

2. **Create API Gateway**
   - REST API
   - Resources: `/api/spotify` and `/api/spotify/callback`
   - Methods: GET for both
   - Enable CORS
   - Deploy to `prod` stage

3. **Get Your Refresh Token**
   - Authorize the app via Spotify
   - Copy the refresh token from the callback page
   - Add it to both Lambda functions

### 3. Configure Your CI/CD

Add the API Gateway URL as an environment variable in your CI/CD pipeline:

```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://YOUR_API_GATEWAY_URL/prod
```

**For GitHub Actions**, add to your workflow file:
```yaml
env:
  NEXT_PUBLIC_API_GATEWAY_URL: https://YOUR_API_GATEWAY_URL/prod
```

**For other CI/CD platforms**, add it as a build environment variable.

### 4. Update Spotify App

In Spotify Developer Dashboard, add the callback URL:
```
https://YOUR_API_GATEWAY_URL/prod/api/spotify/callback
```

### 5. Test

1. Push your changes to GitHub
2. Your CI/CD will build and deploy to S3
3. Visit `https://yaligoldstein.com/metrics`
4. Spotify data should load!

## File Structure

```
yali-portfolio/
├── lambda/
│   ├── spotify-api.js          # Main API Lambda function
│   ├── spotify-callback.js      # OAuth callback Lambda function
│   └── package.json            # Lambda package config
├── scripts/
│   ├── package-lambda.sh        # Helper to package Lambda functions
│   └── get-spotify-token.js     # Helper to get refresh token (local)
├── src/
│   ├── config/
│   │   └── api.ts               # API configuration
│   └── app/
│       └── components/
│           └── MetricsPage.tsx  # Updated to use API Gateway
├── AWS_LAMBDA_DEPLOYMENT.md     # Full deployment guide
├── QUICK_START.md               # Quick reference
└── SPOTIFY_SETUP.md             # Original setup guide
```

## Environment Variables Needed

### For Lambda Functions:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN` (get from OAuth flow)
- `SPOTIFY_REDIRECT_URI` (for callback function only)

### For Next.js Build (CI/CD):
- `NEXT_PUBLIC_API_GATEWAY_URL` (your API Gateway URL)

## Important Notes

1. **Don't commit**:
   - `.env.local` files
   - Lambda zip files (`lambda/*.zip`)
   - Any files with secrets

2. **API Gateway URL Format**:
   ```
   https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
   ```

3. **CORS Configuration**:
   - Must include `https://yaligoldstein.com` exactly
   - Enable on both `/api/spotify` and `/api/spotify/callback`

4. **Lambda Settings**:
   - Timeout: 30 seconds (minimum recommended)
   - Memory: 256 MB (sufficient for this use case)

## Next Steps After Deployment

1. ✅ Test the integration
2. ✅ Monitor CloudWatch logs for any errors
3. ✅ Consider adding error handling improvements
4. ✅ Set up CloudWatch alarms if needed
5. 🔜 Add Strava integration (similar pattern)
6. 🔜 Add Substack integration (similar pattern)

## Getting Help

- Check `AWS_LAMBDA_DEPLOYMENT.md` for detailed troubleshooting
- Review CloudWatch logs for Lambda function errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly

## Cost Estimate

For a personal portfolio site:
- **Lambda**: Free tier covers ~1M requests/month
- **API Gateway**: Free tier covers ~1M requests/month
- **Total**: Likely $0/month for typical usage

