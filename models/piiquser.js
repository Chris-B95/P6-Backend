const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const piiqUserSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});
piiqUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("PiiqUser", piiqUserSchema);