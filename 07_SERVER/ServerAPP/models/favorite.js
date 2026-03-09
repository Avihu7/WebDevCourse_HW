class Favorite {
    constructor({ id, userId, videoId, title, channelTitle, thumbnail, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.videoId = videoId;
        this.title = title;
        this.channelTitle = channelTitle;
        this.thumbnail = thumbnail;
        this.createdAt = createdAt;
    }
}

module.exports = Favorite;
