const PiiqSauce = require("../models/piiqsauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
    PiiqSauce.find()
        .then(piiqsauces => res.status(200).json(piiqsauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    PiiqSauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
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
        .then(() => res.status(201).json({ message: "Objet créé!" }))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        case 1:
            PiiqSauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (!(sauce.usersLiked.includes(req.auth.userId))) {
                        let updatedLikes = sauce.likes + 1;
                        let updatedUsers = sauce.usersLiked;
                        updatedUsers.push(req.auth.userId);
                        PiiqSauce.updateOne({ _id: req.params.id }, { likes: updatedLikes, usersLiked: updatedUsers, _id: req.params.id })
                            .then(() => res.status(200).json({ message: "Likes modifiés!" }))
                            .catch(error => res.status(401).json({ error }));
                    } else {
                        console.log("Utilisateur a déjà like!");
                    };
                })
                .catch(error => res.status(400).json({ error }));
            break;
        case 0:
            PiiqSauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.auth.userId)) {
                        let updatedLikes = sauce.likes - 1;
                        let updatedUsers = sauce.usersLiked;
                        let userToRemove = sauce.usersLiked.indexOf(req.auth.userId);
                        updatedUsers.splice(userToRemove);
                        PiiqSauce.updateOne({ _id: req.params.id }, { likes: updatedLikes, usersLiked: updatedUsers, _id: req.params.id })
                            .then(() => res.status(200).json({ message: "Like retiré!" }))
                            .catch(error => res.status(401).json({ error }));
                    };
                    if (sauce.usersDisliked.includes(req.auth.userId)) {
                        let updatedDislikes = sauce.dislikes - 1;
                        let updatedUsers = sauce.usersDisliked;
                        let userToRemove = sauce.usersDisliked.indexOf(req.auth.userId);
                        updatedUsers.splice(userToRemove);
                        PiiqSauce.updateOne({ _id: req.params.id }, { dislikes: updatedDislikes, usersDisliked: updatedUsers, _id: req.params.id })
                            .then(() => res.status(200).json({ message: "Dislike retiré!" }))
                            .catch(error => res.status(401).json({ error }));
                    };
                })
                .catch(error => res.status(400).json({ error }));
            break;
        case -1:
            PiiqSauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (!(sauce.usersDisliked.includes(req.auth.userId))) {
                        let updatedDislikes = sauce.dislikes + 1;
                        let updatedUsers = sauce.usersDisliked;
                        updatedUsers.push(req.auth.userId);
                        PiiqSauce.updateOne({ _id: req.params.id }, { dislikes: updatedDislikes, usersDisliked: updatedUsers, _id: req.params.id })
                            .then(() => res.status(200).json({ message: "Dislikes modifiés!" }))
                            .catch(error => res.status(401).json({ error }));
                    } else {
                        console.log("Utilisateur a déjà dislike!");
                    };
                })
                .catch(error => res.status(400).json({ error }));
            break;
        default:
            break;
    };
};

exports.modifySauce = (req, res, next) => {
    const piiqSauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
    PiiqSauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Not auhorized" });
            } else {
                if (req.file) {
                    const filename = sauce.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) console.log(err);
                        else {
                            console.log(`Deleted file : images/${filename}`);
                        };
                    });
                };
                PiiqSauce.updateOne({ _id: req.params.id }, { ...piiqSauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet modifié!" }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    PiiqSauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Not auhorized" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    PiiqSauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Objet supprimé!" }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};