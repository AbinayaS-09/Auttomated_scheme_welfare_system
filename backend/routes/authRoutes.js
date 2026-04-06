const express = require("express");
// Import auth controller functions
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
/*Imports authentication/authorization middleware

🎯 Used for:
checking JWT token
verifying role
protecting routes*/

//POST /api/auth/register → Register new user
//POST /api/auth/login → Authenticate user and return JWT token
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
