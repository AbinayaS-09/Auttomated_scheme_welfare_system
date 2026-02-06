const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Scheme = sequelize.define(
  "Scheme",
  {
    scheme_name: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    ministry: { 
      type: DataTypes.TEXT 
    },
    description: { 
      type: DataTypes.TEXT("long"),
      comment: "Main description/overview of the scheme"
    },
    eligibility: { 
      type: DataTypes.TEXT("long"),
      comment: "Who can apply for this scheme"
    },
    benefits: { 
      type: DataTypes.TEXT("long"),
      comment: "What benefits the scheme provides"
    },
    application_process: { 
      type: DataTypes.TEXT("long"),
      comment: "How to apply for the scheme"
    },
    documents_required: { 
      type: DataTypes.TEXT("long"),
      comment: "Documents needed to apply"
    },
    scheme_level: { 
      type: DataTypes.STRING(50),
      comment: "Central, State, or District level"
    },
    scheme_url: {
      type: DataTypes.TEXT,
      comment: "Source URL of the scheme"
    },
    source: { 
      type: DataTypes.STRING,
      defaultValue: "myscheme.gov.in"
    },
    scraped_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "schemes",
    freezeTableName: true,
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = Scheme;