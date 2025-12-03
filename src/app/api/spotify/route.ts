import { NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
}

interface SpotifyCurrentlyPlayingResponse {
  is_playing: boolean;
  item: SpotifyTrack | null;
}

interface SpotifyRecentlyPlayedResponse {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
}

interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
}

// Get access token using client credentials or refresh token
async function getAccessToken(): Promise<string | null> {
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
        throw new Error("Failed to refresh token");
      }

      const data: SpotifyTokenResponse = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  // Otherwise, use client credentials flow (limited scope)
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

    const data: SpotifyTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to authenticate with Spotify" },
        { status: 401 }
      );
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

    const responseData: {
      currentlyPlaying?: {
        name: string;
        artist: string;
        album: string;
        albumArt: string;
        isPlaying: boolean;
      };
      recentlyPlayed?: Array<{
        name: string;
        artist: string;
        playedAt: string;
      }>;
      topTracks?: Array<{
        name: string;
        artist: string;
        album: string;
      }>;
    } = {};

    // Process currently playing
    if (
      currentlyPlayingRes.status === "fulfilled" &&
      currentlyPlayingRes.value.ok
    ) {
      const data: SpotifyCurrentlyPlayingResponse =
        await currentlyPlayingRes.value.json();
      if (data.item) {
        responseData.currentlyPlaying = {
          name: data.item.name,
          artist: data.item.artists.map((a) => a.name).join(", "),
          album: data.item.album.name,
          albumArt: data.item.album.images[0]?.url || "",
          isPlaying: data.is_playing,
        };
      }
    }

    // Process recently played
    if (
      recentlyPlayedRes.status === "fulfilled" &&
      recentlyPlayedRes.value.ok
    ) {
      const data: SpotifyRecentlyPlayedResponse =
        await recentlyPlayedRes.value.json();
      responseData.recentlyPlayed = data.items.map((item) => ({
        name: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        playedAt: item.played_at,
      }));
    }

    // Process top tracks
    if (topTracksRes.status === "fulfilled" && topTracksRes.value.ok) {
      const data: SpotifyTopTracksResponse = await topTracksRes.value.json();
      responseData.topTracks = data.items.map((track) => ({
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        album: track.album.name,
      }));
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Spotify data" },
      { status: 500 }
    );
  }
}

