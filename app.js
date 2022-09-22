const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const piiqUserRoutes = require("./routes/piiquser");
const piiqSauceRoutes = require("./routes/piiqsauce");
const path = require("path");

const app = express();

// Connexion à la bdd
mongoose.connect("mongodb+srv://CBeauStudent:openclass2022@cluster0.jb5ldq9.mongodb.net/?retryWrites=true&w=majority",
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

app.use("/api/auth", piiqUserRoutes);
app.use("/api/sauces", piiqSauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;