// const SchemeEligibility = require('../models/schemeEligibility');
// const UserProfile = require('../models/userProfil');
// const { Op } = require('sequelize');

// class FuzzyEligibilityMatcher {
  
//   /**
//    * Calculate fuzzy match score between user profile and scheme eligibility
//    * Returns score between 0-100
//    */
//   static calculateMatchScore(userProfile, schemeEligibility) {
//     let totalWeight = 0;
//     let achievedScore = 0;
//     const details = {
//       age: { score: 0, weight: 0, status: 'N/A' },
//       income: { score: 0, weight: 0, status: 'N/A' },
//       gender: { score: 0, weight: 0, status: 'N/A' },
//       category: { score: 0, weight: 0, status: 'N/A' },
//       disability: { score: 0, weight: 0, status: 'N/A' },
//       specialGroup: { score: 0, weight: 0, status: 'N/A' },
//       location: { score: 0, weight: 0, status: 'N/A' }
//     };

//     // --- HARD RULES (Disqualifiers) ---
//     // 0. Hard Checking: Gender, Disability, Ex-Servicemen, Student, etc.
    
//     // Gender Mismatch
//     if (schemeEligibility.gender && schemeEligibility.gender !== 'All') {
//         if (userProfile.gender !== schemeEligibility.gender) {
//             return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Gender mismatch" };
//         }
//     }

//     // Disability Requirement
//     if (schemeEligibility.requiresDisability && !userProfile.disability) {
//         return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Disability required" };
//     }

//     // Ex-Servicemen Requirement
//     if (schemeEligibility.requiresExServicemen && !userProfile.exServiceman) { // Assuming exServiceman field exists or is derived
//         return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Ex-Servicemen required" }; 
//     }
//     // --- STRICT SPECIAL GROUP FILTERS ---

// if (schemeEligibility.requiresStudent && !userProfile.student) {
//     return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Student required" };
// }

// if (schemeEligibility.requiresFarmer && !userProfile.farmer) {
//     return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Farmer required" };
// }

// if (schemeEligibility.requiresWidow && !userProfile.widow) {
//     return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Widow required" };
// }

// if (schemeEligibility.requiresSeniorCitizen && !userProfile.seniorCitizen) {
//     return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Senior Citizen required" };
// }


// // --- OCCUPATION FILTER ---
// if (Array.isArray(schemeEligibility.eligibleOccupations) &&
//     schemeEligibility.eligibleOccupations.length > 0) {

//     if (!userProfile.occupation ||
//         !schemeEligibility.eligibleOccupations.includes(userProfile.occupation)) {

//         return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Occupation not eligible" };
//     }
// }


// // --- CATEGORY STRICT FILTER ---
// if (Array.isArray(schemeEligibility.eligibleCategories) &&
//     schemeEligibility.eligibleCategories.length > 0) {

//     if (!schemeEligibility.eligibleCategories.includes(userProfile.category)) {

//         return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Category not eligible" };
//     }
// }


// // --- LOCATION STRICT FILTER ---
// if (Array.isArray(schemeEligibility.eligibleStates) &&
//     schemeEligibility.eligibleStates.length > 0) {

//     if (!schemeEligibility.eligibleStates.includes(userProfile.state)) {

//         return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "State not eligible" };
//     }
// }

// if (Array.isArray(schemeEligibility.eligibleDistricts) &&
//     schemeEligibility.eligibleDistricts.length > 0) {

//     if (!schemeEligibility.eligibleDistricts.includes(userProfile.district)) {

//         return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "District not eligible" };
//     }
// }
//     // Student Requirement (If strictly required)
//     if (schemeEligibility.requiresStudent && !userProfile.student) {
//          // Some logic might be fuzzy here, but if strict:
//          // return { score: 0, ... };
//     }

//     // 1. Age Matching (Weight: 1.0)
//     if (schemeEligibility.minAge !== null || schemeEligibility.maxAge !== null) {
//       const weight = schemeEligibility.weightAge || 1.0;
//       totalWeight += weight;
      
//       if (userProfile.age) {
//         const minAge = schemeEligibility.minAge || 0;
//         const maxAge = schemeEligibility.maxAge || 120;
        
