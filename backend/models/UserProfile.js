// UserProfile.js defines the UserProfile model with fields for user demographics,
//  social categories, risk factors, and profile management. It establishes a one-to-one relationship with the User model 
// using userId as a foreign key. This model is used to store detailed information about each user's profile in the database.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserProfile = sequelize.define("UserProfile", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  income: { type: DataTypes.INTEGER },
  occupation: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },

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
}, {
  tableName: 'UserProfiles',
  timestamps: true
});

module.exports = UserProfile;