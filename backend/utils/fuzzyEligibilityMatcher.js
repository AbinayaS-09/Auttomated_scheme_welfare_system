const SchemeEligibility = require('../models/schemeEligibility');
const UserProfile = require('../models/UserProfil');
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

    // --- HARD RULES (Disqualifiers) ---
    // 0. Hard Checking: Gender, Disability, Ex-Servicemen, Student, etc.
    
    // Gender Mismatch
    if (schemeEligibility.gender && schemeEligibility.gender !== 'All') {
        if (userProfile.gender !== schemeEligibility.gender) {
            return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Gender mismatch" };
        }
    }

    // Disability Requirement
    if (schemeEligibility.requiresDisability && !userProfile.disability) {
        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Disability required" };
    }

    // Ex-Servicemen Requirement
    if (schemeEligibility.requiresExServicemen && !userProfile.exServiceman) { // Assuming exServiceman field exists or is derived
        return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: "Ex-Servicemen required" }; 
    }

    // Student Requirement (If strictly required)
    if (schemeEligibility.requiresStudent && !userProfile.student) {
         // Some logic might be fuzzy here, but if strict:
         // return { score: 0, ... };
    }

    // 1. Age Matching (Weight: 1.0)
    if (schemeEligibility.minAge !== null || schemeEligibility.maxAge !== null) {
      const weight = schemeEligibility.weightAge || 1.0;
      totalWeight += weight;
      
      if (userProfile.age) {
        const minAge = schemeEligibility.minAge || 0;
        const maxAge = schemeEligibility.maxAge || 120;
        
        if (userProfile.age >= minAge && userProfile.age <= maxAge) {
          achievedScore += weight;
          details.age = { score: 1.0, weight, status: 'Match', reason: `Age ${userProfile.age} is within ${minAge}-${maxAge}` };
        } else {
          // Partial score for being close to range
          const distance = Math.min(
            Math.abs(userProfile.age - minAge),
            Math.abs(userProfile.age - maxAge)
          );
          const partialScore = Math.max(0, 1 - (distance / 10)); // 10 year tolerance
          achievedScore += weight * partialScore;
          if (partialScore > 0) {
             details.age = { score: partialScore, weight, status: 'Partial', reason: `Age ${userProfile.age} is close to required ${minAge}-${maxAge}` };
          } else {
             // Hard fail if outside tolerance
             return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: `Age ${userProfile.age} is outside ${minAge}-${maxAge}` };
          }
        }
      }
      details.age.weight = weight;
    }

    // 2. Income Matching (Weight: 1.0)
    if (schemeEligibility.maxIncome !== null || schemeEligibility.minIncome !== null) {
      const weight = schemeEligibility.weightIncome || 1.0;
      totalWeight += weight;
      
      if (userProfile.income) {
        const minIncome = schemeEligibility.minIncome || 0;
        const maxIncome = schemeEligibility.maxIncome || Infinity;
        const tolerance = maxIncome * 0.1; // 10% tolerance
        
        if (userProfile.income >= minIncome && userProfile.income <= maxIncome) {
          achievedScore += weight;
          details.income = { score: 1.0, weight, status: 'Match', reason: `Income meets criteria` };
        } else if (userProfile.income <= maxIncome + tolerance) {
           // Within 10% tolerance
           const partial = 0.5;
           achievedScore += weight * partial;
           details.income = { score: partial, weight, status: 'Near Match', reason: `Income within 10% tolerance` };
        } else {
           // Hard fail if income exceeds limit + tolerance
           return { score: 0, details, totalWeight: 0, achievedScore: 0, eligible: false, reason: `Income ${userProfile.income} exceeds limit ${maxIncome}` };
        }
      }
      details.income.weight = weight;
    }

    // 3. Gender Matching
    if (schemeEligibility.gender && schemeEligibility.gender !== 'All') {
      const weight = 1.0;
      totalWeight += weight;
      achievedScore += weight;
      details.gender = { score: 1.0, weight, status: 'Match', reason: `Gender ${userProfile.gender} matches` };
    }

    // 4. Category Matching (Weight: 1.0)
    if (schemeEligibility.eligibleCategories && Array.isArray(schemeEligibility.eligibleCategories)) {
      const weight = schemeEligibility.weightCategory || 1.0;
      totalWeight += weight;
      
      if (userProfile.category && schemeEligibility.eligibleCategories.includes(userProfile.category)) {
        achievedScore += weight;
        details.category = { score: 1.0, weight, status: 'Match', reason: `Category ${userProfile.category} matches` };
      } else {
        details.category = { score: 0, weight, status: 'No Match', reason: `Category ${userProfile.category} not in list` };
      }
      details.category.weight = weight;
    }

    // 5. Disability Matching
    if (schemeEligibility.requiresDisability) {
      const weight = 1.5;
      totalWeight += weight;
      achievedScore += weight;
      details.disability = { score: 1.0, weight, status: 'Match', reason: 'Disability requirement met' };
    }

    // 6. Special Group Matching (Weight: 1.0)
    const specialGroupWeight = schemeEligibility.weightSpecialGroup || 1.0;
    let specialGroupChecks = 0;
    let specialGroupMatches = 0;
    let matchedGroups = [];
    let missingGroups = [];

    if (schemeEligibility.requiresFarmer) {
      specialGroupChecks++;
      if (userProfile.farmer) { specialGroupMatches++; matchedGroups.push('Farmer'); } else { missingGroups.push('Farmer'); }
    }
    if (schemeEligibility.requiresStudent) {
      specialGroupChecks++;
      if (userProfile.student) { specialGroupMatches++; matchedGroups.push('Student'); } else { missingGroups.push('Student'); }
    }
    if (schemeEligibility.requiresWidow) {
      specialGroupChecks++;
      if (userProfile.widow) { specialGroupMatches++; matchedGroups.push('Widow'); } else { missingGroups.push('Widow'); }
    }
    if (schemeEligibility.requiresSeniorCitizen) {
      specialGroupChecks++;
      if (userProfile.seniorCitizen) { specialGroupMatches++; matchedGroups.push('Senior Citizen'); } else { missingGroups.push('Senior Citizen'); }
    }

    if (specialGroupChecks > 0) {
      totalWeight += specialGroupWeight;
      const specialScore = specialGroupMatches / specialGroupChecks;
      achievedScore += specialGroupWeight * specialScore;
      
      const statusText = specialScore === 1 ? 'Match' : (specialScore > 0 ? 'Partial' : 'No Match');
      const reasonText = specialScore === 1 ? 'All special groups match' : `Matched: ${matchedGroups.join(', ') || 'None'}; Missing: ${missingGroups.join(', ')}`;
      
      details.specialGroup = { 
        score: specialScore, 
        weight: specialGroupWeight, 
        status: statusText,
        reason: reasonText
      };
    }

    // 7. Location Matching (Weight: 0.8)
    if (
        (Array.isArray(schemeEligibility.eligibleStates) && schemeEligibility.eligibleStates.length > 0) ||
        (Array.isArray(schemeEligibility.eligibleDistricts) && schemeEligibility.eligibleDistricts.length > 0)
    ) {
      const weight = 0.8;
      totalWeight += weight;
      let locationMatch = false;

      if (Array.isArray(schemeEligibility.eligibleStates) && schemeEligibility.eligibleStates.length > 0) {
        if (userProfile.state && schemeEligibility.eligibleStates.includes(userProfile.state)) {
          locationMatch = true;
        }
      }

      if (Array.isArray(schemeEligibility.eligibleDistricts) && schemeEligibility.eligibleDistricts.length > 0) {
        if (userProfile.district && schemeEligibility.eligibleDistricts.includes(userProfile.district)) {
          locationMatch = true;
        }
      }

      if (locationMatch) {
        achievedScore += weight;
        details.location = { score: 1.0, weight, status: 'Match', reason: 'Location matches' };
      } else {
        details.location = { score: 0, weight, status: 'No Match', reason: 'Location outside eligible area' };
      }
      details.location.weight = weight;
    }

    // Calculate final percentage
    const finalScore = totalWeight > 0 ? (achievedScore / totalWeight) * 100 : 0;

    return {
      score: Math.round(finalScore * 100) / 100,
      details,
      totalWeight,
      achievedScore,
      eligible: finalScore >= 70 // 70% threshold for eligibility
    };
  }

  /**
   * Find matching schemes for a user profile
   */
  static async findMatchingSchemes(userId, minScore = 50) {
    try {
      const userProfile = await UserProfile.findOne({ where: { userId } });
      if (!userProfile) {
        throw new Error(`User profile not found for userId: ${userId}`);
      }

      const allSchemes = await SchemeEligibility.findAll({
        where: { parsedSuccessfully: true }
      });

      const matches = [];

      for (const scheme of allSchemes) {
        const matchResult = this.calculateMatchScore(userProfile, scheme);
        
        if (matchResult.score >= minScore && matchResult.eligible !== false) {
          matches.push({
            schemeId: scheme.schemeId,
            schemeName: scheme.schemeName,
            schemeLevel: scheme.schemeLevel,
            matchScore: matchResult.score,
            eligible: matchResult.eligible,
            matchDetails: matchResult.details,
            rawEligibility: scheme.rawEligibilityText
          });
        }
      }

      // Sort by match score descending
      matches.sort((a, b) => b.matchScore - a.matchScore);

      return {
        userId,
        userName: userProfile.name,
        totalSchemes: allSchemes.length,
        matchingSchemes: matches.length,
        schemes: matches
      };
    } catch (error) {
      console.error('Error finding matching schemes:', error);
      throw error;
    }
  }

  /**
   * Get detailed eligibility check for specific scheme
   */
  static async checkSchemeEligibility(userId, schemeId) {
    try {
      const userProfile = await UserProfile.findOne({ where: { userId } });
      if (!userProfile) {
        throw new Error(`User profile not found for userId: ${userId}`);
      }

      const scheme = await SchemeEligibility.findOne({ where: { schemeId } });
      if (!scheme) {
        throw new Error(`Scheme eligibility not found for schemeId: ${schemeId}`);
      }

      const matchResult = this.calculateMatchScore(userProfile, scheme);

      return {
        userId,
        userName: userProfile.name,
        schemeId: scheme.schemeId,
        schemeName: scheme.schemeName,
        ...matchResult
      };
    } catch (error) {
      console.error('Error checking scheme eligibility:', error);
      throw error;
    }
  }
}

module.exports = FuzzyEligibilityMatcher;

