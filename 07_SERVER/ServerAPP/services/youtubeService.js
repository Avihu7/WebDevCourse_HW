const https = require("https");

const MOCK_RESULTS = [
    {
        videoId: "dQw4w9WgXcQ",
        title: "Rick Astley - Never Gonna Give You Up (Official Video)",
        channelTitle: "Rick Astley",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    },
    {
        videoId: "9bZkp7q19f0",
        title: "PSY - GANGNAM STYLE(강남스타일) M/V",
        channelTitle: "officialpsy",
        thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
    },
    {
        videoId: "kJQP7kiw5Fk",
        title: "Luis Fonsi - Despacito ft. Daddy Yankee",
        channelTitle: "Luis Fonsi",
        thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
    },
    {
        videoId: "JGwWNGJdvx8",
        title: "Ed Sheeran - Shape of You (Official Music Video)",
        channelTitle: "Ed Sheeran",
        thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg",
    },
];

class YouTubeService {
    async search(query) {
        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey) {
            return MOCK_RESULTS;
        }

        const encodedQuery = encodeURIComponent(query);
        const options = {
            hostname: "www.googleapis.com",
            path: `/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=8&key=${apiKey}`,
            headers: { Referer: "http://localhost:3000" },
        };

        return new Promise((resolve) => {
            https.get(options, (res) => {
                let data = "";
                res.on("data", chunk => { data += chunk; });
                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) {
                            console.warn("YouTube API error:", parsed.error.message, "— returning mock results.");
                            return resolve(MOCK_RESULTS);
                        }
                        const results = (parsed.items || []).map(item => ({
                            videoId: item.id.videoId,
                            title: item.snippet.title,
                            channelTitle: item.snippet.channelTitle,
                            thumbnail: item.snippet.thumbnails.medium.url,
                        }));
                        resolve(results.length > 0 ? results : MOCK_RESULTS);
                    } catch (e) {
                        console.warn("Failed to parse YouTube API response — returning mock results.");
                        resolve(MOCK_RESULTS);
                    }
                });
            }).on("error", (err) => {
                console.warn("YouTube API request failed:", err.message, "— returning mock results.");
                resolve(MOCK_RESULTS);
            });
        });
    }
}

module.exports = new YouTubeService();
