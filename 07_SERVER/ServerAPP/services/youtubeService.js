const https = require("https");

class YouTubeService {
    async search(query) {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            throw new Error("YouTube API key is not configured. Set YOUTUBE_API_KEY in your .env file.");
        }

        const encodedQuery = encodeURIComponent(query);
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=8&key=${apiKey}`;

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = "";
                res.on("data", chunk => { data += chunk; });
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) {
                            return reject(new Error(parsed.error.message));
                        }
                        const results = (parsed.items || []).map(item => ({
                            videoId: item.id.videoId,
                            title: item.snippet.title,
                            channelTitle: item.snippet.channelTitle,
                            thumbnail: item.snippet.thumbnails.medium.url,
                        }));
                        resolve(results);
                    } catch (e) {
                        reject(new Error("Failed to parse YouTube API response."));
                    }
                });
            }).on("error", reject);
        });
    }
}

module.exports = new YouTubeService();
