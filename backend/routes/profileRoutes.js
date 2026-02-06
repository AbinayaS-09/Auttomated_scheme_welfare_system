// // const express = require("express");
// // const router = express.Router();
// // const auth = require("../middleware/authMiddleware");
// // const {
// //   getProfile,
// //   updateProfile,
// //   autoSave,
// //   incrementApplication,
// //   getSuspiciousProfiles,
// //   reviewProfile
// // } = require("../controllers/profileController");

// // // User routes (protected)
// // router.get("/", auth("user"), getProfile);
// // router.put("/", auth("user"), updateProfile);
// // router.post("/autosave", auth("user"), autoSave);
// // router.post("/increment-application", auth("user"), incrementApplication);

// // // Admin routes
// // router.get("/suspicious", auth("admin"), getSuspiciousProfiles);
// // router.post("/review", auth("admin"), reviewProfile);

// // module.exports = router;


// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");

// const {
//   getProfile,
//   updateProfile,
//   autoSave,
//   incrementApplication,
//   getSuspiciousProfiles,
//   reviewProfile
// } = require("../controllers/profileController");

// // USER
// router.get("/", auth("user"), getProfile);
// router.put("/", auth("user"), updateProfile);
// router.post("/autosave", auth("user"), autoSave);
// router.post("/increment-application", auth("user"), incrementApplication);

// // ADMIN
// router.get("/suspicious", auth("admin"), getSuspiciousProfiles);
// router.post("/review", auth("admin"), reviewProfile);

// module.exports = router;

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
// Allow both user and admin to access profile
router.get("/", auth(["user", "admin"]), getProfile);
router.put("/", auth(["user", "admin"]), updateProfile);
router.post("/autosave", auth(["user", "admin"]), autoSave);
router.post("/increment-application", auth(["user", "admin"]), incrementApplication);

// Admin only
router.get("/suspicious", auth("admin"), getSuspiciousProfiles);
router.post("/review", auth("admin"), reviewProfile);

module.exports = router;