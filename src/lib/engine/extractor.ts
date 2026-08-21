import { CitizenProfile, RankedSchemeMatch, UNKNOWN } from '@/types/engine';

// ── Helpers ──────────────────────────────────────────────────

/** Parse an income number from a match group (returns rupees). */
function parseLakhIncome(s: string): number {
  return Math.round(parseFloat(s) * 100000);
}

/** True if the token looks like it belongs to an income/money context. */
function isInIncomeContext(before: string): boolean {
  return /(?:₹|rs\.?|rupees?|lakh|lac|income|earning|salary|pay)\s*$/.test(before.toLowerCase());
}

// ── Main Extractor ────────────────────────────────────────────

export function extractProfileUpdates(
  text: string,
  currentProfile: CitizenProfile,
): Partial<CitizenProfile> {
  const updates: Partial<CitizenProfile> = {};
  const lower = text.toLowerCase();

  // ── INCOME (must run BEFORE age to identify income numbers) ──
  // Matches: "₹10 lakh", "10 lakh", "10L", "Rs. 10 lakh", "income of 200000"
  const incomeLakh = lower.match(
    /(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/,
  );
  const incomeRaw = lower.match(
    /(?:₹|rs\.?|rupees?|income\s*(?:of|is)?|earning(?:s)?(?:\s*(?:of|is)?)?)\s*(\d{5,9})\b/,
  );

  // Store income match positions so we can exclude those numbers from age parsing
  const incomeNumberPositions = new Set<number>();

  if (incomeLakh && incomeLakh[1]) {
    updates.annualIncome = parseLakhIncome(incomeLakh[1]);
    // record approximate position
    const idx = lower.indexOf(incomeLakh[1]);
    if (idx >= 0) incomeNumberPositions.add(idx);
  } else if (incomeRaw && incomeRaw[1]) {
    updates.annualIncome = parseInt(incomeRaw[1], 10);
    const idx = lower.indexOf(incomeRaw[1]);
    if (idx >= 0) incomeNumberPositions.add(idx);
  }

  // ── AGE ──────────────────────────────────────────────────────
  // Must NOT match numbers that were identified as income.
  // Supported patterns:
  //   "I am 19 years old" / "I am 19"
  //   "I'm 19 years old" / "I'm 19"
  //   "I'm a 19-year-old" / "I'm a 19 year old"
  //   "age is 19" / "age: 19" / "aged 19"
  //   "19 years old" / "19-year-old"
  //   "actually I am 20" / "actually, I am 20"

  const agePatterns: RegExp[] = [
    // "I am 19" / "I'm 19" / "i am 19 years"
    /\b(?:i\s*am|i'm|i\s*'m|iam)\s+(?:a\s+)?(\d{1,3})\s*(?:-?\s*year(?:s)?\s*old|years?\s*old|yrs?\s*old|yrs?)?/i,
    // "age is 19" / "age: 19" / "aged 19" / "my age is 19"
    /\b(?:my\s+)?age\s*(?:is|:|=|are)?\s*(\d{1,3})\b/i,
    // "19-year-old" / "19 year old" (standalone, not preceded by ₹/lakh context)
    /\b(\d{1,3})\s*-?\s*year(?:s)?\s*(?:old|ago)?\b/i,
    // "19 years old"
    /\b(\d{1,3})\s+years?\s+old\b/i,
    // "actually I am 20" / "actually, I am 20"
    /\bactually[,\s]+(?:i\s*am|i'm|iam)\s+(\d{1,3})\b/i,
  ];

  for (const pattern of agePatterns) {
    const m = lower.match(pattern);
    if (m && m[1]) {
      const candidateAge = parseInt(m[1], 10);
      const candidatePos = lower.indexOf(m[1]);

      // Sanity: age must be between 5 and 100
      if (candidateAge < 5 || candidateAge > 100) continue;

      // Reject if this number position is the income number
      if (incomeNumberPositions.has(candidatePos)) continue;

      // Reject if the number is immediately followed by "lakh" or "lac"
      const afterNum = lower.slice(candidatePos + m[1].length).trimStart();
      if (/^(?:lakh|lac|l\b)/.test(afterNum)) continue;

      updates.age = candidateAge;
      break;
    }
  }

  // ── GENDER ───────────────────────────────────────────────────
  if (/\b(?:female|woman|girl)\b/.test(lower)) {
    updates.gender = 'Female';
  } else if (/\b(?:male|man|boy)\b/.test(lower)) {
    updates.gender = 'Male';
  }

  // ── OCCUPATION ────────────────────────────────────────────────
  if (/\b(?:student|studying)\b/.test(lower)) {
    updates.occupation = 'Student';
  } else if (/\bfarmer\b/.test(lower)) {
    updates.occupation = 'Farmer';
  } else if (/\b(?:salaried|employed|working|job)\b/.test(lower)) {
    updates.occupation = 'Employed';
  } else if (/\bunemployed\b/.test(lower)) {
    updates.occupation = 'Unemployed';
  } else if (/\bretired\b/.test(lower)) {
    updates.occupation = 'Retired';
  } else if (/\bself.?employed\b/.test(lower)) {
    updates.occupation = 'Self-Employed';
  }

  // ── STATE ─────────────────────────────────────────────────────
  const stateMap: Record<string, string> = {
    'rajasthan': 'Rajasthan',
    'maharashtra': 'Maharashtra',
    'delhi': 'Delhi',
    'up': 'Uttar Pradesh',
    'uttar pradesh': 'Uttar Pradesh',
    'bihar': 'Bihar',
    'gujarat': 'Gujarat',
    'punjab': 'Punjab',
    'haryana': 'Haryana',
    'karnataka': 'Karnataka',
    'kerala': 'Kerala',
    'tamil nadu': 'Tamil Nadu',
    'west bengal': 'West Bengal',
    'madhya pradesh': 'Madhya Pradesh',
    'telangana': 'Telangana',
    'andhra pradesh': 'Andhra Pradesh',
    'assam': 'Assam',
    'odisha': 'Odisha',
    'jharkhand': 'Jharkhand',
    'chhattisgarh': 'Chhattisgarh',
    'himachal pradesh': 'Himachal Pradesh',
    'uttarakhand': 'Uttarakhand',
    'goa': 'Goa',
    'manipur': 'Manipur',
    'meghalaya': 'Meghalaya',
    'tripura': 'Tripura',
    'nagaland': 'Nagaland',
    'mizoram': 'Mizoram',
    'arunachal pradesh': 'Arunachal Pradesh',
    'sikkim': 'Sikkim',
    'jammu and kashmir': 'Jammu & Kashmir',
    'j&k': 'Jammu & Kashmir',
  };

  // Sort by length desc so "uttar pradesh" matches before "up"
  const sortedStates = Object.keys(stateMap).sort((a, b) => b.length - a.length);
  for (const key of sortedStates) {
    // Special case: "up" must be word-bounded and not part of "startup"
    const pattern = key === 'up'
      ? /\bup\b(?!\s*grade|\s*date|\s*load|\s*load|\s*coming|\s*side|\s*date|\s*set)/
      : new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (pattern.test(lower)) {
      updates.state = stateMap[key];
      break;
    }
  }

  // ── CATEGORY ─────────────────────────────────────────────────
  if (/\b(?:sc|scheduled caste)\b/.test(lower)) {
    updates.category = 'SC';
  } else if (/\b(?:st|scheduled tribe)\b/.test(lower)) {
    updates.category = 'ST';
  } else if (/\bobc\b/.test(lower)) {
    updates.category = 'OBC';
  } else if (/\bews\b/.test(lower)) {
    updates.category = 'EWS';
  } else if (/\bgeneral\b/.test(lower)) {
    updates.category = 'General';
  }

  // ── DISABILITY ────────────────────────────────────────────────
  if (/\b(?:disabled|disability|differently abled|handicapped|pwd)\b/.test(lower)) {
    updates.disability = 'Physical';
  }

  // ── EDUCATION ─────────────────────────────────────────────────
  if (/\b(?:btech|b\.tech|b tech|bachelor of technology)\b/.test(lower)) {
    updates.education = 'B.Tech';
  } else if (/\b(?:bsc|b\.sc|bachelor of science)\b/.test(lower)) {
    updates.education = 'B.Sc';
  } else if (/\b(?:ba|b\.a|bachelor of arts)\b/.test(lower)) {
    updates.education = 'B.A';
  } else if (/\b(?:mtech|m\.tech|master of technology)\b/.test(lower)) {
    updates.education = 'M.Tech';
  } else if (/\b(?:mba|master of business)\b/.test(lower)) {
    updates.education = 'MBA';
  } else if (/\b(?:graduation|graduate|degree|college)\b/.test(lower)) {
    updates.education = 'Graduation';
  } else if (/\b(?:12th|class 12|hsc|intermediate|plus two|12)\b/.test(lower)) {
    updates.education = '12th';
  } else if (/\b(?:10th|class 10|ssc|matriculation|matric)\b/.test(lower)) {
    updates.education = '10th';
  } else if (/\bdiploma\b/.test(lower)) {
    updates.education = 'Diploma';
  }

  // ── LIFE EVENTS ───────────────────────────────────────────────
  const lifeEventsSet = new Set(currentProfile.lifeEvents || []);
  if (/\b(?:lost job|lost my job|laid off)\b/.test(lower)) lifeEventsSet.add('job_loss');
  if (/\b(?:crop damage|flood|drought)\b/.test(lower)) lifeEventsSet.add('crop_damage');
  if (/\b(?:new baby|pregnant|expecting)\b/.test(lower)) lifeEventsSet.add('new_child');
  if (/\b(?:father passed|husband died|widow)\b/.test(lower)) lifeEventsSet.add('family_death');
  if (/\b(?:starting college|joining college|got admission)\b/.test(lower)) lifeEventsSet.add('new_student');
  if (/\b(?:retired|pension)\b/.test(lower)) lifeEventsSet.add('retirement');

  if (lifeEventsSet.size > (currentProfile.lifeEvents?.length || 0)) {
    updates.lifeEvents = Array.from(lifeEventsSet);
  }

  return updates;
}

export function generateFollowUpQuestion(
  profile: CitizenProfile,
  topMatches: RankedSchemeMatch[],
): string | null {
  const missingFields = new Set<string>();

  for (const match of topMatches) {
    if (match.tier === 'missing_info' || match.tier === 'low') {
      for (const criterion of match.eligibility.criteriaResults) {
        if (criterion.status === 'UNKNOWN') {
          const rule = match.scheme.eligibilityRules.find(r => r.id === criterion.ruleId);
          if (rule && rule.field !== 'document') {
            missingFields.add(rule.field);
          }
        }
      }
    }
  }

  if (missingFields.size === 0) return null;

  if (missingFields.has('annualIncome') && profile.annualIncome === UNKNOWN)
    return 'What is your approximate annual family income?';
  if (missingFields.has('age') && profile.age === UNKNOWN)
    return 'Could you please tell me your age?';
  if (missingFields.has('gender') && profile.gender === UNKNOWN)
    return 'Could you specify your gender?';
  if (missingFields.has('occupation') && profile.occupation === UNKNOWN)
    return 'What is your current occupation?';
  if (missingFields.has('category') && profile.category === UNKNOWN)
    return 'Which social category do you belong to (General, SC, ST, OBC, EWS)?';
  if (missingFields.has('state') && profile.state === UNKNOWN)
    return 'Which state do you live in?';

  const firstMissing = Array.from(missingFields)[0];
  return `Could you please provide information about your ${firstMissing}?`;
}
