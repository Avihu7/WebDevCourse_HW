require("dotenv").config();
const express = require("express");
const path = require("path");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const requireAuth = require("./middleware/requireAuth");

const app = express();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// body parsing
app.use(express.urlencoded({ extended: true }));

// sessions
app.use(sessionMiddleware);

// make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// routes
app.use(authRoutes);
app.use(favoritesRoutes);

// protected home
app.get("/", requireAuth, (req, res) => {
    res.render("home", { user: req.session.user });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
