const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const protect = require("../middleware/authMiddleware.js");

//adding the middelware protect to protect this route
router.get("/me", protect, userController.getUserProfile)

module.exports = router;