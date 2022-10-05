const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseErrors = require("mongoose-errors");

const piiqUserSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});
piiqUserSchema.plugin(uniqueValidator);
piiqUserSchema.plugin(mongooseErrors);

module.exports = mongoose.model("PiiqUser", piiqUserSchema);