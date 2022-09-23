const passwordValidator = require("password-validator");
const emailValidator = require("email-validator");

// Crée les schemas
const schemaMail = new passwordValidator();
const schemaPass = new passwordValidator();

// Ajout de propriétés
schemaMail
    .is().min(3)
    .usingPlugin(emailValidator.validate, "Un e-mail doit être entré");

schemaPass
    .is().min(8, "Le password doit contenir au moins 8 caractères")
    .is().max(100, "Le password doit contenir au max 100 caractères")
    .has().uppercase(1, "Le password doit contenir au moins 1 majuscule")
    .has().lowercase(1, "Le password doit contenir au moins 1 minuscule")
    .has().digits(2, "Le password doit contenir au moins 2 chiffres")
    .has().not().spaces(1, "Le password ne doit pas contenir d'espaces");

// Déclarations et export des fonctions

module.exports = {
    validEmail: function(email) {
        return schemaMail.validate(email);
    },
    validPass: function(pass) {
        return schemaPass.validate(pass);
    }
 };