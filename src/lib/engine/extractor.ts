import { CitizenProfile, RankedSchemeMatch, UNKNOWN } from '@/types/engine';

export function extractProfileUpdates(text: string, currentProfile: CitizenProfile): Partial<CitizenProfile> {
  const updates: Partial<CitizenProfile> = {};
  const lowerText = text.toLowerCase();

  // Age
  const ageMatch = lowerText.match(/(?:age\s*|i am\s*)(\d{1,3})(?:\s*years?|(?:\s*-\s*)?year)?/);
  if (ageMatch && ageMatch[1]) {
    updates.age = parseInt(ageMatch[1], 10);
  } else {
    const ageMatch2 = lowerText.match(/(\d{1,3})\s*(?:year|-year)/);
    if (ageMatch2 && ageMatch2[1]) {
        updates.age = parseInt(ageMatch2[1], 10);
    }
  }

  // Gender
  if (/\b(?:female|woman|girl)\b/.test(lowerText)) {
    updates.gender = 'Female';
  } else if (/\b(?:male|man|boy)\b/.test(lowerText)) {
    updates.gender = 'Male';
  } else if (/\bdaughter\b/.test(lowerText) && !/\bmy daughter\b/.test(lowerText)) {
    updates.gender = 'Female';
  } else if (/\bson\b/.test(lowerText) && !/\bmy son\b/.test(lowerText)) {
    updates.gender = 'Male';
  }

  // Occupation
  if (/\b(?:student|studying)\b/.test(lowerText)) {
    updates.occupation = 'Student';
  } else if (/\bfarmer\b/.test(lowerText)) {
    updates.occupation = 'Farmer';
  } else if (/\b(?:working|job)\b/.test(lowerText)) {
    updates.occupation = 'Employed';
  } else if (/\bunemployed\b/.test(lowerText)) {
    updates.occupation = 'Unemployed';
  } else if (/\bretired\b/.test(lowerText)) {
    updates.occupation = 'Retired';
  }

  // Income
  const incomeMatchLakh = lowerText.match(/(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*lakh/);
  const incomeMatchNum = lowerText.match(/(?:₹|rs\.?|rupees?|income\s*of|earning)\s*(\d{4,9})/);
  
  if (incomeMatchLakh && incomeMatchLakh[1]) {
    updates.annualIncome = parseFloat(incomeMatchLakh[1]) * 100000;
  } else if (incomeMatchNum && incomeMatchNum[1]) {
    updates.annualIncome = parseInt(incomeMatchNum[1], 10);
  }

  // State
  const states = ['rajasthan', 'maharashtra', 'delhi', 'up', 'uttar pradesh', 'bihar', 'gujarat', 'punjab', 'haryana', 'karnataka', 'kerala', 'tamil nadu', 'west bengal', 'madhya pradesh', 'telangana', 'andhra pradesh'];
  for (const state of states) {
    if (new RegExp(`\\b${state}\\b`).test(lowerText)) {
      updates.state = state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (updates.state === 'Up') updates.state = 'Uttar Pradesh';
      break;
    }
  }

  // Category
  if (/\b(?:sc)\b/.test(lowerText)) {
    updates.category = 'SC';
  } else if (/\b(?:st)\b/.test(lowerText)) {
    updates.category = 'ST';
  } else if (/\b(?:obc)\b/.test(lowerText)) {
    updates.category = 'OBC';
  } else if (/\b(?:ews)\b/.test(lowerText)) {
    updates.category = 'EWS';
  } else if (/\b(?:general)\b/.test(lowerText)) {
    updates.category = 'General';
  }

  // Disability
  if (/\b(?:disabled|disability|differently abled|handicapped)\b/.test(lowerText)) {
    updates.disability = 'Physical';
  }

  // Education
  if (/\b(?:btech|b\.tech|bachelor)\b/.test(lowerText)) {
    updates.education = 'B.Tech';
  } else if (/\b(?:graduation|graduate|degree)\b/.test(lowerText)) {
    updates.education = 'Graduation';
  } else if (/\b12th\b/.test(lowerText)) {
    updates.education = '12th';
  } else if (/\b10th\b/.test(lowerText)) {
    updates.education = '10th';
  } else if (/\bdiploma\b/.test(lowerText)) {
    updates.education = 'Diploma';
  } else if (/\bmba\b/.test(lowerText)) {
    updates.education = 'MBA';
  }

  // Life Events
  const lifeEventsSet = new Set(currentProfile.lifeEvents || []);
  if (/\b(?:lost job|lost my job)\b/.test(lowerText)) lifeEventsSet.add('job_loss');
  if (/\b(?:crop damage|flood|drought)\b/.test(lowerText)) lifeEventsSet.add('crop_damage');
  if (/\b(?:new baby|pregnant|expecting)\b/.test(lowerText)) lifeEventsSet.add('new_child');
  if (/\b(?:father passed|husband died|widow)\b/.test(lowerText)) lifeEventsSet.add('family_death');
  if (/\b(?:starting college|joining college|got admission)\b/.test(lowerText)) lifeEventsSet.add('new_student');
  if (/\b(?:retired|pension)\b/.test(lowerText)) lifeEventsSet.add('retirement');

  if (lifeEventsSet.size > (currentProfile.lifeEvents?.length || 0)) {
    updates.lifeEvents = Array.from(lifeEventsSet);
  }

  return updates;
}

export function generateFollowUpQuestion(profile: CitizenProfile, topMatches: RankedSchemeMatch[]): string | null {
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

  if (missingFields.has('annualIncome') && profile.annualIncome === UNKNOWN) {
    return 'What is your approximate annual family income?';
  }
  if (missingFields.has('age') && profile.age === UNKNOWN) {
    return 'Could you please tell me your age?';
  }
  if (missingFields.has('gender') && profile.gender === UNKNOWN) {
    return 'Could you specify your gender?';
  }
  if (missingFields.has('occupation') && profile.occupation === UNKNOWN) {
    return 'What is your current occupation?';
  }
  if (missingFields.has('category') && profile.category === UNKNOWN) {
    return 'Which social category do you belong to (General, SC, ST, OBC, EWS)?';
  }
  if (missingFields.has('state') && profile.state === UNKNOWN) {
    return 'Which state do you live in?';
  }

  const firstMissing = Array.from(missingFields)[0];
  return `Could you please provide information about your ${firstMissing}?`;
}
