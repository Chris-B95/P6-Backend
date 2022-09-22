const piiqsauce = require("../models/piiqsauce");
const PiiqSauce = require("../models/piiqsauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
    PiiqSauce.find()
        .then(piiqsauces => res.status(200).json(piiqsauces))
        .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    PiiqSauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) => {
    const piiqSauceObject = JSON.parse(req.body.sauce);
    const sauce = new PiiqSauce({
        ...piiqSauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Objet créé!"}))
        .catch(error => res.status(400).json({error}));
};

exports.likeSauce = (req, res, next) => {
    console.log(req.body);
};

exports.modifySauce = (req, res, next) => {
    const piiqSauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
    PiiqSauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Not auhorized"});
            } else {
                PiiqSauce.updateOne({_id: req.params.id}, {...piiqSauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: "Objet modifié!"}))
                    .catch(error => res.status(401).json({error}));
            }
        })
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    PiiqSauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Not auhorized"});
            } else {
                const filename = sauce.imageUrl.split("/images")[1];
                fs.unlink(`images/${filename}`, () => {
                    PiiqSauce.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: "Objet supprimé!"}))
                        .catch(error => res.status(401).json({error}));
                });
            }
        })
        .catch(error => res.status(500).json({error}));
};