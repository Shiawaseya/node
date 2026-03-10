const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authGuard = require("../middlewares/auth.middleware");

router.post("/login", authController.login);
router.get("/me", authGuard, authController.getMe);
router.post("/logout", authGuard, authController.logout);

module.exports = router;
