const fetch = require('node-fetch');

const { buildUrl } = require('./utils');

const YOUTUBE_GAME_STREAMS_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video';
const YOUTUBE_LIVESTATS_URL = 'https://www.youtube.com/live_stats';

function fetchYoutubeStreams(query, key, limit = 10) {
    var link = buildUrl(YOUTUBE_GAME_STREAMS_URL, {
        q: query,
        key: key,
        maxResults: limit
    });

    return fetch(link)
        .then(res => res.json())
        .then(data => {
            return (data.items || []).map(item => {
                return {
                    videoId: item.id.videoId,
                    name: item.snippet.channelTitle,
                    status: item.snippet.title,
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    thumbnail_src: item.snippet.thumbnails.medium.url,
                    stream_src: "youtube",
                    viewers: 0
                };
            });
        })
        .then(streams => Promise.all(streams.map(fetchYoutubeViewers)));
}

function fetchYoutubeViewers(stream) {
    // viewer count is not available through youtube api v3 search
    // have to request this information from livestats endpoint
    var link = buildUrl(YOUTUBE_LIVESTATS_URL, { v: stream.videoId });
    return fetch(link)
        .then(res => res.json())
        .then(viewers => {
            stream.viewers = viewers;
            return stream;
        });
}

module.exports = {
    fetchYoutubeStreams
};
