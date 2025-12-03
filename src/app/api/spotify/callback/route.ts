import { NextResponse } from "next/server";

/**
 * Spotify OAuth Callback Handler
 * 
 * This route handles the OAuth callback from Spotify.
 * After authorization, Spotify redirects here with an authorization code.
 * 
 * For local development: You can use your production callback URL.
 * Just copy the "code" parameter from the redirect URL.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/?error=spotify_auth_failed&message=${encodeURIComponent(error)}`,
        request.url
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/?error=spotify_no_code&message=No authorization code received",
        request.url
      )
    );
  }

  // For production: Exchange the code for tokens server-side
  // For local development: Show the code so user can use the helper script
  const isLocalhost = request.url.includes("localhost");

  if (isLocalhost) {
    // In local development, show the code on a simple page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Authorization Code</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #1a1a1a;
              color: #fff;
            }
            .code-box {
              background: #2a2a2a;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              word-break: break-all;
              font-family: monospace;
            }
            .instructions {
              background: #2a4a2a;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            button {
              background: #1db954;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
            button:hover {
              background: #1ed760;
            }
          </style>
        </head>
        <body>
          <h1>✅ Spotify Authorization Successful!</h1>
          <p>Copy the authorization code below:</p>
          <div class="code-box" id="code">${code}</div>
          <div class="instructions">
            <h3>Next Steps:</h3>
            <p>Run this command in your terminal:</p>
            <div class="code-box">
              node scripts/get-spotify-token.js ${code}
            </div>
            <p>Or manually copy the code above and use it with the helper script.</p>
          </div>
          <button onclick="navigator.clipboard.writeText('${code}')">Copy Code</button>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }

  // For production: Automatically exchange code for tokens
  // This requires storing the refresh token securely
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "https://yaligoldstein.com/api/spotify/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(
        "/?error=spotify_config&message=Server configuration missing",
        request.url
      )
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Token exchange error:", errorData);
      return NextResponse.redirect(
        new URL(
          `/?error=spotify_token_exchange&message=Failed to exchange code for token`,
          request.url
        )
      );
    }

    const data = await response.json();
    const refreshToken = data.refresh_token;

    // In production, you'd want to store this securely
    // For now, show it to the user so they can add it to their .env
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Setup Complete</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #1a1a1a;
              color: #fff;
            }
            .code-box {
              background: #2a2a2a;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              word-break: break-all;
              font-family: monospace;
            }
            .warning {
              background: #4a2a2a;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #ff6b6b;
            }
            .success {
              background: #2a4a2a;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #1db954;
            }
          </style>
        </head>
        <body>
          <h1>✅ Spotify Authorization Complete!</h1>
          <div class="success">
            <p><strong>Add this to your environment variables:</strong></p>
            <div class="code-box">
              SPOTIFY_REFRESH_TOKEN=${refreshToken}
            </div>
          </div>
          <div class="warning">
            <p><strong>⚠️ Important:</strong> Keep this token secure! Never commit it to version control.</p>
            <p>Add it to your <code>.env.local</code> file or your hosting platform's environment variables.</p>
          </div>
          <p><a href="/metrics" style="color: #1db954;">Go to Metrics Page →</a></p>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Error exchanging token:", error);
    return NextResponse.redirect(
      new URL(
        `/?error=spotify_error&message=An error occurred during authorization`,
        request.url
      )
    );
  }
}

