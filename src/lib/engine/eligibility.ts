import { 
  CitizenProfile, 
  Scheme, 
  EligibilityResult, 
  CriterionResult, 
  CriterionStatus,
  EligibilityVerdict,
  UNKNOWN
} from '@/types/engine';

export function formatProfileValue(field: keyof CitizenProfile | 'document', value: any): string {
  if (value === UNKNOWN) return 'Not provided';
  if (value === undefined || value === null) return 'Not provided';
  if (field === 'annualIncome' && typeof value === 'number') {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  }
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export function evaluateEligibility(profile: CitizenProfile, scheme: Scheme): EligibilityResult {
  const criteriaResults: CriterionResult[] = [];
  let passedCount = 0;
  let failedCount = 0;
  let unknownCount = 0;
  let verificationCount = 0;
  const missingDocuments: string[] = [];
  const availableDocuments: string[] = [];

  for (const rule of scheme.eligibilityRules) {
    let status: CriterionStatus = 'UNKNOWN';
    let profileValueStr = 'Not provided';
    let explanation = '';

    if (rule.field === 'document') {
      const docId = rule.documentId;
      if (!docId) {
        status = 'PASS';
      } else if (profile.availableDocuments && profile.availableDocuments.includes(docId)) {
        status = 'PASS';
        availableDocuments.push(docId);
        profileValueStr = 'Document available';
        explanation = `You have the required document: ${rule.label}`;
      } else if (!profile.availableDocuments || profile.availableDocuments.length === 0 || (profile as any).availableDocuments === UNKNOWN) {
        status = 'NEEDS_VERIFICATION';
        missingDocuments.push(docId);
        profileValueStr = 'Not provided';
        explanation = `Document availability unknown for ${rule.label}`;
      } else {
        status = 'FAIL';
        missingDocuments.push(docId);
        profileValueStr = 'Document missing';
        explanation = `You are missing the required document: ${rule.label}`;
      }
    } else {
      const profileValue = profile[rule.field];
      profileValueStr = formatProfileValue(rule.field, profileValue);

      if (profileValue === UNKNOWN || profileValue === undefined || profileValue === null) {
        status = rule.critical ? 'UNKNOWN' : 'NEEDS_VERIFICATION';
        explanation = `${rule.label} not provided`;
      } else {
        let passed = false;
        switch (rule.operator) {
          case 'eq': passed = profileValue === rule.value; break;
          case 'neq': passed = profileValue !== rule.value; break;
          case 'lt': passed = (profileValue as number) < (rule.value as number); break;
          case 'lte': passed = (profileValue as number) <= (rule.value as number); break;
          case 'gt': passed = (profileValue as number) > (rule.value as number); break;
          case 'gte': passed = (profileValue as number) >= (rule.value as number); break;
          case 'between':
            if (Array.isArray(rule.value) && rule.value.length === 2) {
              const pv = profileValue as number;
              passed = pv >= (rule.value[0] as number) && pv <= (rule.value[1] as number);
            }
            break;
          case 'in':
            if (Array.isArray(rule.value)) {
              passed = (rule.value as any[]).includes(profileValue);
            }
            break;
          case 'contains':
            if (Array.isArray(profileValue)) {
              passed = (profileValue as any[]).includes(rule.value);
            }
            break;
          case 'any':
            passed = true;
            break;
        }

        status = passed ? 'PASS' : 'FAIL';
        if (passed) {
          explanation = `Your ${rule.label.toLowerCase()} meets the requirement`;
        } else {
          explanation = `Your ${rule.label.toLowerCase()} does not meet the requirement`;
        }
      }
    }

    if (status === 'PASS') passedCount++;
    else if (status === 'FAIL') failedCount++;
    else if (status === 'UNKNOWN') unknownCount++;
    else if (status === 'NEEDS_VERIFICATION') verificationCount++;

    criteriaResults.push({
      ruleId: rule.id,
      label: rule.label,
      description: rule.description,
      status,
      profileValue: profileValueStr,
      requiredValue: rule.label,
      explanation
    });
  }

  let verdict: EligibilityVerdict = 'ELIGIBLE';
  if (failedCount > 0) {
    verdict = 'NOT_ELIGIBLE';
  } else if (unknownCount > 0) {
    verdict = 'MISSING_INFORMATION';
  } else if (verificationCount > 0) {
    verdict = 'NEEDS_VERIFICATION';
  }

  const totalCriteria = scheme.eligibilityRules.length;
  const readinessScore = totalCriteria > 0 ? (passedCount / totalCriteria) * 100 : 100;

  let explanation = '';
  if (verdict === 'ELIGIBLE') explanation = 'You meet all criteria based on current information.';
  else if (verdict === 'NOT_ELIGIBLE') explanation = `You do not meet ${failedCount} requirement(s).`;
  else if (verdict === 'MISSING_INFORMATION') explanation = `Missing information for ${unknownCount} requirement(s).`;
  else if (verdict === 'NEEDS_VERIFICATION') explanation = `Need to verify ${verificationCount} requirement(s).`;

  return {
    schemeId: scheme.id,
    verdict,
    readinessScore,
    criteriaResults,
    passedCount,
    failedCount,
    unknownCount,
    verificationCount,
    missingDocuments,
    availableDocuments,
    explanation,
    disclaimer: 'This is an estimated eligibility check. Official verification may be required.'
  };
}
