require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
  override: true
});

const AISchemeParser = require('../utils/aiSchemeParser');
const sequelize = require('../config/db'); // Adjust path as needed

/**
 * Main script to parse all schemes using Groq AI
 */
async function main() {
  try {
    console.log('🚀 Starting AI-powered scheme parsing...\n');

    // Initialize parser with Groq API key
    const parser = new AISchemeParser(process.env.GROQ_API_KEY);

    // Sync database (create tables if they don't exist)
    console.log('Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('✓ Database synced\n');

    // Parse all schemes
    console.log('Starting scheme parsing with AI...');
    const results = await parser.parseAllSchemes({
      batchSize: 3,    // Process 3 schemes at a time
      delayMs: 2000    // 2 second delay between batches
    });

    console.log('\n' + '='.repeat(60));
    console.log('FINAL RESULTS');
    console.log('='.repeat(60));
    console.log(`Total schemes processed: ${results.total}`);
    console.log(`Successfully parsed: ${results.success} (${((results.success/results.total)*100).toFixed(1)}%)`);
    console.log(`Failed: ${results.failed}`);

    // Validate data quality
    console.log('\n📊 Validating parsed data quality...');
    const validation = await parser.validateParsedData();
    
    console.log('\n' + '='.repeat(60));
    console.log('DATA QUALITY REPORT');
    console.log('='.repeat(60));
    console.log(`Total schemes with eligibility data: ${validation.total}`);
    console.log(`Schemes with age criteria: ${validation.withAge} (${((validation.withAge/validation.total)*100).toFixed(1)}%)`);
    console.log(`Schemes with income criteria: ${validation.withIncome} (${((validation.withIncome/validation.total)*100).toFixed(1)}%)`);
    console.log(`Schemes with gender criteria: ${validation.withGender} (${((validation.withGender/validation.total)*100).toFixed(1)}%)`);
    console.log(`Schemes with special groups: ${validation.withSpecialGroups} (${((validation.withSpecialGroups/validation.total)*100).toFixed(1)}%)`);
    console.log(`Schemes with education criteria: ${validation.withEducation} (${((validation.withEducation/validation.total)*100).toFixed(1)}%)`);
    
    if (validation.incomplete.length > 0) {
      console.log(`\n⚠️  Schemes with no parsed criteria: ${validation.incomplete.length}`);
      validation.incomplete.slice(0, 5).forEach(s => {
        console.log(`  - ${s.schemeName}`);
      });
      if (validation.incomplete.length > 5) {
        console.log(`  ... and ${validation.incomplete.length - 5} more`);
      }
    }

    console.log('\n✅ Scheme parsing completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error during scheme parsing:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = main;