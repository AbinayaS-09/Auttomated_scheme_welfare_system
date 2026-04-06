const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
// UserProfile.js defines the UserProfile model with fields for user demographics,
const UserProfile = sequelize.define("UserProfile", {
  name: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  income: { type: DataTypes.INTEGER },
  occupation: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING }, // SC/ST/OBC/General

  disability: { type: DataTypes.BOOLEAN, defaultValue: false },
  farmer: { type: DataTypes.BOOLEAN, defaultValue: false },
  student: { type: DataTypes.BOOLEAN, defaultValue: false },
  widow: { type: DataTypes.BOOLEAN, defaultValue: false },
  seniorCitizen: { type: DataTypes.BOOLEAN, defaultValue: false },

  duplicateProfile: { type: DataTypes.BOOLEAN, defaultValue: false },
  identityMismatch: { type: DataTypes.BOOLEAN, defaultValue: false },
  suspiciousActivity: { type: DataTypes.BOOLEAN, defaultValue: false },

  applicationCount: { type: DataTypes.INTEGER, defaultValue: 0 },

  profileComplete: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastProfileUpdate: { type: DataTypes.DATE }
});

// Relation
User.hasOne(UserProfile, { foreignKey: "userId" });
UserProfile.belongsTo(User, { foreignKey: "userId" });

module.exports = UserProfile;
