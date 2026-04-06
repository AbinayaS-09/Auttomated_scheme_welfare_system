
/*dotenv → package used to read .env file
.config() → loads variables like PORT, DB_NAME, etc.
{ override: true } → if variables already exist, replace them
🎯 Why used:
To store sensitive data (DB password, API keys) securely
*/
require("dotenv").config({ override: true });
/*express → backend framework-build api, handle routes, middleware, etc.
cors → allows frontend to access backend (Cross-Origin)*/
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
/*It acts as a bridge that allows you to interact with relational databases using 
JavaScript objects and methods instead of writing raw SQL queries.*/

// Import models and routes
const schemeRoutes = require("./routes/scheme.routes");
const User = require("./models/User");
const UserProfile = require("./models/UserProfile");


// Setup relationships
/*User hasOne UserProfile → Each user has one profile
foreignKey: "userId" → UserProfile will have a userId column as a foreign key*/
User.hasOne(UserProfile, { foreignKey: "userId", onDelete: "CASCADE" });
UserProfile.belongsTo(User, { foreignKey: "userId" });
// Import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(cors());
app.use(express.json());
// Define routes

/*/api/auth → login/register
/api/profile → user profile
/api/schemes → schemes data
/api/chat → chatbot*/
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
//
app.use("/api/schemes", schemeRoutes);
app.use("/api/chat", require("./routes/chatRoutes"));

// app.use("/api/ngo-scraper",ngoRoutes);


// Sync database
sequelize.sync().then(() => {
  console.log("✅ Database synced successfully");
  
  app.listen(process.env.PORT || 5000, () => {
    console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error("❌ Database sync failed:", err);
});