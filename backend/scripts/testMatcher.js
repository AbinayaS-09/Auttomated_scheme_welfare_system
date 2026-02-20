require('dotenv').config();
const FuzzyEligibilityMatcher = require('../utils/fuzzyEligibilityMatcher');
const UserProfile = require('../models/UserProfil');
const sequelize = require('../config/db');

/**
 * Find matching schemes for a user
 */
async function findSchemesForUser(userId) {
  try {
    console.log(`\n🔍 Finding matching schemes for user ${userId}...\n`);

    const results = await FuzzyEligibilityMatcher.findMatchingSchemes(userId, 50);

    console.log('='.repeat(70));
    console.log(`USER: ${results.userName} (ID: ${results.userId})`);
    console.log('='.repeat(70));
    console.log(`Total schemes in database: ${results.totalSchemes}`);
    console.log(`Matching schemes (≥50% match): ${results.matchingSchemes}`);
    console.log('='.repeat(70));

    if (results.schemes.length === 0) {
      console.log('\n❌ No matching schemes found for this user.');
      return;
    }

    console.log('\n📋 TOP MATCHING SCHEMES:\n');

    results.schemes.slice(0, 10).forEach((scheme, index) => {
      console.log(`${index + 1}. ${scheme.schemeName}`);
      console.log(
        `   Match Score: ${scheme.matchScore.toFixed(2)}% ${
          scheme.eligible ? '✅ ELIGIBLE' : '⚠️  PARTIAL'
        }`
      );
      console.log(`   Level: ${scheme.schemeLevel}`);

      const details = scheme.matchDetails;

      const matchedCriteria = [];
      const unmatchedCriteria = [];

      Object.entries(details).forEach(([criterion, data]) => {
        if (data.weight > 0) {
          if (data.score > 0) {
            matchedCriteria.push(
              `${capitalize(criterion)}: ${(data.score * 100).toFixed(0)}%`
            );
          } else {
            unmatchedCriteria.push(capitalize(criterion));
          }
        }
      });

      if (matchedCriteria.length > 0) {
        console.log(`   ✅ Criteria Match: ${matchedCriteria.join(', ')}`);
      }

      if (unmatchedCriteria.length > 0) {
        console.log(`   ❌ Criteria Not Met: ${unmatchedCriteria.join(', ')}`);
      }

      console.log('');
    });

    return results;
  } catch (error) {
    console.error('❌ Error finding schemes:', error.message);
    throw error;
  }
}

/**
 * Check eligibility for a specific scheme
 */
async function checkSpecificScheme(userId, schemeId) {
  try {
    console.log(`\n🎯 Checking eligibility for scheme ${schemeId}...\n`);

    const result = await FuzzyEligibilityMatcher.checkSchemeEligibility(userId, schemeId);

    console.log('='.repeat(70));
    console.log(`SCHEME: ${result.schemeName}`);
    console.log('='.repeat(70));
    console.log(`User: ${result.userName} (ID: ${result.userId})`);
    console.log(`Match Score: ${result.score.toFixed(2)}%`);
    console.log(
      `Eligibility Status: ${result.eligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}`
    );
    console.log('='.repeat(70));

    console.log('\n📊 DETAILED BREAKDOWN:\n');

    const details = result.details;

    Object.entries(details).forEach(([criterion, data]) => {
      if (data.weight > 0) {
        const percentage = (data.score * 100).toFixed(0);
        const icon =
          data.score === 1
            ? '✅'
            : data.score > 0
            ? '⚠️'
            : '❌';

        console.log(`${icon} ${criterion.toUpperCase()}: ${percentage}% (${data.status})`);
        console.log(`   Weight: ${data.weight.toFixed(1)}\n`);
      }
    });

    return result;
  } catch (error) {
    console.error('❌ Error checking eligibility:', error.message);
    throw error;
  }
}

/**
 * Test with a sample user
 */
async function testWithSampleUser() {
  try {
    const sampleProfile = {
      userId: 99999,
      name: 'Test User - Student with Disability',
      age: 28,
      gender: 'Female',
      income: 500000,
      occupation: 'Student',
      state: 'Maharashtra',
      district: 'Mumbai',
      category: 'General',
      disability: true,
      student: true,
      farmer: false,
      widow: false,
      seniorCitizen: false,
      profileComplete: true,
      lastProfileUpdate: new Date()
    };

    console.log('\n👤 Creating sample user profile...');
    console.log(JSON.stringify(sampleProfile, null, 2));

    let user = await UserProfile.findOne({ where: { userId: sampleProfile.userId } });

    if (user) {
      await user.update(sampleProfile);
      console.log('✓ Updated existing user profile');
    } else {
      await UserProfile.create(sampleProfile);
      console.log('✓ Created new user profile');
    }

    await findSchemesForUser(sampleProfile.userId);
  } catch (error) {
    console.error('❌ Error in test:', error.message);
    throw error;
  }
}

/**
 * Utility
 */
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Main
 */
async function main() {
  try {
    console.log('🚀 Starting Fuzzy Eligibility Matching Demo...\n');
    await sequelize.sync();
    console.log('✓ Database connected\n');

    const args = process.argv.slice(2);

    if (args.length === 0) {
      await testWithSampleUser();
    } else if (args[0] === 'find' && args[1]) {
      await findSchemesForUser(parseInt(args[1]));
    } else if (args[0] === 'check' && args[1] && args[2]) {
      await checkSpecificScheme(parseInt(args[1]), parseInt(args[2]));
    } else {
      console.log('Usage:');
      console.log(' node testMatcher.js');
      console.log(' node testMatcher.js find <userId>');
      console.log(' node testMatcher.js check <userId> <schemeId>');
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { findSchemesForUser, checkSpecificScheme, testWithSampleUser };


