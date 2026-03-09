const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM Favorites WHERE userId = ? ORDER BY addedAt DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows.map(row => new Favorite(row)));
                }
            );
        });
    }

    async findByUserIdAndVideoId(userId, videoId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM Favorites WHERE userId = ? AND videoId = ?`,
                [userId, videoId],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row ? new Favorite(row) : null);
                }
            );
        });
    }

    async create({ userId, videoId, title, channelTitle, thumbnail }) {
        const addedAt = new Date().toISOString();
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Favorites (userId, videoId, title, channelTitle, thumbnail, addedAt)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, videoId, title, channelTitle, thumbnail, addedAt],
                function (err) {
                    if (err) return reject(err);
                    resolve(new Favorite({ id: this.lastID, userId, videoId, title, channelTitle, thumbnail, addedAt }));
                }
            );
        });
    }

    // userId guard ensures a user can only delete their own favorites
    async deleteById(id, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM Favorites WHERE id = ? AND userId = ?`,
                [id, userId],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                }
            );
        });
    }
}

module.exports = new FavoriteRepository();