//         if (userProfile.age >= minAge && userProfile.age <= maxAge) {
//           achievedScore += weight;
//           details.age = { score: 1.0, weight, status: 'Match', reason: `Age ${userProfile.age} is within ${minAge}-${maxAge}` };
//         } else {
//           // Partial score for being close to range
//           const distance = Math.min(
//             Math.abs(userProfile.age - minAge),
//             Math.abs(userProfile.age - maxAge)
//           );
//           const partialScore = Math.max(0, 1 - (distance / 10)); // 10 year tolerance
//           achievedScore += weight * partialScore;
//           if (partialScore > 0) {
//              details.age = { score: partialScore, weight, status: 'Partial', reason: `Age ${userProfile.age} is close to required ${minAge}-${maxAge}` };
//           } else {
//              // Hard fail if outside tolerance
//              return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: `Age ${userProfile.age} is outside ${minAge}-${maxAge}` };
//           }
//         }
//       }
//       details.age.weight = weight;
//     }

//     // 2. Income Matching (Weight: 1.0)
//     if (schemeEligibility.maxIncome !== null || schemeEligibility.minIncome !== null) {
//       const weight = schemeEligibility.weightIncome || 1.0;
//       totalWeight += weight;
      
//       if (userProfile.income) {
//         const minIncome = schemeEligibility.minIncome || 0;
//         const maxIncome = schemeEligibility.maxIncome || Infinity;
//         const tolerance = maxIncome * 0.1; // 10% tolerance
        
//         if (userProfile.income >= minIncome && userProfile.income <= maxIncome) {
//           achievedScore += weight;
//           details.income = { score: 1.0, weight, status: 'Match', reason: `Income meets criteria` };
//         } else if (userProfile.income <= maxIncome + tolerance) {
//            // Within 10% tolerance
//            const partial = 0.5;
//            achievedScore += weight * partial;
//            details.income = { score: partial, weight, status: 'Near Match', reason: `Income within 10% tolerance` };
//         } else {
//            // Hard fail if income exceeds limit + tolerance
//            return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: `Income ${userProfile.income} exceeds limit ${maxIncome}` };
//         }
//       }
//       details.income.weight = weight;
//     }

//     // 3. Gender Matching
//     if (schemeEligibility.gender && schemeEligibility.gender !== 'All') {
//       const weight = 1.0;
//       totalWeight += weight;
//       achievedScore += weight;
//       details.gender = { score: 1.0, weight, status: 'Match', reason: `Gender ${userProfile.gender} matches` };
//     }

//     // 4. Category Matching (Weight: 1.0)
//     if (schemeEligibility.eligibleCategories && Array.isArray(schemeEligibility.eligibleCategories)) {
//       const weight = schemeEligibility.weightCategory || 1.0;
//       totalWeight += weight;
      
//       if (userProfile.category && schemeEligibility.eligibleCategories.includes(userProfile.category)) {
//         achievedScore += weight;
//         details.category = { score: 1.0, weight, status: 'Match', reason: `Category ${userProfile.category} matches` };
//       } else {
//         details.category = { score: 0, weight, status: 'No Match', reason: `Category ${userProfile.category} not in list` };
//       }
//       details.category.weight = weight;
//     }

//     // 5. Disability Matching
//     if (schemeEligibility.requiresDisability) {
//       const weight = 1.5;
//       totalWeight += weight;
//       achievedScore += weight;
//       details.disability = { score: 1.0, weight, status: 'Match', reason: 'Disability requirement met' };
//     }

//     // 6. Special Group Matching (Weight: 1.0)
//     const specialGroupWeight = schemeEligibility.weightSpecialGroup || 1.0;
//     let specialGroupChecks = 0;
//     let specialGroupMatches = 0;
//     let matchedGroups = [];
//     let missingGroups = [];

//     if (schemeEligibility.requiresFarmer) {
//       specialGroupChecks++;
//       if (userProfile.farmer) { specialGroupMatches++; matchedGroups.push('Farmer'); } else { missingGroups.push('Farmer'); }
//     }
//     if (schemeEligibility.requiresStudent) {
//       specialGroupChecks++;
//       if (userProfile.student) { specialGroupMatches++; matchedGroups.push('Student'); } else { missingGroups.push('Student'); }
//     }
//     if (schemeEligibility.requiresWidow) {
//       specialGroupChecks++;
//       if (userProfile.widow) { specialGroupMatches++; matchedGroups.push('Widow'); } else { missingGroups.push('Widow'); }
//     }
//     if (schemeEligibility.requiresSeniorCitizen) {
//       specialGroupChecks++;
//       if (userProfile.seniorCitizen) { specialGroupMatches++; matchedGroups.push('Senior Citizen'); } else { missingGroups.push('Senior Citizen'); }
//     }

//     if (specialGroupChecks > 0) {
//       totalWeight += specialGroupWeight;
//       const specialScore = specialGroupMatches / specialGroupChecks;
//       achievedScore += specialGroupWeight * specialScore;
      
