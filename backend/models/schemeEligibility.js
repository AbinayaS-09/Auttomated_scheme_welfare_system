const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SchemeEligibility = sequelize.define(
  "SchemeEligibility",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    schemeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schemes',
        key: 'id'
      },
      comment: "Foreign key to schemes table"
    },
    schemeName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    
    // Age Criteria
    minAge: {
      type: DataTypes.INTEGER,
      comment: "Minimum age requirement"
    },
    maxAge: {
      type: DataTypes.INTEGER,
      comment: "Maximum age requirement"
    },
    
    // Income Criteria
    minIncome: {
      type: DataTypes.INTEGER,
      comment: "Minimum income requirement (if any)"
    },
    maxIncome: {
      type: DataTypes.INTEGER,
      comment: "Maximum income limit"
    },
    
    // Gender Criteria
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other', 'All'),
      defaultValue: 'All',
      comment: "Specific gender requirement"
    },
    
    // Category Criteria (SC/ST/OBC/General)
    eligibleCategories: {
      type: DataTypes.JSON,
      comment: "Array of eligible categories e.g., ['SC', 'ST', 'OBC', 'General']"
    },
    
    // Special Group Criteria (Boolean flags)
    requiresDisability: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Scheme specifically for persons with disabilities"
    },
    disabilityPercentageMin: {
      type: DataTypes.INTEGER,
      comment: "Minimum disability percentage required"
    },
    requiresFarmer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Scheme specifically for farmers"
    },
    requiresStudent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Scheme specifically for students"
    },
    requiresWidow: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Scheme specifically for widows"
    },
    requiresSeniorCitizen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Scheme specifically for senior citizens"
    },
    
    // Education Criteria
    minEducation: {
      type: DataTypes.STRING,
      comment: "Minimum education qualification (e.g., '10th', '12th', 'Graduate', 'Post-Graduate', 'PhD')"
    },
    specificDegrees: {
      type: DataTypes.JSON,
      comment: "Array of specific degrees required e.g., ['M.Sc', 'M.Tech', 'PhD']"
    },
    
    // Occupation/Employment Criteria
    eligibleOccupations: {
      type: DataTypes.JSON,
      comment: "Array of eligible occupations"
    },
    employmentStatus: {
      type: DataTypes.ENUM('Employed', 'Unemployed', 'Self-Employed', 'Any'),
      defaultValue: 'Any',
      comment: "Required employment status"
    },
    
    // Geographic Criteria
    schemeLevel: {
      type: DataTypes.ENUM('Central', 'State', 'District'),
      comment: "Level at which scheme operates"
    },
    eligibleStates: {
      type: DataTypes.JSON,
      comment: "Array of eligible states (for state-level schemes)"
    },
    eligibleDistricts: {
      type: DataTypes.JSON,
      comment: "Array of eligible districts (for district-level schemes)"
    },
    
    // Ex-Servicemen Criteria
    requiresExServicemen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Scheme for ex-servicemen or their widows"
    },
    maxRank: {
      type: DataTypes.STRING,
      comment: "Maximum rank eligible (for defense schemes)"
    },
    pensionerStatus: {
      type: DataTypes.ENUM('Pensioner', 'Non-Pensioner', 'Any'),
      defaultValue: 'Any',
      comment: "Pensioner requirement for defense schemes"
    },
    
    // Citizenship & Residency
    requiresIndianCitizen: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Indian citizenship required"
    },
    
    // Study/Course Specific (for education schemes)
    admissionRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Admission to course required"
    },
    courseLevel: {
      type: DataTypes.JSON,
      comment: "Array of course levels e.g., ['Masters', 'PhD']"
    },
    studyLocation: {
      type: DataTypes.ENUM('India', 'Abroad', 'Both'),
      comment: "Where studies should be pursued"
    },
    
    // Exclusion Criteria
    excludesPreviousRecipients: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Previous recipients not eligible"
    },
    excludesPermanentEmployees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Permanent employees not eligible"
    },
    maxFamilyMembers: {
      type: DataTypes.INTEGER,
      comment: "Maximum family members who can receive benefit"
    },
    
    // Additional Criteria
    requiresCareerBreak: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Career break required (for women scientist schemes)"
    },
    specialConditions: {
      type: DataTypes.TEXT,
      comment: "Any other special conditions in plain text"
    },
    
    // Fuzzy Matching Scores (for ML/Fuzzy Logic)
    weightAge: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
      comment: "Weight for age criteria in fuzzy matching"
    },
    weightIncome: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
      comment: "Weight for income criteria in fuzzy matching"
    },
    weightCategory: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
      comment: "Weight for category criteria in fuzzy matching"
    },
    weightSpecialGroup: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
      comment: "Weight for special group criteria in fuzzy matching"
    },
    
    // Metadata
    rawEligibilityText: {
      type: DataTypes.TEXT('long'),
      comment: "Original eligibility text from scheme"
    },
    parsedSuccessfully: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Whether eligibility was successfully parsed"
    },
    lastParsed: {
      type: DataTypes.DATE,
      comment: "When eligibility was last parsed/updated"
    }
  },
  {
    tableName: "scheme_eligibility",
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        fields: ['schemeId']
      },
      {
        fields: ['gender']
      },
      {
        fields: ['schemeLevel']
      },
      {
        fields: ['requiresDisability']
      },
      {
        fields: ['requiresStudent']
      }
    ]
  }
);

module.exports = SchemeEligibility;