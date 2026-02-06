const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// ⭐ Protected Routes
router.get("/user-home", auth("user"), (req, res) => {
  res.json({ message: "User Dashboard Access Allowed" });
});

router.get("/admin-home", auth("admin"), (req, res) => {
  res.json({ message: "Admin Dashboard Access Allowed" });
});

module.exports = router;
