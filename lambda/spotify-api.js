// Lambda function for /api/spotify endpoint
// This fetches currently playing, recently played, and top tracks from Spotify

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    console.error("Missing Spotify client credentials");
    return null;
  }

  // If we have a refresh token, use it to get a new access token
  if (refreshToken) {
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
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to refresh token:", errorText);
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  // Fallback to client credentials flow (limited scope)
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
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

exports.handler = async (event) => {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "https://yaligoldstein.com",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Failed to authenticate with Spotify" }),
      };
    }

    // Fetch multiple endpoints in parallel
    const [currentlyPlayingRes, recentlyPlayedRes, topTracksRes] =
      await Promise.allSettled([
        fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        fetch(
          "https://api.spotify.com/v1/me/player/recently-played?limit=5",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ),
        fetch(
          "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        ),
      ]);

    const responseData = {};

    // Process currently playing
    if (
      currentlyPlayingRes.status === "fulfilled" &&
      currentlyPlayingRes.value.ok
    ) {
      try {
        const data = await currentlyPlayingRes.value.json();
        if (data.item) {
          responseData.currentlyPlaying = {
            name: data.item.name,
            artist: data.item.artists.map((a) => a.name).join(", "),
            album: data.item.album.name,
            albumArt: data.item.album.images[0]?.url || "",
            isPlaying: data.is_playing,
          };
        }
      } catch (error) {
        console.error("Error parsing currently playing:", error);
      }
    }

    // Process recently played
    if (
      recentlyPlayedRes.status === "fulfilled" &&
      recentlyPlayedRes.value.ok
    ) {
      try {
        const data = await recentlyPlayedRes.value.json();
        responseData.recentlyPlayed = data.items.map((item) => ({
          name: item.track.name,
          artist: item.track.artists.map((a) => a.name).join(", "),
          playedAt: item.played_at,
        }));
      } catch (error) {
        console.error("Error parsing recently played:", error);
      }
    }

    // Process top tracks
    if (topTracksRes.status === "fulfilled" && topTracksRes.value.ok) {
      try {
        const data = await topTracksRes.value.json();
        responseData.topTracks = data.items.map((track) => ({
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
        }));
      } catch (error) {
        console.error("Error parsing top tracks:", error);
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://yaligoldstein.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://yaligoldstein.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Failed to fetch Spotify data" }),
    };
  }
};

