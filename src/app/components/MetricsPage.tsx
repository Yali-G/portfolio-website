"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import { Music, Activity, BookOpen } from "lucide-react";
import { getApiUrl } from "../../config/api";

interface SpotifyData {
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
}

interface StravaData {
  recentActivities?: Array<{
    name: string;
    type: string;
    distance: number;
    distanceFormatted: string;
    movingTime: number;
    movingTimeFormatted: string;
    elapsedTime: number;
    elapsedTimeFormatted: string;
    totalElevationGain: number;
    elevationFormatted: string;
    startDate: string;
    startDateLocal: string;
    kudosCount: number;
    averageSpeed: number;
    maxSpeed: number;
    id: number;
  }>;
  athlete?: {
    id: number;
    firstName: string;
    lastName: string;
    profile: string;
    city: string;
    state: string;
    country: string;
  };
  stats?: {
    allRideTotals?: {
      distance: number;
      distanceFormatted: string;
      movingTime: number;
      movingTimeFormatted: string;
      elevationGain: number;
    };
    allRunTotals?: {
      distance: number;
      distanceFormatted: string;
      movingTime: number;
      movingTimeFormatted: string;
      elevationGain: number;
    };
    recentRideTotals?: {
      distance: number;
      distanceFormatted: string;
      movingTime: number;
      movingTimeFormatted: string;
    };
    recentRunTotals?: {
      distance: number;
      distanceFormatted: string;
      movingTime: number;
      movingTimeFormatted: string;
    };
    ytdRideTotals?: {
      distance: number;
      distanceFormatted: string;
      movingTime: number;
      movingTimeFormatted: string;
    };
    ytdRunTotals?: {
      distance: number;
      distanceFormatted: string;
      movingTime: number;
      movingTimeFormatted: string;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SubstackData {
  recentArticles?: Array<{
    title: string;
    publishedAt: string;
    url: string;
  }>;
}

const MetricsPage = () => {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [stravaData, setStravaData] = useState<StravaData | null>(null);
  // Placeholder for future Substack integration - will be used when implemented
  // const [substackData, setSubstackData] = useState<SubstackData | null>(null);
  const [loading, setLoading] = useState({
    spotify: true,
    strava: true,
    substack: true,
  });
  const [errors, setErrors] = useState({
    spotify: null as string | null,
    strava: null as string | null,
    substack: null as string | null,
  });

  // Fetch Spotify data
  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const apiUrl = getApiUrl("api/spotify");
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch Spotify data");
        }
        const data = await response.json();
        setSpotifyData(data);
        setLoading((prev) => ({ ...prev, spotify: false }));
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
        setErrors((prev) => ({
          ...prev,
          spotify: "Unable to load Spotify data. Please check your API configuration.",
        }));
        setLoading((prev) => ({ ...prev, spotify: false }));
      }
    };

