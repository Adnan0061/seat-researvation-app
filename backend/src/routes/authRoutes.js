const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  validateToken,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/validate", protect, validateToken);

module.exports = router;
