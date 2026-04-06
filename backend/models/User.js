const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
/*server.js imports User.js
User.js creates the User model
Sequelize uses it to create the Users table in DB*/
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  // For GDPR compliance, we can add a consent field to track user agreement to data policies
  consent: { type: DataTypes.BOOLEAN, defaultValue: false }, // GDPR
  
  // Profile-specific fields should be in UserProfile model, not here
});

module.exports = User;
