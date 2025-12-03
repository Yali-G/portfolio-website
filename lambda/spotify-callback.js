// Lambda function for /api/spotify/callback endpoint
// This handles the OAuth callback from Spotify and exchanges the code for a refresh token

exports.handler = async (event) => {
  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;

  if (error) {
    return {
      statusCode: 302,
      headers: {
        Location: `https://yaligoldstein.com/?error=spotify_auth_failed&message=${encodeURIComponent(error)}`,
      },
      body: "",
    };
  }

  if (!code) {
    return {
      statusCode: 302,
      headers: {
        Location: "https://yaligoldstein.com/?error=spotify_no_code&message=No authorization code received",
      },
      body: "",
    };
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 
    (event.requestContext?.domainName 
      ? `https://${event.requestContext.domainName}${event.requestContext.path}`
      : "https://yaligoldstein.com/api/spotify/callback");

  if (!clientId || !clientSecret) {
    return {
      statusCode: 302,
      headers: {
        Location: "https://yaligoldstein.com/?error=spotify_config&message=Server configuration missing",
      },
      body: "",
    };
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
      return {
        statusCode: 302,
        headers: {
          Location: "https://yaligoldstein.com/?error=spotify_token_exchange&message=Failed to exchange code for token",
        },
        body: "",
      };
    }

    const data = await response.json();
    const refreshToken = data.refresh_token;

    // Return HTML page with the refresh token
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Setup Complete</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
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
              font-size: 14px;
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
            button {
              background: #1db954;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
            }
            button:hover {
              background: #1ed760;
            }
            a {
              color: #1db954;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>✅ Spotify Authorization Complete!</h1>
          <div class="success">
            <p><strong>Add this to your Lambda function's environment variables:</strong></p>
            <div class="code-box" id="refreshToken">SPOTIFY_REFRESH_TOKEN=${refreshToken}</div>
            <button onclick="navigator.clipboard.writeText('${refreshToken}')">Copy Refresh Token</button>
          </div>
          <div class="warning">
            <p><strong>⚠️ Important:</strong> Keep this token secure!</p>
            <ol>
              <li>Go to AWS Lambda Console</li>
              <li>Select both <code>spotify-api</code> and <code>spotify-callback</code> functions</li>
              <li>Go to Configuration → Environment variables</li>
              <li>Add/Update: <code>SPOTIFY_REFRESH_TOKEN</code> = the token above</li>
              <li>Save the changes</li>
            </ol>
          </div>
          <p><a href="https://yaligoldstein.com/metrics">Go to Metrics Page →</a></p>
        </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: html,
    };
  } catch (error) {
    console.error("Error exchanging token:", error);
    return {
      statusCode: 302,
      headers: {
        Location: "https://yaligoldstein.com/?error=spotify_error&message=An error occurred during authorization",
      },
      body: "",
    };
  }
};

