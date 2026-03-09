class Favorite {
    constructor({ id, userId, videoId, title, channelTitle, thumbnail, addedAt }) {
        this.id = id;
        this.userId = userId;
        this.videoId = videoId;
        this.title = title;
        this.channelTitle = channelTitle;
        this.thumbnail = thumbnail;
        this.addedAt = addedAt;
    }
}

module.exports = Favorite;
