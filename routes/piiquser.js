const express = require("express");
const router = express.Router();
const piiqUserCtrl = require("../controllers/piiquser");

router.post("/signup", piiqUserCtrl.signup);
router.post("/login", piiqUserCtrl.login);


module.exports = router;