//       const statusText = specialScore === 1 ? 'Match' : (specialScore > 0 ? 'Partial' : 'No Match');
//       const reasonText = specialScore === 1 ? 'All special groups match' : `Matched: ${matchedGroups.join(', ') || 'None'}; Missing: ${missingGroups.join(', ')}`;
      
//       details.specialGroup = { 
//         score: specialScore, 
//         weight: specialGroupWeight, 
//         status: statusText,
//         reason: reasonText
//       };
//     }

//     // 7. Location Matching (Weight: 0.8)
//     if (
//         (Array.isArray(schemeEligibility.eligibleStates) && schemeEligibility.eligibleStates.length > 0) ||
//         (Array.isArray(schemeEligibility.eligibleDistricts) && schemeEligibility.eligibleDistricts.length > 0)
//     ) {
//       const weight = 0.8;
//       totalWeight += weight;
//       let locationMatch = false;

//       if (Array.isArray(schemeEligibility.eligibleStates) && schemeEligibility.eligibleStates.length > 0) {
//         if (userProfile.state && schemeEligibility.eligibleStates.includes(userProfile.state)) {
//           locationMatch = true;
//         }
//       }

//       if (Array.isArray(schemeEligibility.eligibleDistricts) && schemeEligibility.eligibleDistricts.length > 0) {
//         if (userProfile.district && schemeEligibility.eligibleDistricts.includes(userProfile.district)) {
//           locationMatch = true;
//         }
//       }

//       if (locationMatch) {
//         achievedScore += weight;
//         details.location = { score: 1.0, weight, status: 'Match', reason: 'Location matches' };
//       } else {
//         details.location = { score: 0, weight, status: 'No Match', reason: 'Location outside eligible area' };
//       }
//       details.location.weight = weight;
//     }

//     // Calculate final percentage
//     const finalScore = totalWeight > 0 ? (achievedScore / totalWeight) * 100 : 0;

//     return {
//       score: Math.round(finalScore * 100) / 100,
//       details,
//       totalWeight,
//       achievedScore,
//       eligible: finalScore >= 70 // 70% threshold for eligibility
//     };
//   }

//   /**
//    * Find matching schemes for a user profile
//    */
//   static async findMatchingSchemes(userId, minScore = 50) {
//     try {
//       const userProfile = await UserProfile.findOne({ where: { userId } });
//       if (!userProfile) {
//         throw new Error(`User profile not found for userId: ${userId}`);
//       }

//       const allSchemes = await SchemeEligibility.findAll({
//         where: { parsedSuccessfully: true }
//       });

//       const matches = [];

//       for (const scheme of allSchemes) {
//         const matchResult = this.calculateMatchScore(userProfile, scheme);
        
//         if (matchResult.score >= minScore && matchResult.eligible !== false) {
//           matches.push({
//             schemeId: scheme.schemeId,
//             schemeName: scheme.schemeName,
//             schemeLevel: scheme.schemeLevel,
//             matchScore: matchResult.score,
//             eligible: matchResult.eligible,
//             matchDetails: matchResult.details,
//             rawEligibility: scheme.rawEligibilityText
//           });
//         }
//       }

//       // Sort by match score descending
//       matches.sort((a, b) => b.matchScore - a.matchScore);

//       return {
//         userId,
//         userName: userProfile.name,
//         totalSchemes: allSchemes.length,
//         matchingSchemes: matches.length,
//         schemes: matches
//       };
//     } catch (error) {
//       console.error('Error finding matching schemes:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get detailed eligibility check for specific scheme
//    */
//   static async checkSchemeEligibility(userId, schemeId) {
//     try {
//       const userProfile = await UserProfile.findOne({ where: { userId } });
//       if (!userProfile) {
//         throw new Error(`User profile not found for userId: ${userId}`);
//       }

//       const scheme = await SchemeEligibility.findOne({ where: { schemeId } });
//       if (!scheme) {
//         throw new Error(`Scheme eligibility not found for schemeId: ${schemeId}`);
//       }

//       const matchResult = this.calculateMatchScore(userProfile, scheme);

//       return {
//         userId,
//         userName: userProfile.name,
//         schemeId: scheme.schemeId,
//         schemeName: scheme.schemeName,
//         ...matchResult
//       };
//     } catch (error) {
//       console.error('Error checking scheme eligibility:', error);
//       throw error;
//     }
//   }
// }

// module.exports = FuzzyEligibilityMatcher;


const SchemeEligibility = require('../models/schemeEligibility');
const UserProfile = require('../models/UserProfile');
const { Op } = require('sequelize');

class FuzzyEligibilityMatcher {

