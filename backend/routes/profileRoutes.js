

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  autoSave,
  incrementApplication,
  getSuspiciousProfiles,
  reviewProfile
} = require("../controllers/profileController");
// Allow both user and admin to access profile  routes, but with different permissions handled in controller
router.get("/", auth(["user", "admin"]), getProfile);
// For updating profile, we allow both users and admins, but the controller will enforce that users can only update their own profile while admins can update any profile.
router.put("/", auth(["user", "admin"]), updateProfile);
router.post("/autosave", auth(["user", "admin"]), autoSave);
router.post("/increment-application", auth(["user", "admin"]), incrementApplication);

// Admin only
router.get("/suspicious", auth("admin"), getSuspiciousProfiles);
router.post("/review", auth("admin"), reviewProfile);

module.exports = router;