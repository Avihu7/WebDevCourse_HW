const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");
const requireAuth = require("../middleware/requireAuth");

router.get("/favorites", requireAuth, (req, res) => favoritesController.showFavorites(req, res));
router.post("/favorites/search", requireAuth, (req, res) => favoritesController.search(req, res));
router.post("/favorites/add", requireAuth, (req, res) => favoritesController.addFavorite(req, res));
router.post("/favorites/delete/:id", requireAuth, (req, res) => favoritesController.deleteFavorite(req, res));

module.exports = router;
