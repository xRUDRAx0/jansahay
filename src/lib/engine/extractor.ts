import { CitizenProfile, RankedSchemeMatch, UNKNOWN } from '@/types/engine';

// ── Levenshtein distance (for typo tolerance) ─────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Returns true if `input` is within `maxDist` edit distance of any `candidates` */
function fuzzyMatch(input: string, candidates: string[], maxDist = 2): boolean {
  return candidates.some(c => levenshtein(input, c) <= maxDist);
}

/** Returns the matched canonical name, or null */
function fuzzyFind(input: string, candidates: string[], maxDist = 2): string | null {
  let best: string | null = null, bestDist = Infinity;
  for (const c of candidates) {
    const d = levenshtein(input, c);
    if (d <= maxDist && d < bestDist) { best = c; bestDist = d; }
  }
  return best;
}

// ── State map (canonical name + aliases + common typos) ───────
const STATE_LIST: Array<{ name: string; aliases: string[] }> = [
  { name: 'Rajasthan',        aliases: ['rajasthan', 'rajastan', 'rajstan', 'rajastahn'] },
  { name: 'Maharashtra',      aliases: ['maharashtra', 'maharastra', 'mahrashtra', 'maharashta'] },
  { name: 'Delhi',            aliases: ['delhi', 'dilli', 'dilhi', 'new delhi', 'nd'] },
  { name: 'Uttar Pradesh',    aliases: ['uttar pradesh', 'up', 'utter pradesh', 'uttar pardesh'] },
  { name: 'Bihar',            aliases: ['bihar', 'biharr', 'bihaar'] },
  { name: 'Gujarat',          aliases: ['gujarat', 'gujrat', 'gujrat', 'gujrat'] },
  { name: 'Punjab',           aliases: ['punjab', 'panjab', 'punjabb'] },
  { name: 'Haryana',          aliases: ['haryana', 'haryana', 'hariyana', 'hariyaan'] },
  { name: 'Karnataka',        aliases: ['karnataka', 'karnatak', 'karnatka', 'karntaka'] },
  { name: 'Kerala',           aliases: ['kerala', 'kerela', 'keral', 'kerla'] },
  { name: 'Tamil Nadu',       aliases: ['tamil nadu', 'tamilnadu', 'tamil nad', 'tn'] },
  { name: 'West Bengal',      aliases: ['west bengal', 'west bangal', 'westbengal', 'wb'] },
  { name: 'Madhya Pradesh',   aliases: ['madhya pradesh', 'mp', 'madhya pardesh', 'madya pradesh'] },
  { name: 'Telangana',        aliases: ['telangana', 'telengana', 'telangaana'] },
  { name: 'Andhra Pradesh',   aliases: ['andhra pradesh', 'andhra', 'ap', 'andhra pardesh'] },
  { name: 'Assam',            aliases: ['assam', 'asam', 'assaam'] },
  { name: 'Odisha',           aliases: ['odisha', 'orissa', 'odisa'] },
  { name: 'Jharkhand',        aliases: ['jharkhand', 'jharkand', 'jharkahnd'] },
  { name: 'Chhattisgarh',     aliases: ['chhattisgarh', 'chattisgad', 'chhattishgad', 'chhatishgarh'] },
  { name: 'Himachal Pradesh', aliases: ['himachal pradesh', 'himachal', 'hp', 'himachal pardesh'] },
  { name: 'Uttarakhand',      aliases: ['uttarakhand', 'uttrakhand', 'uttaranchal', 'uk'] },
  { name: 'Goa',              aliases: ['goa', 'goa'] },
  { name: 'Jammu & Kashmir',  aliases: ['jammu and kashmir', 'jammu kashmir', 'j&k', 'jk', 'kashmir'] },
  { name: 'Manipur',          aliases: ['manipur', 'manipurr'] },
  { name: 'Meghalaya',        aliases: ['meghalaya', 'meghala'] },
  { name: 'Tripura',          aliases: ['tripura', 'tripuraa'] },
  { name: 'Nagaland',         aliases: ['nagaland', 'nagland'] },
  { name: 'Mizoram',          aliases: ['mizoram', 'misoram'] },
  { name: 'Arunachal Pradesh',aliases: ['arunachal pradesh', 'arunachal'] },
  { name: 'Sikkim',           aliases: ['sikkim', 'sikkim'] },
];

