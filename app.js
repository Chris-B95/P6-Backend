const express = require("express");
const mongoose = require("mongoose");
const piiqUserRoutes = require("./routes/piiquser");

const app = express();

// Connexion à la bdd
mongoose.connect("mongodb+srv://CBeauStudent:openclass2022@cluster0.jb5ldq9.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie!"))
    .catch(() => console.log("Connexion à MongoDB échouée!"));

// Analyse du corps de la requête
app.use(express.json());

// Configuration des headers de la requête
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// app.post("/api/auth/signup", (req, res, next) => {
//     console.log(req.body);
//     res.status(201).json({message: "Objet créé!"});
// });

// app.post("/api/auth/login", (req, res, next) => {
//     console.log(req.body);
//     res.status(201).json({message: "Objet créé!"});
// });

app.use("/api/auth", piiqUserRoutes);

module.exports = app;