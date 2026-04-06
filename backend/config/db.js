const { Sequelize } = require("sequelize");
// Load environment variables
require("dotenv").config();
// Create Sequelize instance with MySQL connection details from .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  // Connection options

  {
    host: process.env.DB_HOST,// Database host (e.g., localhost)
    dialect: "mysql",// Database type
    port: process.env.DB_PORT,// Database port (e.g., 3306)
    logging: false,// Disable SQL query logging for cleaner output
  }
);

module.exports = sequelize;// Export the Sequelize instance for use in other parts of the application
