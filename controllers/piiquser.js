const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const PiiqUser = require("../models/piiquser");

const dotenv = require("dotenv");
dotenv.config();
const PIIQ_TOKEN = process.env.PIIQ_TOKEN;

exports.signup = (req, res, next) => {
    argon2.hash(req.body.password, { type: argon2.argon2i })
        .then(hash => {
            const user = new PiiqUser({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    PiiqUser.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Paire login/mdp incorrecte" });
            }
            argon2.verify(user.password, req.body.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Paire login/mdp incorrecte" });
                    }
                    res.status(200).json({
                        userId: user._id, token: jwt.sign(
                            { userId: user._id },
                            PIIQ_TOKEN,
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};