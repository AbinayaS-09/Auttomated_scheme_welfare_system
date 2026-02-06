const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  consent: { type: DataTypes.BOOLEAN, defaultValue: false }, // GDPR
  
  // Profile & Eligibility Fields
  age: { type: DataTypes.INTEGER, allowNull: true },
  gender: { type: DataTypes.ENUM("male", "female", "other"), allowNull: true },
  income: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  occupation: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  district: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.ENUM("SC", "ST", "OBC", "General"), allowNull: true },
  disability: { type: DataTypes.BOOLEAN, defaultValue: false },
  farmer: { type: DataTypes.BOOLEAN, defaultValue: false },
  student: { type: DataTypes.BOOLEAN, defaultValue: false },
  widow: { type: DataTypes.BOOLEAN, defaultValue: false },
  seniorCitizen: { type: DataTypes.BOOLEAN, defaultValue: false },
  
  // Security & Monitoring Fields
  suspiciousActivity: { type: DataTypes.BOOLEAN, defaultValue: false },
  duplicateProfile: { type: DataTypes.BOOLEAN, defaultValue: false },
  identityMismatch: { type: DataTypes.BOOLEAN, defaultValue: false },
  applicationCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastProfileUpdate: { type: DataTypes.DATE, allowNull: true },
  profileComplete: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
