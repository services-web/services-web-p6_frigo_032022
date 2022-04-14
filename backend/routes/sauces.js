const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
// multer to save images on server
const multer = require("../middleware/multer-config");

/*Toutes les requêtes POST doivent utiliser HTTPS/SSL 
pour s'assurer que le corps est chiffré.*/

const saucesCtrl = require("../controllers/sauces");
// routes sauces
// GET que pour récupérer des informations.
router.get("/", auth, saucesCtrl.getAllSauces);
//POST pour les informations qui seront manipulées.
router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
// route for likes
router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
