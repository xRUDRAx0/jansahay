import { CitizenProfile, Scheme, RankedSchemeMatch, MatchTier } from '@/types/engine';
import { evaluateEligibility } from './eligibility';
import { schemeDb } from '@/lib/schemes/db';

export function rankSchemes(profile: CitizenProfile, schemes: Scheme[] = schemeDb): RankedSchemeMatch[] {
  const matches: RankedSchemeMatch[] = schemes.map(scheme => {
    const eligibility = evaluateEligibility(profile, scheme);
    const { verdict, readinessScore, passedCount } = eligibility;
    const totalCriteria = scheme.eligibilityRules.length;

    let tier: MatchTier = 'low';
    if (verdict === 'ELIGIBLE' && readinessScore >= 80) {
      tier = 'high';
    } else if ((verdict === 'ELIGIBLE' || verdict === 'NEEDS_VERIFICATION') && readinessScore >= 60) {
      tier = 'medium';
    } else if (verdict === 'MISSING_INFORMATION' && readinessScore >= 40) {
      tier = 'missing_info';
    } else if (verdict === 'NOT_ELIGIBLE') {
      tier = 'not_eligible';
    }

    return {
      scheme,
      eligibility,
      tier,
      displayScore: readinessScore,
      whyShown: `Shown because you match ${passedCount} of ${totalCriteria} criteria`
    };
  });

  const tierOrder: Record<MatchTier, number> = {
    high: 0,
    medium: 1,
    missing_info: 2,
    low: 3,
    not_eligible: 4
  };

  matches.sort((a, b) => {
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier];
    }
    return b.displayScore - a.displayScore;
  });

  return matches;
}

export function getTopMatches(profile: CitizenProfile, limit: number = 5): RankedSchemeMatch[] {
  const ranked = rankSchemes(profile);
  return ranked.filter(match => match.tier !== 'not_eligible').slice(0, limit);
}
