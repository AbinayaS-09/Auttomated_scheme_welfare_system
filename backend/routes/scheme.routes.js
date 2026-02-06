const express = require("express");
const Scheme = require("../models/Scheme");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get all schemes (with pagination and search)
router.get("/", auth(), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [require("sequelize").Op.or]: [
            { scheme_name: { [require("sequelize").Op.like]: `%${search}%` } },
            { ministry: { [require("sequelize").Op.like]: `%${search}%` } },
            { description: { [require("sequelize").Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { count, rows } = await Scheme.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]]
    });

    res.json({
      schemes: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single scheme by ID
router.get("/:id", auth(), async (req, res) => {
  try {
    const scheme = await Scheme.findByPk(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new scheme (admin only)
router.post("/", auth("admin"), async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update scheme (admin only)
router.put("/:id", auth("admin"), async (req, res) => {
  try {
    const scheme = await Scheme.findByPk(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }
    await scheme.update(req.body);
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete scheme (admin only)
router.delete("/:id", auth("admin"), async (req, res) => {
  try {
    const scheme = await Scheme.findByPk(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }
    await scheme.destroy();
    res.json({ message: "Scheme deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync schemes from scraper
router.post("/sync", auth("admin"), async (req, res) => {
  try {
    const scrapeMyScheme = require("../scraper/myscheme.scraper");
    await scrapeMyScheme();
    res.json({ message: "Government schemes synced successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;