    fetchSpotifyData();
  }, []);

  // Fetch Strava data
  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        const apiUrl = getApiUrl("api/strava");
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch Strava data");
        }
        const data = await response.json();
        setStravaData(data);
        setLoading((prev) => ({ ...prev, strava: false }));
      } catch (error) {
        console.error("Error fetching Strava data:", error);
        setErrors((prev) => ({
          ...prev,
          strava: "Unable to load Strava data. Please check your API configuration.",
        }));
        setLoading((prev) => ({ ...prev, strava: false }));
      }
    };

    fetchStravaData();
  }, []);

  // Placeholder for Substack data fetching
  useEffect(() => {
    // TODO: Implement Substack API integration
    setLoading((prev) => ({ ...prev, substack: false }));
  }, []);

  return (
    <section
      className="section bg-[var(--intro-background)] transition-all duration-300 min-h-full overflow-hidden"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <div className="flex m-4 gap-8 justify-evenly md:justify-between">
        <Navbar />
      </div>

      <div className="flex flex-col items-center p-4 md:p-8 min-h-[70vh] gap-8 w-full max-w-full">
        <h1 className="header text-3xl md:text-5xl mb-4">My Metrics</h1>
        <p className="paragraph text-lg md:text-xl mb-8 text-center max-w-2xl">
          A live dashboard of my activity across different platforms
        </p>

        <div className="w-full max-w-6xl space-y-8">
          {/* Spotify Section */}
          <div className="bg-[var(--components-background)] rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-6 h-6" />
              <h2 className="header text-2xl md:text-3xl">Spotify</h2>
            </div>

            {loading.spotify ? (
              <div className="paragraph">Loading Spotify data...</div>
            ) : errors.spotify ? (
              <div className="paragraph text-red-500">{errors.spotify}</div>
            ) : spotifyData ? (
              <div className="space-y-6">
                {/* Currently Playing */}
                {spotifyData.currentlyPlaying && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="paragraph text-lg font-semibold mb-3">
                      Currently Playing
                    </h3>
                    <div className="flex items-center gap-4">
                      {spotifyData.currentlyPlaying.albumArt && (
                        <img
                          src={spotifyData.currentlyPlaying.albumArt}
                          alt={spotifyData.currentlyPlaying.album}
                          className="w-16 h-16 rounded-lg"
                        />
                      )}
                      <div>
                        <p className="paragraph font-semibold">
                          {spotifyData.currentlyPlaying.name}
                        </p>
                        <p className="paragraph text-sm text-gray-600 dark:text-gray-400">
                          {spotifyData.currentlyPlaying.artist}
                        </p>
                        <p className="paragraph text-xs text-gray-500 dark:text-gray-500">
                          {spotifyData.currentlyPlaying.album}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recently Played */}
                {spotifyData.recentlyPlayed &&
                  spotifyData.recentlyPlayed.length > 0 && (
                    <div>
                      <h3 className="paragraph text-lg font-semibold mb-3">
                        Recently Played
                      </h3>
                      <div className="space-y-2">
                        {spotifyData.recentlyPlayed.slice(0, 5).map(
                          (track, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800"
                            >
                              <div>
                                <p className="paragraph">{track.name}</p>
                                <p className="paragraph text-sm text-gray-600 dark:text-gray-400">
                                  {track.artist}
                                </p>
                              </div>
                              <p className="paragraph text-xs text-gray-500">
                                {new Date(track.playedAt).toLocaleTimeString()}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Top Tracks */}
                {spotifyData.topTracks && spotifyData.topTracks.length > 0 && (
                  <div>
                    <h3 className="paragraph text-lg font-semibold mb-3">
                      Top Tracks
                    </h3>
                    <div className="space-y-2">
                      {spotifyData.topTracks.slice(0, 5).map((track, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800"
                        >
                          <span className="paragraph text-gray-500 w-6">
                            {index + 1}.
                          </span>
                          <div>
                            <p className="paragraph">{track.name}</p>
                            <p className="paragraph text-sm text-gray-600 dark:text-gray-400">
                              {track.artist}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="paragraph">
                No Spotify data available. Please configure your API keys.
              </div>
            )}
          </div>

          {/* Strava Section */}
          <div className="bg-[var(--components-background)] rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6" />
              <h2 className="header text-2xl md:text-3xl">Strava</h2>
            </div>

            {loading.strava ? (
              <div className="paragraph">Loading Strava data...</div>
            ) : errors.strava ? (
              <div className="paragraph text-red-500">{errors.strava}</div>
            ) : stravaData ? (
              <div className="space-y-6">
                {/* Athlete Info */}
                {stravaData.athlete && (
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center gap-4">
                      {stravaData.athlete.profile && (
                        <img
                          src={stravaData.athlete.profile}
                          alt={`${stravaData.athlete.firstName} ${stravaData.athlete.lastName}`}
                          className="w-16 h-16 rounded-full"
                        />
                      )}
                      <div>
                        <p className="paragraph font-semibold">
                          {stravaData.athlete.firstName} {stravaData.athlete.lastName}
                        </p>
                        {(stravaData.athlete.city || stravaData.athlete.state || stravaData.athlete.country) && (
                          <p className="paragraph text-sm text-gray-600 dark:text-gray-400">
                            {[stravaData.athlete.city, stravaData.athlete.state, stravaData.athlete.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Summary */}
                {stravaData.stats && (
                  <div>
                    <h3 className="paragraph text-lg font-semibold mb-3">
                      Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stravaData.stats.ytdRunTotals && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="paragraph text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Year to Date - Running
                          </p>
                          <p className="paragraph font-semibold text-lg">
                            {stravaData.stats.ytdRunTotals.distanceFormatted}
                          </p>
                          <p className="paragraph text-xs text-gray-500">
                            {stravaData.stats.ytdRunTotals.movingTimeFormatted}
                          </p>
                        </div>
                      )}
                      {stravaData.stats.ytdRideTotals && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="paragraph text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Year to Date - Cycling
                          </p>
                          <p className="paragraph font-semibold text-lg">
                            {stravaData.stats.ytdRideTotals.distanceFormatted}
                          </p>
                          <p className="paragraph text-xs text-gray-500">
                            {stravaData.stats.ytdRideTotals.movingTimeFormatted}
                          </p>
                        </div>
                      )}
                      {stravaData.stats.recentRunTotals && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="paragraph text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Recent - Running
                          </p>
                          <p className="paragraph font-semibold text-lg">
                            {stravaData.stats.recentRunTotals.distanceFormatted}
                          </p>
                          <p className="paragraph text-xs text-gray-500">
                            {stravaData.stats.recentRunTotals.movingTimeFormatted}
                          </p>
                        </div>
                      )}
                      {stravaData.stats.recentRideTotals && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="paragraph text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Recent - Cycling
                          </p>
                          <p className="paragraph font-semibold text-lg">
                            {stravaData.stats.recentRideTotals.distanceFormatted}
                          </p>
                          <p className="paragraph text-xs text-gray-500">
                            {stravaData.stats.recentRideTotals.movingTimeFormatted}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recent Activities */}
                {stravaData.recentActivities &&
                  stravaData.recentActivities.length > 0 && (
                    <div>
                      <h3 className="paragraph text-lg font-semibold mb-3">
                        Recent Activities
                      </h3>
                      <div className="space-y-3">
                        {stravaData.recentActivities.slice(0, 5).map(
                          (activity, index) => (
                            <div
                              key={activity.id || index}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="paragraph font-semibold">
                                    {activity.name}
                                  </p>
                                  <p className="paragraph text-sm text-gray-600 dark:text-gray-400">
                                    {activity.type}
                                  </p>
                                </div>
                                <p className="paragraph text-xs text-gray-500">
                                  {new Date(
                                    activity.startDateLocal
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                <div>
                                  <p className="paragraph text-gray-600 dark:text-gray-400 text-xs">
                                    Distance
                                  </p>
                                  <p className="paragraph font-semibold">
                                    {activity.distanceFormatted}
                                  </p>
                                </div>
                                <div>
                                  <p className="paragraph text-gray-600 dark:text-gray-400 text-xs">
                                    Time
                                  </p>
                                  <p className="paragraph font-semibold">
                                    {activity.movingTimeFormatted}
                                  </p>
                                </div>
                                {activity.totalElevationGain > 0 && (
                                  <div>
                                    <p className="paragraph text-gray-600 dark:text-gray-400 text-xs">
                                      Elevation
                                    </p>
                                    <p className="paragraph font-semibold">
                                      {activity.elevationFormatted}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {activity.kudosCount > 0 && (
                                <p className="paragraph text-xs text-gray-500 mt-2">
                                  ❤️ {activity.kudosCount} kudos
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="paragraph">
                No Strava data available. Please configure your API keys.
              </div>
            )}
          </div>

          {/* Substack Section - Placeholder */}
          <div className="bg-[var(--components-background)] rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6" />
              <h2 className="header text-2xl md:text-3xl">Substack</h2>
            </div>
            <div className="paragraph">
              Substack integration coming soon...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsPage;

