
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const { Op } = require("sequelize");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let profile = await UserProfile.findOne({ where: { userId } });
    
    if (!profile) {

      profile = await UserProfile.create({ userId });
    }
    
    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      age,
      gender,
      income,
      occupation,
      state,
      district,
      category,
      disability,
      farmer,
      student,
      widow,
      seniorCitizen
    } = req.body;

    // Validation
    /*Checks if age is valid

Prevents:
age = -5
age = 0
age = 500*/
    if (age !== undefined && (age <= 0 || age > 120)) {
      return res.status(400).json({ error: "Invalid age. Age must be greater than 0." });
    }
    // Checks if income is valid
    if (income && income < 0) {
      return res.status(400).json({ error: "Income cannot be negative" });
    }
// Checks if state and district are valid (basic check for non-empty strings)
    if (state && district) {
      // Both state and district are provided and non-empty
    } else {
      return res.status(400).json({ error: "State and district are required" });
    }
    // Fetch or create profile
    let profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }

    // Duplicate profile detection
    /*“This logic checks whether another profile already exists with similar identity 
    details, which helps in duplicate profile detection.”*/
    if (name && age && state && district) {
      const duplicate = await UserProfile.findOne({
        where: {
          userId: { [Op.ne]: userId },
          name,
          age,
          state,
          district
        }
      });

      if (duplicate) {
        profile.duplicateProfile = true;
        await profile.save();
        return res.status(400).json({
          error: "Duplicate profile detected"
        });
      }
    }

    // Update fields
    await profile.update({
      name: name || profile.name,
      age: age || profile.age,
      gender: gender || profile.gender,
      income: income || profile.income,
      occupation: occupation || profile.occupation,
      state: state || profile.state,
      district: district || profile.district,
      category: category || profile.category,
      disability: disability !== undefined ? disability : profile.disability,
      farmer: farmer !== undefined ? farmer : profile.farmer,
      student: student !== undefined ? student : profile.student,
      widow: widow !== undefined ? widow : profile.widow,
      seniorCitizen: seniorCitizen !== undefined ? seniorCitizen : profile.seniorCitizen,
      lastProfileUpdate: new Date()
    });

    // Check profile completeness
    const required = [name, age, gender, income, occupation, state, district, category];
    profile.profileComplete = required.every(f => f);
    await profile.save();

    // Suspicious activity check
    if (profile.duplicateProfile || profile.identityMismatch || profile.applicationCount > 3) {
      profile.suspiciousActivity = true;
      await profile.save();
    }

    res.json({
      message: "Profile updated successfully",
      profile
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

// AUTO SAVE
exports.autoSave = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }

    await profile.update({
      ...req.body,
      lastProfileUpdate: new Date()
    });

    res.json({ message: "Auto-saved", profile });
  } catch (err) {
    console.error('Auto-save error:', err);
    res.status(500).json({ error: "Auto-save failed" });
  }
};

// INCREMENT APPLICATION-“This increments the number of applications submitted by the user.”
exports.incrementApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }

    profile.applicationCount += 1;

    if (profile.applicationCount > 3) {
      profile.suspiciousActivity = true;
    }

    await profile.save();

    res.json({ 
      message: "Application recorded",
      count: profile.applicationCount
    });
  } catch (err) {
    console.error('Increment application error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

// ADMIN - GET SUSPICIOUS
exports.getSuspiciousProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.findAll({
      where: { suspiciousActivity: true }
    });

    res.json(profiles);
  } catch (err) {
    console.error('Get suspicious profiles error:', err);
    res.status(500).json({ error: "Error loading suspicious users" });
  }
};

// ADMIN - REVIEW
exports.reviewProfile = async (req, res) => {
  try {
    const { userId, action } = req.body;

    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    if (action === "approve") {
      profile.suspiciousActivity = false;
      profile.identityMismatch = false;
      profile.duplicateProfile = false;
      profile.applicationCount = 0;
      await profile.save();

      return res.json({ message: "Profile approved" });
    }

    if (action === "reject") {
      return res.json({ message: "Profile marked for review" });
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error('Review profile error:', err);
    res.status(500).json({ error: "Review failed" });
  }
};