// ── City → State map (common Indian cities) ───────────────────
// Each entry: city canonical name, its state, plus aliases/typos
const CITY_LIST: Array<{ city: string; state: string; aliases: string[] }> = [
  // Delhi NCR
  { city: 'Noida',           state: 'Uttar Pradesh',  aliases: ['noida', 'nida', 'noeda', 'noedaa', 'noidaa'] },
  { city: 'Gurgaon',         state: 'Haryana',         aliases: ['gurgaon', 'gurugram', 'guragon', 'gurgoan', 'gurugaram'] },
  { city: 'Faridabad',       state: 'Haryana',         aliases: ['faridabad', 'fridabad', 'faridabadh'] },
  { city: 'Ghaziabad',       state: 'Uttar Pradesh',  aliases: ['ghaziabad', 'ghaziyabad', 'gaziyabad'] },
  { city: 'Greater Noida',   state: 'Uttar Pradesh',  aliases: ['greater noida', 'grater noida'] },
  // Maharashtra
  { city: 'Mumbai',          state: 'Maharashtra',     aliases: ['mumbai', 'bombay', 'mumbai', 'mumbay', 'mombai'] },
  { city: 'Pune',            state: 'Maharashtra',     aliases: ['pune', 'poona', 'puna', 'punee'] },
  { city: 'Nagpur',          state: 'Maharashtra',     aliases: ['nagpur', 'nagpurr', 'nagpure'] },
  { city: 'Nashik',          state: 'Maharashtra',     aliases: ['nashik', 'nasik', 'nashique'] },
  { city: 'Aurangabad',      state: 'Maharashtra',     aliases: ['aurangabad', 'orangabad', 'aurangabadh'] },
  // Karnataka
  { city: 'Bangalore',       state: 'Karnataka',       aliases: ['bangalore', 'bengaluru', 'bangaluru', 'banglore', 'bangalor', 'bengalore'] },
  { city: 'Mysore',          state: 'Karnataka',       aliases: ['mysore', 'mysuru', 'mysoor', 'maisoor'] },
  // Tamil Nadu
  { city: 'Chennai',         state: 'Tamil Nadu',      aliases: ['chennai', 'madras', 'chenna', 'chenai', 'chenni'] },
  { city: 'Coimbatore',      state: 'Tamil Nadu',      aliases: ['coimbatore', 'coimbatur', 'kovai'] },
  { city: 'Madurai',         state: 'Tamil Nadu',      aliases: ['madurai', 'maduray', 'madurai'] },
  // West Bengal
  { city: 'Kolkata',         state: 'West Bengal',     aliases: ['kolkata', 'calcutta', 'kolkatta', 'kolkuta', 'kolkata'] },
  // Telangana
  { city: 'Hyderabad',       state: 'Telangana',       aliases: ['hyderabad', 'hydrabad', 'hyder', 'haidrabad', 'hyd'] },
  // Gujarat
  { city: 'Ahmedabad',       state: 'Gujarat',         aliases: ['ahmedabad', 'ahemdabad', 'ahmed', 'ahmadabad', 'amdavad'] },
  { city: 'Surat',           state: 'Gujarat',         aliases: ['surat', 'surt', 'surath'] },
  { city: 'Vadodara',        state: 'Gujarat',         aliases: ['vadodara', 'baroda', 'vadodra'] },
  // Rajasthan
  { city: 'Jaipur',          state: 'Rajasthan',       aliases: ['jaipur', 'jaipurr', 'jaypur', 'jaipr'] },
  { city: 'Jodhpur',         state: 'Rajasthan',       aliases: ['jodhpur', 'jodhpurr', 'jodhpure'] },
  { city: 'Udaipur',         state: 'Rajasthan',       aliases: ['udaipur', 'udaypur', 'udaipurr'] },
  { city: 'Kota',            state: 'Rajasthan',       aliases: ['kota', 'kotah'] },
  // Uttar Pradesh
  { city: 'Lucknow',         state: 'Uttar Pradesh',  aliases: ['lucknow', 'lukhnow', 'luckhnow', 'lacknow'] },
  { city: 'Kanpur',          state: 'Uttar Pradesh',  aliases: ['kanpur', 'cawnpore', 'kanpurr', 'kaanpur'] },
  { city: 'Agra',            state: 'Uttar Pradesh',  aliases: ['agra', 'agra', 'agr'] },
  { city: 'Varanasi',        state: 'Uttar Pradesh',  aliases: ['varanasi', 'banaras', 'benares', 'kashi', 'varansi'] },
  { city: 'Allahabad',       state: 'Uttar Pradesh',  aliases: ['allahabad', 'prayagraj', 'prayag', 'ilahabad'] },
  { city: 'Meerut',          state: 'Uttar Pradesh',  aliases: ['meerut', 'merrut', 'merut'] },
  { city: 'Mathura',         state: 'Uttar Pradesh',  aliases: ['mathura', 'mathuraa', 'mathura'] },
  // Madhya Pradesh
  { city: 'Bhopal',          state: 'Madhya Pradesh', aliases: ['bhopal', 'bhopalh', 'bhopaal'] },
  { city: 'Indore',          state: 'Madhya Pradesh', aliases: ['indore', 'indor', 'indoree'] },
  { city: 'Jabalpur',        state: 'Madhya Pradesh', aliases: ['jabalpur', 'jubbulpore', 'jabalpurr'] },
  // Bihar
  { city: 'Patna',           state: 'Bihar',           aliases: ['patna', 'paatna', 'patana'] },
  // Punjab
  { city: 'Amritsar',        state: 'Punjab',          aliases: ['amritsar', 'amritsarr', 'amritsar', 'amritsar'] },
  { city: 'Ludhiana',        state: 'Punjab',          aliases: ['ludhiana', 'ludhiaana', 'ludhana'] },
  { city: 'Chandigarh',      state: 'Punjab',          aliases: ['chandigarh', 'chandigad', 'chandighar'] },
  // Andhra Pradesh
  { city: 'Visakhapatnam',   state: 'Andhra Pradesh',  aliases: ['visakhapatnam', 'vizag', 'vishakhapatnam', 'vishag'] },
  { city: 'Vijayawada',      state: 'Andhra Pradesh',  aliases: ['vijayawada', 'vijayawadaa', 'bezawada'] },
  // Odisha
  { city: 'Bhubaneswar',     state: 'Odisha',          aliases: ['bhubaneswar', 'bhubaneshwar', 'bhubneshwar', 'bbsr'] },
  // Jharkhand
  { city: 'Ranchi',          state: 'Jharkhand',       aliases: ['ranchi', 'ranchee', 'raanchi'] },
  // Chhattisgarh
  { city: 'Raipur',          state: 'Chhattisgarh',    aliases: ['raipur', 'raipurr', 'raaipur'] },
  // Assam
  { city: 'Guwahati',        state: 'Assam',           aliases: ['guwahati', 'gauhati', 'guwahti'] },
  // Kerala
  { city: 'Kochi',           state: 'Kerala',          aliases: ['kochi', 'cochin', 'kochee'] },
  { city: 'Thiruvananthapuram', state: 'Kerala',       aliases: ['thiruvananthapuram', 'trivandrum', 'trivandrum'] },
  // Uttarakhand
  { city: 'Dehradun',        state: 'Uttarakhand',     aliases: ['dehradun', 'dehraadun', 'dehradoon'] },
  // Himachal Pradesh
  { city: 'Shimla',          state: 'Himachal Pradesh',aliases: ['shimla', 'simla', 'shimla'] },
];

