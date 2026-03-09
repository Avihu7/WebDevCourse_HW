const youtubeService = require("../services/youtubeService");
const favoriteService = require("../services/favoriteService");

class FavoritesController {
    async showFavorites(req, res) {
        try {
            const favorites = await favoriteService.getFavorites(req.session.user.id);
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: [],
                query: "",
                error: null,
            });
        } catch (err) {
            res.render("favorites", {
                user: req.session.user,
                favorites: [],
                searchResults: [],
                query: "",
                error: err.message,
            });
        }
    }

    async search(req, res) {
        const { query } = req.body;
        let favorites = [];
        try {
            favorites = await favoriteService.getFavorites(req.session.user.id);
        } catch (_) {}

        try {
            const searchResults = await youtubeService.search(query);
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults,
                query,
                error: null,
            });
        } catch (err) {
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: [],
                query,
                error: err.message,
            });
        }
    }

    async addFavorite(req, res) {
        const { videoId, title, channelTitle, thumbnail } = req.body;
        try {
            await favoriteService.addFavorite(req.session.user.id, { videoId, title, channelTitle, thumbnail });
            res.redirect("/favorites");
        } catch (err) {
            let favorites = [];
            try { favorites = await favoriteService.getFavorites(req.session.user.id); } catch (_) {}
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: [],
                query: "",
                error: err.message,
            });
        }
    }

    async deleteFavorite(req, res) {
        const { id } = req.params;
        try {
            await favoriteService.deleteFavorite(id, req.session.user.id);
            res.redirect("/favorites");
        } catch (err) {
            let favorites = [];
            try { favorites = await favoriteService.getFavorites(req.session.user.id); } catch (_) {}
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: [],
                query: "",
                error: err.message,
            });
        }
    }
}

module.exports = new FavoritesController();
