const express = require("express");
const router = express.Router();
const piiqSauceCtrl = require("../controllers/piiqsauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, piiqSauceCtrl.getAllSauces);
router.get("/:id", auth, piiqSauceCtrl.getOneSauce);
router.post("/", auth, multer, piiqSauceCtrl.createSauce);
router.post("/:id/like", auth, piiqSauceCtrl.likeSauce);
router.put("/:id", auth, multer, piiqSauceCtrl.modifySauce);
router.delete("/:id", auth, piiqSauceCtrl.deleteSauce);

module.exports = router;