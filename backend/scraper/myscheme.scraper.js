const puppeteer = require("puppeteer");
const Scheme = require("../models/Scheme");

async function scrapeMyScheme() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // Go to search page
  await page.goto("https://www.myscheme.gov.in/search", { 
    waitUntil: "networkidle0",
    timeout: 60000 
  });
  
  await page.waitForSelector("a[href*='/schemes/']", { timeout: 60000 });

  // Scroll to load more schemes
  let previousHeight;
  for (let i = 0; i < 5; i++) {
    previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await new Promise(r => setTimeout(r, 3000));
    const newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight === previousHeight) break;
  }

  // Collect scheme URLs
  const schemeLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href*='/schemes/']")).map(a => a.href)
  );

  const uniqueLinks = [...new Set(schemeLinks)];
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Found ${uniqueLinks.length} unique schemes to scrape`);
  console.log('='.repeat(70) + '\n');

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < uniqueLinks.length; i++) {
    const link = uniqueLinks[i];
    
    try {
      console.log(`\n[${i + 1}/${uniqueLinks.length}] ${link}`);
      
      await page.goto(link, { 
        waitUntil: "networkidle0",
        timeout: 30000 
      });

      // Wait for content
      await page.waitForFunction(
        () => document.body.innerText.length > 500,
        { timeout: 10000 }
      );
      await new Promise(r => setTimeout(r, 3000));

      // Extract data with enhanced logic
      const data = await page.evaluate(() => {
        // ============ HELPER FUNCTIONS ============
        
        const isTagCloud = (line) => {
          if (!line || line.length < 10) return false;
          const capitals = (line.match(/[A-Z]/g) || []).length;
          const spaces = (line.match(/ /g) || []).length;
          return (capitals > 4 && spaces < 3);
        };
        
        const isUIElement = (line) => {
          const lower = line.toLowerCase();
          return lower.includes('check eligibility') ||
                 lower.includes('sign in') ||
                 lower.includes('apply now') ||
                 lower === 'share' ||
                 lower === 'back' ||
                 lower === 'details' ||
                 lower === 'benefits' ||
                 lower === 'eligibility' ||
                 lower === 'application process' ||
                 lower === 'documents required' ||
                 lower.includes('was this helpful') ||
                 lower.includes('exclusions') ||
                 lower.includes('news and updates') ||
                 lower.includes('frequently asked questions');
        };
        
        const isMeaningfulContent = (line) => {
          return line.length > 15 && 
                 !isTagCloud(line) && 
                 !isUIElement(line) &&
                 !line.startsWith('©') &&
                 !line.includes('Last Updated');
        };
        
        // ============ GET PAGE DATA ============
        
        const scheme_name = document.title.split('|')[0].trim();
        const bodyText = document.body.innerText;
        const lines = bodyText.split('\n')
          .map(l => l.trim())
          .filter(l => l.length > 0);
        
        // ============ EXTRACT MINISTRY ============
        
        let ministry = null;
        
        // Strategy 1: Look for "Ministry Of" or "Ministry of"
        for (const line of lines) {
          if ((line.startsWith('Ministry Of') || line.startsWith('Ministry of')) &&
              line.length < 100 && 
              !line.includes('Electronics')) { // Avoid footer ministry
            ministry = line;
            break;
          }
        }
        
        // Strategy 2: Look in meta tags or structured data
        if (!ministry) {
          const metaTags = document.querySelectorAll('meta[property*="ministry"], meta[name*="ministry"]');
          for (const meta of metaTags) {
            const content = meta.getAttribute('content');
            if (content && content.includes('Ministry')) {
              ministry = content;
              break;
            }
          }
        }
        
        // Strategy 3: Look near scheme name
        if (!ministry) {
          const schemeNameIdx = lines.findIndex(l => l === scheme_name);
          if (schemeNameIdx !== -1 && schemeNameIdx + 1 < lines.length) {
            const nextLine = lines[schemeNameIdx + 1];
            if (nextLine.includes('Ministry')) {
              ministry = nextLine;
            }
          }
        }
        
        // ============ FIND SECTION INDICES ============
        
        const findSectionIndex = (sectionName) => {
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase() === sectionName.toLowerCase() ||
                lines[i].toLowerCase().startsWith(sectionName.toLowerCase())) {
              return i;
            }
          }
          return -1;
        };
        
        const sections = {
          details: findSectionIndex('Details'),
          benefits: findSectionIndex('Benefits'),
          eligibility: findSectionIndex('Eligibility'),
          application: findSectionIndex('Application Process'),
          documents: findSectionIndex('Documents Required'),
          faq: findSectionIndex('Frequently Asked Questions')
        };
        
        // ============ EXTRACT CONTENT BETWEEN SECTIONS ============
        
        const extractSection = (startIdx, endIdx, maxLines = 30) => {
          if (startIdx === -1) return null;
          
          const actualEndIdx = endIdx !== -1 ? endIdx : lines.length;
          const sectionLines = lines
            .slice(startIdx + 1, Math.min(startIdx + maxLines + 1, actualEndIdx))
            .filter(l => isMeaningfulContent(l));
          
          return sectionLines.length > 0 ? sectionLines.join(' ') : null;
        };
        
        // ============ EXTRACT DESCRIPTION ============
        
        let description = extractSection(sections.details, sections.benefits, 15);
        
        // Fallback: Look for scheme description anywhere
        if (!description || description.length < 50) {
          // Find lines that describe the scheme
          const descriptionLines = lines.filter(l =>
            isMeaningfulContent(l) &&
            l.length > 50 &&
            l.length < 400 &&
            (l.toLowerCase().includes('scheme') ||
             l.toLowerCase().includes('assistance for') ||
             l.toLowerCase().includes('support') ||
             l.toLowerCase().includes('provides') ||
             l.toLowerCase().includes('aims to'))
          );
          
          if (descriptionLines.length > 0) {
            // Pick the first good description
            description = descriptionLines[0];
          }
        }
        
        // Last resort: Use scheme name as description
        if (!description || description === scheme_name) {
          description = `${scheme_name} scheme`;
        }
        
        // ============ EXTRACT BENEFITS ============
        
        let benefits = extractSection(sections.benefits, sections.eligibility, 20);
        
        // Fallback: Look for financial/benefit keywords
        if (!benefits || benefits.length < 20) {
          const benefitLines = lines.filter(l =>
            isMeaningfulContent(l) &&
            (l.includes('Rs.') || l.includes('₹') ||
             l.toLowerCase().includes('premium') ||
             l.toLowerCase().includes('financial assistance') ||
             l.toLowerCase().includes('scholarship') ||
             l.toLowerCase().includes('pension') ||
             l.toLowerCase().includes('coverage') ||
             l.toLowerCase().includes('amount of') ||
             l.toLowerCase().includes('will receive') ||
             l.toLowerCase().includes('entitled to') ||
             l.toLowerCase().includes('per month') ||
             l.toLowerCase().includes('per annum'))
          );
          
          benefits = benefitLines.slice(0, 8).join(' ');
        }
        
        // ============ EXTRACT ELIGIBILITY ============
        
        let eligibility = extractSection(sections.eligibility, sections.application, 20);
        
        // Fallback: Look for eligibility criteria
        if (!eligibility || eligibility.length < 20) {
          const eligibilityLines = lines.filter(l =>
            isMeaningfulContent(l) &&
            (l.toLowerCase().includes('applicant must') ||
             l.toLowerCase().includes('should be') ||
             l.toLowerCase().includes('age') ||
             l.toLowerCase().includes('category') ||
             l.toLowerCase().includes('citizen') ||
             l.toLowerCase().includes('resident') ||
             l.toLowerCase().includes('income') ||
             l.toLowerCase().includes('eligible') ||
             l.toLowerCase().includes('criteria')) &&
            !l.toLowerCase().includes('step') &&
            l.length > 20 &&
            l.length < 300
          );
          
          eligibility = eligibilityLines.slice(0, 8).join(' ');
        }
        
        // ============ EXTRACT APPLICATION PROCESS ============
        
        let application_process = extractSection(sections.application, sections.documents, 25);
        
        // Fallback: Look for application-related content
        if (!application_process || application_process.length < 30) {
          const appLines = lines.filter(l =>
            isMeaningfulContent(l) &&
            (l.toLowerCase().includes('apply') ||
             l.toLowerCase().includes('step') ||
             l.toLowerCase().includes('visit') ||
             l.toLowerCase().includes('register') ||
             l.toLowerCase().includes('submit') ||
             l.toLowerCase().includes('fill') ||
             l.toLowerCase().includes('online') ||
             l.toLowerCase().includes('portal') ||
             l.toLowerCase().includes('website') ||
             l.toLowerCase().includes('application form')) &&
            l.length > 20
          );
          
          application_process = appLines.slice(0, 10).join(' ');
        }
        
        // ============ EXTRACT DOCUMENTS REQUIRED ============
        
        let documents_required = extractSection(sections.documents, sections.faq, 30);
        
        // Fallback: Look for document keywords
        if (!documents_required || documents_required.length < 30) {
          const docLines = lines.filter(l =>
            isMeaningfulContent(l) &&
            (l.toLowerCase().includes('aadhaar') ||
             l.toLowerCase().includes('pan') ||
             l.toLowerCase().includes('passport') ||
             l.toLowerCase().includes('certificate') ||
             l.toLowerCase().includes('proof of') ||
             l.toLowerCase().includes('identity') ||
             l.toLowerCase().includes('bank account') ||
             l.toLowerCase().includes('document') ||
             l.toLowerCase().includes('copy of')) &&
            l.length > 15 &&
            l.length < 200
          );
          
          documents_required = docLines.slice(0, 10).join(' ');
        }
        
        // ============ DETERMINE SCHEME LEVEL ============
        
        let scheme_level = null;
        const lowerBody = bodyText.toLowerCase();
        const lowerName = scheme_name.toLowerCase();
        
        if (lowerName.includes('pradhan mantri') ||
            lowerName.includes('pm-') ||
            lowerName.includes('central sector') ||
            lowerBody.includes('central sector scheme') ||
            lowerBody.includes('ministry of')) {
          scheme_level = 'Central';
        } else if (lowerBody.includes('state scheme') ||
                   lowerBody.includes('state government')) {
          scheme_level = 'State';
        }
        
        // If ministry is present, it's likely Central
        if (!scheme_level && ministry && ministry.includes('Ministry')) {
          scheme_level = 'Central';
        }
        
        // ============ CLEAN FUNCTION ============
        
        const cleanText = (text) => {
          if (!text) return null;
          
          let cleaned = text
            .replace(/\s+/g, ' ')
            .trim();
          
          // Don't return if it's just the scheme name
          if (cleaned === scheme_name) return null;
          
          // Don't return if too short or is a tag cloud
          if (cleaned.length < 10 || isTagCloud(cleaned)) return null;
          
          return cleaned;
        };
        
        // ============ RETURN DATA ============
        
        return {
          scheme_name: cleanText(scheme_name) || scheme_name,
          ministry: cleanText(ministry),
          description: cleanText(description),
          benefits: cleanText(benefits),
          eligibility: cleanText(eligibility),
          application_process: cleanText(application_process),
          documents_required: cleanText(documents_required),
          scheme_level: scheme_level,
          scheme_url: window.location.href
        };
      });

      // Validate
      if (!data.scheme_name || data.scheme_name.length < 3) {
        console.log(`⚠️  SKIPPED: No valid name`);
        failCount++;
        continue;
      }

      // Log extracted data
      console.log(`✅ ${data.scheme_name}`);
      console.log(`   Ministry: ${data.ministry || '❌ NOT FOUND'}`);
      console.log(`   Description: ${data.description ? '✅ ' + data.description.substring(0, 80) + '...' : '❌ NOT FOUND'}`);
      console.log(`   Benefits: ${data.benefits ? '✅ ' + data.benefits.substring(0, 80) + '...' : '❌ NOT FOUND'}`);
      console.log(`   Eligibility: ${data.eligibility ? '✅ ' + data.eligibility.substring(0, 80) + '...' : '❌ NOT FOUND'}`);
      console.log(`   Application: ${data.application_process ? '✅ ' + data.application_process.substring(0, 60) + '...' : '❌ NOT FOUND'}`);
      console.log(`   Documents: ${data.documents_required ? '✅ ' + data.documents_required.substring(0, 60) + '...' : '❌ NOT FOUND'}`);
      console.log(`   Level: ${data.scheme_level || '❌ NOT FOUND'}`);

      // Save to database with duplicate check
      try {
        // Check if scheme already exists (by name or URL)
        const existingScheme = await Scheme.findOne({
          where: {
            [require('sequelize').Op.or]: [
              { scheme_name: data.scheme_name },
              { scheme_url: data.scheme_url }
            ]
          }
        });

        if (existingScheme) {
          console.log(`   ⏭️  SKIPPED: Scheme already exists in database (ID: ${existingScheme.id})`);
          skippedCount++;
        } else {
          await Scheme.create({ 
            ...data, 
            source: "myscheme.gov.in",
            scraped_at: new Date()
          });
          console.log(`   💾 Saved to database`);
          successCount++;
        }
      } catch (dbErr) {
        console.log(`   ❌ DB Error: ${dbErr.message}`);
        failCount++;
      }

    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      failCount++;
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();
  
  console.log("\n" + "=".repeat(70));
  console.log("🎉 SCRAPING COMPLETED");
  console.log("=".repeat(70));
  console.log(`✅ Success: ${successCount} | ⏭️  Skipped: ${skippedCount} | ❌ Failed: ${failCount} | 📊 Total: ${uniqueLinks.length}`);
  console.log(`📈 Success rate: ${(((successCount + skippedCount)/uniqueLinks.length)*100).toFixed(1)}%`);
  console.log("=".repeat(70) + '\n');
  
  return { successCount, skippedCount, failCount, total: uniqueLinks.length };
}

module.exports = scrapeMyScheme;