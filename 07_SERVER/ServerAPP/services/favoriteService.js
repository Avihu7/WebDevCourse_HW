const favoriteRepo = require("../repositories/favoriteRepository");

class FavoriteService {
    async getFavorites(userId) {
        return favoriteRepo.findByUserId(userId);
    }

    async addFavorite(userId, { videoId, title, channelTitle, thumbnail }) {
        const existing = await favoriteRepo.findByUserIdAndVideoId(userId, videoId);
        if (existing) {
            throw new Error("This video is already in your favorites.");
        }
        return favoriteRepo.create({ userId, videoId, title, channelTitle, thumbnail });
    }

    async deleteFavorite(id, userId) {
        const changes = await favoriteRepo.deleteById(id, userId);
        if (changes === 0) {
            throw new Error("Favorite not found or access denied.");
        }
    }
}

module.exports = new FavoriteService();
