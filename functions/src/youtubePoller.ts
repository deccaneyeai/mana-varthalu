// Cloud Function: youtubePoller
// Trigger: Runs every 5 minutes
// Checks YouTube channel live status and fetches latest videos

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// YouTube Data API v3 helper
async function fetchYouTubeAPI(endpoint: string, params: Record<string, string>) {
  const apiKey = functions.config().youtube?.api_key || process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  const queryString = new URLSearchParams({ ...params, key: apiKey }).toString();
  const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${queryString}`;

  const fetch = (await import('node-fetch')).default;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const youtubePoller = functions
  .region('asia-south1')
  .pubsub.schedule('every 5 minutes')
  .onRun(async () => {
    try {
      // Get channel config from Firestore
      const configDoc = await db.collection('youtube').doc('config').get();
      const config = configDoc.data();

      if (!config || !config.channelId) {
        functions.logger.warn('YouTube channel not configured');
        return null;
      }

      const channelId = config.channelId;

      // 1. Check if channel is live
      let isLive = false;
      let liveStreamId = '';

      try {
        const searchResult: any = await fetchYouTubeAPI('search', {
          part: 'id,snippet',
          channelId,
          type: 'video',
          eventType: 'live',
          maxResults: '1',
        });

        if (searchResult.items && searchResult.items.length > 0) {
          isLive = true;
          liveStreamId = searchResult.items[0].id.videoId;
          functions.logger.info(`Channel ${channelId} is LIVE: ${liveStreamId}`);
        }
      } catch (liveError) {
        functions.logger.warn('Live check failed:', liveError);
      }

      // 2. Fetch latest 10 videos
      let latestVideos: Array<{
        videoId: string;
        title: string;
        thumbnail: string;
        publishedAt: string;
      }> = [];

      try {
        const videosResult: any = await fetchYouTubeAPI('search', {
          part: 'id,snippet',
          channelId,
          type: 'video',
          order: 'date',
          maxResults: '10',
        });

        if (videosResult.items) {
          latestVideos = videosResult.items.map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
            publishedAt: item.snippet.publishedAt,
          }));
        }
      } catch (videosError) {
        functions.logger.error('Videos fetch failed:', videosError);
      }

      // 3. Update Firestore
      await db.collection('youtube').doc('config').update({
        isLive,
        liveStreamId: isLive ? liveStreamId : '',
        latestVideos,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(`YouTube poll complete. Live: ${isLive}, Videos: ${latestVideos.length}`);
    } catch (error) {
      functions.logger.error('youtubePoller error:', error);
    }

    return null;
  });
