// Lambda function for /api/strava endpoint
// This fetches recent activities and athlete stats from Strava

async function getAccessToken() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    console.error("Missing Strava client credentials");
    return null;
  }

  // If we have a refresh token, use it to get a new access token
  if (refreshToken) {
    try {
      const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
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

  return null;
}

// Helper function to format distance (meters to km or miles)
function formatDistance(meters) {
  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
}

// Helper function to format time (seconds to readable format)
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
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
        body: JSON.stringify({ error: "Failed to authenticate with Strava" }),
      };
    }

    // Fetch multiple endpoints in parallel
    const [activitiesRes, athleteRes] = await Promise.allSettled([
      fetch(
        "https://www.strava.com/api/v3/athlete/activities?per_page=10",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
      fetch("https://www.strava.com/api/v3/athlete", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ]);

    const responseData = {};

    // Process recent activities
    if (
      activitiesRes.status === "fulfilled" &&
      activitiesRes.value.ok
    ) {
      try {
        const data = await activitiesRes.value.json();
        responseData.recentActivities = data.map((activity) => ({
          name: activity.name || "Untitled Activity",
          type: activity.type,
          distance: activity.distance,
          distanceFormatted: formatDistance(activity.distance),
          movingTime: activity.moving_time,
          movingTimeFormatted: formatTime(activity.moving_time),
          elapsedTime: activity.elapsed_time,
          elapsedTimeFormatted: formatTime(activity.elapsed_time),
          totalElevationGain: activity.total_elevation_gain || 0,
          elevationFormatted: `${(activity.total_elevation_gain || 0).toFixed(0)} m`,
          startDate: activity.start_date,
          startDateLocal: activity.start_date_local,
          kudosCount: activity.kudos_count || 0,
          averageSpeed: activity.average_speed || 0,
          maxSpeed: activity.max_speed || 0,
          id: activity.id,
        }));
      } catch (error) {
        console.error("Error parsing activities:", error);
      }
    }

    // Process athlete info
    if (athleteRes.status === "fulfilled" && athleteRes.value.ok) {
      try {
        const data = await athleteRes.value.json();
        responseData.athlete = {
          id: data.id,
          firstName: data.firstname,
          lastName: data.lastname,
          profile: data.profile || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
        };
      } catch (error) {
        console.error("Error parsing athlete:", error);
      }
    }

    // Try to fetch athlete stats (requires athlete ID)
    if (responseData.athlete && responseData.athlete.id) {
      try {
        const statsRes = await fetch(
          `https://www.strava.com/api/v3/athletes/${responseData.athlete.id}/stats`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          responseData.stats = {
            allRideTotals: statsData.all_ride_totals
              ? {
                  distance: statsData.all_ride_totals.distance,
                  distanceFormatted: formatDistance(
                    statsData.all_ride_totals.distance
                  ),
                  movingTime: statsData.all_ride_totals.moving_time,
                  movingTimeFormatted: formatTime(
                    statsData.all_ride_totals.moving_time
                  ),
                  elevationGain: statsData.all_ride_totals.elevation_gain || 0,
                }
              : null,
            allRunTotals: statsData.all_run_totals
              ? {
                  distance: statsData.all_run_totals.distance,
                  distanceFormatted: formatDistance(
                    statsData.all_run_totals.distance
                  ),
                  movingTime: statsData.all_run_totals.moving_time,
                  movingTimeFormatted: formatTime(
                    statsData.all_run_totals.moving_time
                  ),
                  elevationGain: statsData.all_run_totals.elevation_gain || 0,
                }
              : null,
            recentRideTotals: statsData.recent_ride_totals
              ? {
                  distance: statsData.recent_ride_totals.distance,
                  distanceFormatted: formatDistance(
                    statsData.recent_ride_totals.distance
                  ),
                  movingTime: statsData.recent_ride_totals.moving_time,
                  movingTimeFormatted: formatTime(
                    statsData.recent_ride_totals.moving_time
                  ),
                }
              : null,
            recentRunTotals: statsData.recent_run_totals
              ? {
                  distance: statsData.recent_run_totals.distance,
                  distanceFormatted: formatDistance(
                    statsData.recent_run_totals.distance
                  ),
                  movingTime: statsData.recent_run_totals.moving_time,
                  movingTimeFormatted: formatTime(
                    statsData.recent_run_totals.moving_time
                  ),
                }
              : null,
            ytdRideTotals: statsData.ytd_ride_totals
              ? {
                  distance: statsData.ytd_ride_totals.distance,
                  distanceFormatted: formatDistance(
                    statsData.ytd_ride_totals.distance
                  ),
                  movingTime: statsData.ytd_ride_totals.moving_time,
                  movingTimeFormatted: formatTime(
                    statsData.ytd_ride_totals.moving_time
                  ),
                }
              : null,
            ytdRunTotals: statsData.ytd_run_totals
              ? {
                  distance: statsData.ytd_run_totals.distance,
                  distanceFormatted: formatDistance(
                    statsData.ytd_run_totals.distance
                  ),
                  movingTime: statsData.ytd_run_totals.moving_time,
                  movingTimeFormatted: formatTime(
                    statsData.ytd_run_totals.moving_time
                  ),
                }
              : null,
          };
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Stats are optional, so we don't fail the whole request
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
    console.error("Error fetching Strava data:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://yaligoldstein.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Failed to fetch Strava data" }),
    };
  }
};

