const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Initialisation dotenv
dotenv.config();
const PIIQ_TOKEN = process.env.PIIQ_TOKEN;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, PIIQ_TOKEN);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({error});
    }
};