  /**
   * Calculate fuzzy match score between user profile and scheme eligibility
   * Returns score between 0-100
   */
  static calculateMatchScore(userProfile, schemeEligibility) {

    let totalWeight = 0;
    let achievedScore = 0;

    const details = {
      age: { score: 0, weight: 0, status: 'N/A' },
      income: { score: 0, weight: 0, status: 'N/A' },
      gender: { score: 0, weight: 0, status: 'N/A' },
      category: { score: 0, weight: 0, status: 'N/A' },
      disability: { score: 0, weight: 0, status: 'N/A' },
      specialGroup: { score: 0, weight: 0, status: 'N/A' },
      location: { score: 0, weight: 0, status: 'N/A' }
    };

    // ===============================
    // -------- HARD FILTERS ---------
    // ===============================

    // 1. Gender Strict Filter
    if (schemeEligibility.gender && schemeEligibility.gender !== 'All') {
      if (userProfile.gender !== schemeEligibility.gender) {
        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Gender mismatch" };
      }
    }

    // 2. Disability Strict Filter
    if (schemeEligibility.requiresDisability && !userProfile.disability) {
      return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Disability required" };
    }

    // 3. Ex-Servicemen Strict Filter
    if (schemeEligibility.requiresExServicemen && !userProfile.exServiceman) {
      return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Ex-Servicemen required" };
    }

    // 4. Occupation Strict Filter
    if (Array.isArray(schemeEligibility.eligibleOccupations) &&
        schemeEligibility.eligibleOccupations.length > 0) {

      if (!userProfile.occupation ||
          !schemeEligibility.eligibleOccupations.includes(userProfile.occupation)) {

        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Occupation not eligible" };
      }
    }

    // 5. Category Strict Filter
    if (Array.isArray(schemeEligibility.eligibleCategories) &&
        schemeEligibility.eligibleCategories.length > 0) {

      if (!schemeEligibility.eligibleCategories.includes(userProfile.category)) {
        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Category not eligible" };
      }
    }

    // 6. Location Strict Filter
    if (Array.isArray(schemeEligibility.eligibleStates) &&
        schemeEligibility.eligibleStates.length > 0) {

      if (!schemeEligibility.eligibleStates.includes(userProfile.state)) {
        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "State not eligible" };
      }
    }