// ── Resolve location from text ────────────────────────────────
function resolveLocation(text: string): { city?: string; state?: string } | null {
  // Split text into tokens (words) for fuzzy matching
  const words = text.split(/\s+/).filter(w => w.length >= 3);
  const bigrams = words.map((w, i) => words[i + 1] ? `${w} ${words[i + 1]}` : null).filter(Boolean) as string[];
  const trigrams = words.map((w, i) => words[i + 1] && words[i + 2] ? `${w} ${words[i + 1]} ${words[i + 2]}` : null).filter(Boolean) as string[];
  const tokens = [...trigrams, ...bigrams, ...words];

  // 1. Try exact/fuzzy city match first (cities give us both city + state)
  for (const token of tokens) {
    for (const entry of CITY_LIST) {
      // Exact match on any alias
      if (entry.aliases.includes(token)) {
        return { city: entry.city, state: entry.state };
      }
      // Fuzzy match (1 edit distance for short words, 2 for long)
      const maxDist = token.length <= 5 ? 1 : 2;
      if (entry.aliases.some(a => levenshtein(a, token) <= maxDist)) {
        return { city: entry.city, state: entry.state };
      }
    }
  }

  // 2. Try state match (only state, no city)
  for (const token of tokens) {
    for (const entry of STATE_LIST) {
      if (entry.aliases.includes(token)) {
        return { state: entry.name };
      }
      const maxDist = token.length <= 4 ? 1 : 2;
      if (entry.aliases.some(a => levenshtein(a, token) <= maxDist)) {
        return { state: entry.name };
      }
    }
  }

  return null;
}

