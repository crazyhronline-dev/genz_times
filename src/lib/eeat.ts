import { BlogPost, GadgetSpecs, Author } from '@/types/blog';

export interface EeatMetric {
  category: 'Experience' | 'Expertise' | 'Authoritativeness' | 'Trustworthiness';
  score: number; // 0 to 25
  label: string;
  passed: boolean;
  explanation: string;
  recommendation?: string;
}

export interface EeatAuditResult {
  overallScore: number; // 0 to 100
  grade: 'A+ (Search Engine Elite)' | 'A (Highly Trustworthy)' | 'B (Solid E-E-A-T)' | 'C (Needs Empirical Testing)';
  experienceScore: number; // 0 to 25
  expertiseScore: number; // 0 to 25
  authorityScore: number; // 0 to 25
  trustScore: number; // 0 to 25
  metrics: EeatMetric[];
  badgeVerified: boolean;
  keyStrengths: string[];
  actionableImprovements: string[];
}

export function evaluateEeat(params: {
  title: string;
  content: string;
  authorName?: string;
  authorBio?: string;
  specs?: GadgetSpecs;
  pros?: string[];
  cons?: string[];
  verdictScore?: number;
}): EeatAuditResult {
  const {
    title = '',
    content = '',
    authorName = '',
    authorBio = '',
    specs = {},
    pros = [],
    cons = [],
    verdictScore = 9.0,
  } = params;

  const text = (title + ' ' + content).toLowerCase();
  const metrics: EeatMetric[] = [];
  const keyStrengths: string[] = [];
  const actionableImprovements: string[] = [];

  // ==========================================
  // 1. EXPERIENCE (First-Hand Testing Proofs)
  // Max: 25 pts
  // ==========================================
  const experienceTerms = [
    'hands-on', 'in our hands', 'tested for', 'unboxed', 'daily driver', 'carried daily', 
    'wear', 'wearing', 'ergonomic', 'grip', 'tactile', 'in the pocket', 'real-world', 
    'battery test', 'hours of use', 'living with'
  ];
  const matchedExpTerms = experienceTerms.filter((term) => text.includes(term));
  const hasHandsOnProof = matchedExpTerms.length >= 3;
  const hasUsageDuration = /\b(\d+\s*(days|weeks|hours|months))\b/i.test(text);

  let expPoints = 0;
  if (hasHandsOnProof) expPoints += 14;
  else expPoints += Math.min(10, matchedExpTerms.length * 3);
  if (hasUsageDuration) expPoints += 11;
  else expPoints += 4;
  expPoints = Math.min(25, expPoints);

  metrics.push({
    category: 'Experience',
    score: expPoints,
    label: 'First-Hand Hardware Interaction Proof',
    passed: expPoints >= 18,
    explanation: hasHandsOnProof
      ? `Strong physical testing indicators detected (${matchedExpTerms.length} verified usage terms).`
      : 'Limited evidence of physical hands-on testing.',
    recommendation: !hasHandsOnProof ? 'Include terms describing physical grip, weight distribution, or real day-to-day carrying experience.' : undefined,
  });

  if (expPoints >= 18) keyStrengths.push('Documented first-hand physical hardware testing & daily wear trials.');
  else actionableImprovements.push('Add specific testing duration (e.g. "tested across 14 consecutive days").');

  // ==========================================
  // 2. EXPERTISE (Engineering Units & Technical Depth)
  // Max: 25 pts
  // ==========================================
  const techUnits = [
    'ghz', 'mhz', 'nits', 'db', 'mah', 'wh', 'tops', 'fps', 'ms', 'delta-e', 
    'gb/s', 'nm', 'cores', 'oled', 'amoled', 'hdr', 'prores', 'snapdragon', 
    'silicon', 'benchmark', 'geekbench', 'cinebench', '3dmark'
  ];
  const matchedUnits = techUnits.filter((u) => new RegExp(`\\b${u}\\b`, 'i').test(text));
  const hasDeepSpecs = Object.values(specs).filter(Boolean).length >= 4;
  const hasQualifiedAuthor = Boolean(authorBio && authorBio.length > 30);

  let expExpertise = 0;
  if (matchedUnits.length >= 6) expExpertise += 12;
  else expExpertise += Math.min(10, matchedUnits.length * 2);
  if (hasDeepSpecs) expExpertise += 8;
  else expExpertise += 3;
  if (hasQualifiedAuthor) expExpertise += 5;
  expExpertise = Math.min(25, expExpertise);

  metrics.push({
    category: 'Expertise',
    score: expExpertise,
    label: 'Quantitative Benchmarks & Silicon Depth',
    passed: expExpertise >= 18,
    explanation: `Found ${matchedUnits.length} calibrated engineering metric citations and detailed hardware specifications.`,
    recommendation: matchedUnits.length < 5 ? 'Quote specific numeric benchmark scores, display nit values, or thermal degrees.' : undefined,
  });

  if (expExpertise >= 18) keyStrengths.push('Rigorous quantitative benchmarking with calibrated engineering metrics.');
  else actionableImprovements.push('Incorporate synthetic compute scores (e.g. Geekbench or battery watt hours).');

  // ==========================================
  // 3. AUTHORITATIVENESS (Comparative & Contextual)
  // Max: 25 pts
  // ==========================================
  const comparisonTerms = ['compared to', 'versus', 'vs', 'predecessor', 'generation', 'rival', 'alternative', 'upgrade'];
  const hasComparisons = comparisonTerms.some((term) => text.includes(term));
  const hasHeadings = /##\s+|###\s+/.test(content);
  const hasSubstantialLength = content.split(/\s+/).length >= 350;

  let authPoints = 0;
  if (hasComparisons) authPoints += 10;
  if (hasHeadings) authPoints += 8;
  if (hasSubstantialLength) authPoints += 7;
  authPoints = Math.min(25, authPoints);

  metrics.push({
    category: 'Authoritativeness',
    score: authPoints,
    label: 'Comparative Industry Context & Depth',
    passed: authPoints >= 18,
    explanation: hasComparisons
      ? 'Contextualizes the device against predecessors and competing category alternatives.'
      : 'Lacks comparison to market alternatives or previous generation hardware.',
    recommendation: !hasComparisons ? 'Compare the device directly to previous generation models or chief category competitors.' : undefined,
  });

  if (authPoints >= 18) keyStrengths.push('Solid contextual comparisons against predecessor devices and rival alternatives.');
  else actionableImprovements.push('Add comparative benchmark notes against competitor flagships.');

  // ==========================================
  // 4. TRUSTWORTHINESS (Balance & Consumer Transparency)
  // Max: 25 pts
  // ==========================================
  const hasPros = (pros || []).length >= 2;
  const hasCons = (cons || []).length >= 1;
  const hasPrice = Boolean(specs.price || text.includes('$') || text.includes('price'));
  const hasBalancedCritique = hasPros && hasCons;

  let trustPoints = 0;
  if (hasBalancedCritique) trustPoints += 12;
  else if (hasPros) trustPoints += 5;
  if (hasCons) trustPoints += 5; // Google explicitly rewards critical drawbacks
  if (hasPrice) trustPoints += 8;
  trustPoints = Math.min(25, trustPoints);

  metrics.push({
    category: 'Trustworthiness',
    score: trustPoints,
    label: 'Editorial Balance & Drawbacks Transparency',
    passed: trustPoints >= 18,
    explanation: hasBalancedCritique
      ? `Transparently reports ${pros.length} strengths and ${cons.length} genuine drawbacks/limitations.`
      : 'Missing explicit drawbacks (pros-only reviews look promotional to Google).',
    recommendation: !hasCons ? 'Google Search Quality Guidelines mandate documenting genuine product flaws and cons.' : undefined,
  });

  if (hasBalancedCritique) keyStrengths.push('Transparent, unbiased evaluation with documented drawbacks and pricing.');
  else actionableImprovements.push('Document at least 1-2 realistic product limitations or drawbacks.');

  // ==========================================
  // Total E-E-A-T Score
  // ==========================================
  const overallScore = Math.min(100, Math.round(expPoints + expExpertise + authPoints + trustPoints));

  let grade: EeatAuditResult['grade'] = 'A+ (Search Engine Elite)';
  if (overallScore < 60) grade = 'C (Needs Empirical Testing)';
  else if (overallScore < 78) grade = 'B (Solid E-E-A-T)';
  else if (overallScore < 90) grade = 'A (Highly Trustworthy)';

  return {
    overallScore,
    grade,
    experienceScore: expPoints,
    expertiseScore: expExpertise,
    authorityScore: authPoints,
    trustScore: trustPoints,
    metrics,
    badgeVerified: overallScore >= 75,
    keyStrengths,
    actionableImprovements,
  };
}
