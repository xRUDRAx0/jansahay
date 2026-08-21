import { RankedSchemeMatch, SchemeCategory, EligibilityResult } from '@/types/engine';

export interface DashboardReadiness {
  categoryStacks: Record<SchemeCategory, RankedSchemeMatch[]>;
  topAction: {
    title: string;
    description: string;
    document?: string;
    unlockedSchemes: string[];
  } | null;
}

export function computeDashboardReadiness(matches: RankedSchemeMatch[]): DashboardReadiness {
  // 1. Group by category
  const categoryStacks = {} as Record<SchemeCategory, RankedSchemeMatch[]>;
  for (const match of matches) {
    if (!categoryStacks[match.scheme.category]) {
      categoryStacks[match.scheme.category] = [];
    }
    categoryStacks[match.scheme.category].push(match);
  }

  // 2. Compute highest impact action (most frequently missing critical document)
  const missingDocsMap = new Map<string, string[]>(); // Doc Name -> Scheme Names
  
  for (const match of matches) {
    // Only care if missing this doc is preventing eligibility
    if (match.tier === 'missing_info' || match.tier === 'medium') {
      const missingDocs = match.eligibility.missingDocuments;
      for (const doc of missingDocs) {
        if (!missingDocsMap.has(doc)) missingDocsMap.set(doc, []);
        missingDocsMap.get(doc)!.push(match.scheme.name);
      }
    }
  }

  let topAction = null;
  let maxImpact = 0;
  
  for (const [doc, schemes] of missingDocsMap.entries()) {
    if (schemes.length > maxImpact) {
      maxImpact = schemes.length;
      topAction = {
        title: `Upload ${doc}`,
        description: `This document is required to complete your profile and calculate full eligibility.`,
        document: doc,
        unlockedSchemes: schemes
      };
    }
  }

  return { categoryStacks, topAction };
}
