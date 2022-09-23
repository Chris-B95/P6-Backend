const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const piiqUserRoutes = require("./routes/piiquser");
const piiqSauceRoutes = require("./routes/piiqsauce");
const path = require("path");

const app = express();

// Connexion à la bdd
dotenv.config();
const PIIQ_BDD = process.env.PIIQ_BDD;
mongoose.connect(PIIQ_BDD,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie!"))
    .catch(() => console.log("Connexion à MongoDB échouée!"));

// Helmet sécurité sur les headers, désactivation d'une option qui empêche chargement des images dans ce projet
app.use(helmet({crossOriginResourcePolicy: false,}));

// Analyse du corps de la requête
app.use(express.json());

// Configuration des headers de la requête
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// Requests limiter
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api/auth", apiLimiter, piiqUserRoutes);
app.use("/api/sauces", apiLimiter, piiqSauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;