// ── Main Extractor ────────────────────────────────────────────

export function extractProfileUpdates(
  text: string,
  currentProfile: CitizenProfile,
): Partial<CitizenProfile> {
  const updates: Partial<CitizenProfile> = {};
  const lower = text.toLowerCase().trim();

  // ── INCOME (must run BEFORE age to record income number positions) ──
  // Matches all variants:
  // "6 lakh", "6 lakhs", "6 laks", "6 lacs", "6 lac", "6l",
  // "₹6 lakh", "Rs. 6 lakhs", "6.5 lakh", "income is 600000"
  const incomeLakh = lower.match(
    /(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|laks?|laakh?s?)\b/,
  );
  const incomeRaw = lower.match(
    /(?:₹|rs\.?|rupees?|income\s*(?:of|is|:)?|earning(?:s)?(?:\s*(?:of|is)?)?|salary\s*(?:of|is)?|annual\s*(?:income\s*)?(?:of|is)?)\s*(\d{5,9})\b/,
  );

  const incomeNumberPositions = new Set<number>();

  if (incomeLakh?.[1]) {
    updates.annualIncome = Math.round(parseFloat(incomeLakh[1]) * 100000);
    const idx = lower.indexOf(incomeLakh[1]);
    if (idx >= 0) incomeNumberPositions.add(idx);
  } else if (incomeRaw?.[1]) {
    updates.annualIncome = parseInt(incomeRaw[1], 10);
    const idx = lower.indexOf(incomeRaw[1]);
    if (idx >= 0) incomeNumberPositions.add(idx);
  }

  // ── AGE ──────────────────────────────────────────────────────
  const agePatterns: RegExp[] = [
    /\b(?:i\s*am|i'm|i\s*'m|iam|am)\s+(?:a\s+)?(\d{1,3})\s*(?:-?\s*year(?:s)?\s*(?:old)?|yrs?\s*(?:old)?)?/i,
    /\b(?:my\s+)?age\s*(?:is|:|=|are|was)?\s*(\d{1,3})\b/i,
    /\b(\d{1,3})\s*-?\s*year(?:s)?\s*(?:old)?\b/i,
    /\b(\d{1,3})\s+years?\s+old\b/i,
    /\bactually[,\s]+(?:i\s*am|i'm|iam)\s+(\d{1,3})\b/i,
    /\bchange\s+(?:my\s+)?age\s+to\s+(\d{1,3})\b/i,
    /\bnow\s+(?:i\s*am|i'm)\s+(\d{1,3})\b/i,
  ];

  for (const pattern of agePatterns) {
    const m = lower.match(pattern);
    if (m?.[1]) {
      const candidateAge = parseInt(m[1], 10);
      const candidatePos = lower.indexOf(m[1]);
      if (candidateAge < 5 || candidateAge > 100) continue;
      if (incomeNumberPositions.has(candidatePos)) continue;
      const afterNum = lower.slice(candidatePos + m[1].length).trimStart();
      if (/^(?:lakhs?|lacs?|laks?|cr|crore)/.test(afterNum)) continue;
      updates.age = candidateAge;
      break;
    }
  }

  // ── GENDER ───────────────────────────────────────────────────
  if (/\b(?:female|woman|women|girl|she|her)\b/.test(lower)) {
    updates.gender = 'Female';
  } else if (/\b(?:male|man|men|boy|he|him)\b/.test(lower)) {
    updates.gender = 'Male';
  }

  // ── OCCUPATION ────────────────────────────────────────────────
  if (/\b(?:student|studying|study|college|school|btech|mtech|graduation|degree)\b/.test(lower)) {
    updates.occupation = 'Student';
  } else if (/\bfarmer|kisan|agriculture|farming\b/.test(lower)) {
    updates.occupation = 'Farmer';
  } else if (/\b(?:salaried|employed|working|job|office|employee|staff|professional)\b/.test(lower)) {
    updates.occupation = 'Employed';
  } else if (/\bunemployed|no job|jobless|looking for work\b/.test(lower)) {
    updates.occupation = 'Unemployed';
  } else if (/\bretired|pensioner|ex-serviceman\b/.test(lower)) {
    updates.occupation = 'Retired';
  } else if (/\bself.?employed|business|entrepreneur|shop|vendor\b/.test(lower)) {
    updates.occupation = 'Self-Employed';
  }

  // ── LOCATION (city + state, with fuzzy matching) ──────────────
  // IMPORTANT: Only run when there is an explicit location trigger word.
  // Without a trigger, common English words like "income" can fuzzy-match
  // city names (e.g. "income" → "indore" with distance 2).
  const locationTriggerMatch = lower.match(
    /\b(?:from|live in|living in|stay in|staying in|located in|native of|belong to|i am from|moved to|shifting to|shifted to|i belong to|my city is|my town is|my place is|i'm from|i am in)\b(.*)/,
  );

  if (locationTriggerMatch) {
    // Only search the SUBSTRING after the trigger, not the whole sentence
    const locationSubstring = locationTriggerMatch[1].trim();
    if (locationSubstring.length > 0) {
      const location = resolveLocation(locationSubstring);
      if (location) {
        if (location.city) updates.district = location.city;
        if (location.state) updates.state = location.state;
      }
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
  } else if (/\bgeneral|open category\b/.test(lower)) {
    updates.category = 'General';
  }

  // ── DISABILITY ────────────────────────────────────────────────
  if (/\b(?:disabled|disability|differently.?abled|handicapped|pwd|divyang)\b/.test(lower)) {
    updates.disability = 'Physical';
  }

  // ── EDUCATION ─────────────────────────────────────────────────
  if (/\b(?:btech|b\.tech|b tech|bachelor of tech|be|b\.e)\b/.test(lower)) {
    updates.education = 'B.Tech';
  } else if (/\b(?:bsc|b\.sc|bachelor of science)\b/.test(lower)) {
    updates.education = 'B.Sc';
  } else if (/\b(?:ba|b\.a|bachelor of arts)\b/.test(lower)) {
    updates.education = 'B.A';
  } else if (/\b(?:mtech|m\.tech|master of tech)\b/.test(lower)) {
    updates.education = 'M.Tech';
  } else if (/\b(?:mba|master of business|pgdm)\b/.test(lower)) {
    updates.education = 'MBA';
  } else if (/\b(?:msc|m\.sc|masters)\b/.test(lower)) {
    updates.education = 'M.Sc';
  } else if (/\b(?:12th|class 12|hsc|intermediate|plus two|12|higher secondary)\b/.test(lower)) {
    updates.education = '12th';
  } else if (/\b(?:10th|class 10|ssc|matriculation|matric|class ten)\b/.test(lower)) {
    updates.education = '10th';
  } else if (/\bdiploma\b/.test(lower)) {
    updates.education = 'Diploma';
  } else if (/\b(?:phd|ph\.d|doctorate)\b/.test(lower)) {
    updates.education = 'PhD';
  }

  // ── LIFE EVENTS ───────────────────────────────────────────────
  const lifeEventsSet = new Set(currentProfile.lifeEvents || []);
  if (/\b(?:lost job|lost my job|laid off|retrenchment|fired)\b/.test(lower)) lifeEventsSet.add('job_loss');
  if (/\b(?:crop damage|flood|drought|pest attack)\b/.test(lower)) lifeEventsSet.add('crop_damage');
  if (/\b(?:new baby|pregnant|expecting|newborn)\b/.test(lower)) lifeEventsSet.add('new_child');
  if (/\b(?:father passed|husband died|widow|widower|death in family)\b/.test(lower)) lifeEventsSet.add('family_death');
  if (/\b(?:starting college|joining college|got admission|new admission)\b/.test(lower)) lifeEventsSet.add('new_student');
  if (/\b(?:retired|taking pension)\b/.test(lower)) lifeEventsSet.add('retirement');

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
          if (rule && rule.field !== 'document') missingFields.add(rule.field);
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
    return 'Which state or city do you live in?';

  const firstMissing = Array.from(missingFields)[0];
  return `Could you please provide information about your ${firstMissing}?`;
}
