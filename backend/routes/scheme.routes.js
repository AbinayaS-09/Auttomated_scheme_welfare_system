const express = require("express");
const router = express.Router();
const scrapeMyScheme = require("../scraper/myscheme.scraper");
const schemeController = require("../controllers/schemeController");
const auth = require("../middleware/authMiddleware");

// Sync schemes (Admin only or scheduled task)
router.post("/sync", async (req, res) => {
  try {
    await scrapeMyScheme();
    res.json({ message: "Government schemes synced successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get dashboard stats (User only)
router.get("/stats", auth("user"), schemeController.getDashboardStats);

// Get all eligible schemes (User only)
router.get("/eligible", auth("user"), schemeController.getEligibleSchemes);

// Get featured/recommended schemes
router.get("/featured", auth("user"), schemeController.getFeaturedSchemes);

// Get all schemes (Public or User?) - Let's make it User for now to track unique user
// If we want public access, we can remove auth or make it optional
router.get("/", auth("user"), schemeController.getSchemes);

// Get single scheme details
router.get("/:id", auth("user"), schemeController.getSchemeById);

module.exports = router;