    if (Array.isArray(schemeEligibility.eligibleDistricts) &&
        schemeEligibility.eligibleDistricts.length > 0) {

      if (!schemeEligibility.eligibleDistricts.includes(userProfile.district)) {
        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "District not eligible" };
      }
    }

    // 7. Dynamic Special Group Strict Mode (Optional)
    const requiredGroups = Object.keys(schemeEligibility)
      .filter(key => key.startsWith('requires') && schemeEligibility[key] === true);

    if (schemeEligibility.strictSpecialGroup === true) {
      for (const field of requiredGroups) {
        const profileField = field.replace('requires', '');
        const normalizedField =
          profileField.charAt(0).toLowerCase() + profileField.slice(1);

        if (!userProfile[normalizedField]) {
          return {
            score: 0,
            details,
            totalWeight: 0,
            achievedScore: 0,
            eligible: false,
            reason: `${profileField} required`
          };
        }
      }
    }

    // ===============================
    // -------- FUZZY SCORING --------
    // ===============================

    // 1. Age Matching
    if (schemeEligibility.minAge !== null || schemeEligibility.maxAge !== null) {
      const weight = schemeEligibility.weightAge || 1.0;
      totalWeight += weight;

      if (userProfile.age) {
        const minAge = schemeEligibility.minAge || 0;
        const maxAge = schemeEligibility.maxAge || 120;

        if (userProfile.age >= minAge && userProfile.age <= maxAge) {
          achievedScore += weight;
          details.age = { score: 1, weight, status: 'Match', reason: `Age within range` };
        } else {
          const distance = Math.min(
            Math.abs(userProfile.age - minAge),
            Math.abs(userProfile.age - maxAge)
          );

          const partial = Math.max(0, 1 - (distance / 10));

          if (partial > 0) {
            achievedScore += weight * partial;
            details.age = { score: partial, weight, status: 'Partial', reason: 'Age close to range' };
          } else {
            return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Age outside allowed range" };
          }
        }
      }
    }

    // 2. Income Matching
    if (schemeEligibility.maxIncome !== null || schemeEligibility.minIncome !== null) {
      const weight = schemeEligibility.weightIncome || 1.0;
      totalWeight += weight;

      if (userProfile.income) {
        const minIncome = schemeEligibility.minIncome || 0;
        const maxIncome = schemeEligibility.maxIncome || Infinity;
        const tolerance = maxIncome * 0.1;

        if (userProfile.income >= minIncome && userProfile.income <= maxIncome) {
          achievedScore += weight;
          details.income = { score: 1, weight, status: 'Match', reason: 'Income within range' };
        } else if (userProfile.income <= maxIncome + tolerance) {
          achievedScore += weight * 0.5;
          details.income = { score: 0.5, weight, status: 'Near Match', reason: 'Within 10% tolerance' };
        } else {
          return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Income exceeds limit" };
        }
      }
    }

    // 3. Gender Scoring
    if (schemeEligibility.gender && schemeEligibility.gender !== 'All') {
      totalWeight += 1.0;
      achievedScore += 1.0;
      details.gender = { score: 1, weight: 1.0, status: 'Match' };
    }

    // 4. Category Scoring
    if (Array.isArray(schemeEligibility.eligibleCategories) &&
        schemeEligibility.eligibleCategories.length > 0) {

      const weight = schemeEligibility.weightCategory || 1.0;
      totalWeight += weight;

      achievedScore += weight;
      details.category = { score: 1, weight, status: 'Match' };
    }

    // 5. Disability Scoring
    if (schemeEligibility.requiresDisability) {
      totalWeight += 1.5;
      achievedScore += 1.5;
      details.disability = { score: 1, weight: 1.5, status: 'Match' };
    }

    // 6. Dynamic Special Group Scoring
    if (requiredGroups.length > 0) {

      const weight = schemeEligibility.weightSpecialGroup || 1.0;
      totalWeight += weight;

      let matches = 0;
      const matched = [];
      const missing = [];

      for (const field of requiredGroups) {

        const profileField = field.replace('requires', '');
        const normalizedField =
          profileField.charAt(0).toLowerCase() + profileField.slice(1);

        if (userProfile[normalizedField]) {
          matches++;
          matched.push(profileField);
        } else {
          missing.push(profileField);
        }
      }

      const score = matches / requiredGroups.length;
      achievedScore += weight * score;

      details.specialGroup = {
        score,
        weight,
        status: score === 1 ? 'Match' : score > 0 ? 'Partial' : 'No Match',
        reason: `Matched: ${matched.join(', ') || 'None'}; Missing: ${missing.join(', ')}`
      };
    }

    // 7. Location Scoring
    if (
      (Array.isArray(schemeEligibility.eligibleStates) && schemeEligibility.eligibleStates.length > 0) ||
      (Array.isArray(schemeEligibility.eligibleDistricts) && schemeEligibility.eligibleDistricts.length > 0)
    ) {
      const weight = 0.8;
      totalWeight += weight;
      achievedScore += weight;
      details.location = { score: 1, weight, status: 'Match' };
    }

    // ===============================
    // FINAL SCORE
    // ===============================

    const finalScore = totalWeight > 0
      ? (achievedScore / totalWeight) * 100
      : 0;

    return {
      score: Math.round(finalScore * 100) / 100,
      details,
      totalWeight,
      achievedScore,
      eligible: finalScore >= 70
    };
  }

  static async findMatchingSchemes(userId, minScore = 50) {

    const userProfile = await UserProfile.findOne({ where: { userId } });
    if (!userProfile) throw new Error(`User profile not found`);

    const allSchemes = await SchemeEligibility.findAll({
      where: { parsedSuccessfully: true }
    });

    const matches = [];

    for (const scheme of allSchemes) {
      const result = this.calculateMatchScore(userProfile, scheme);

      if (result.score >= minScore && result.eligible !== false) {
        matches.push({
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          schemeLevel: scheme.schemeLevel,
          matchScore: result.score,
          eligible: result.eligible,
          matchDetails: result.details,
          rawEligibility: scheme.rawEligibilityText
        });
      }
    }

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return {
      userId,
      userName: userProfile.name,
      totalSchemes: allSchemes.length,
      matchingSchemes: matches.length,
      schemes: matches
    };
  }

  static async checkSchemeEligibility(userId, schemeId) {

    const userProfile = await UserProfile.findOne({ where: { userId } });
    if (!userProfile) throw new Error(`User profile not found`);

    const scheme = await SchemeEligibility.findOne({ where: { schemeId } });
    if (!scheme) throw new Error(`Scheme not found`);

    const result = this.calculateMatchScore(userProfile, scheme);

    return {
      userId,
      userName: userProfile.name,
      schemeId: scheme.schemeId,
      schemeName: scheme.schemeName,
      ...result
    };
  }
}

module.exports = FuzzyEligibilityMatcher;
