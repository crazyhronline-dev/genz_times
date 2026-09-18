import { GadgetSpecs } from '@/types/blog';

export interface GeneratedSeoPackage {
  focusKeyword: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

/**
 * Automatically derives high-level, genuine, content-related keywords,
 * optimal Google Meta Title, and Meta Description from the article content.
 */
export function generateHighLevelSeo(params: {
  title: string;
  category?: string;
  content: string;
  specs?: GadgetSpecs;
  authorName?: string;
}): GeneratedSeoPackage {
  const { title = '', category = 'Tech Gadgets', content = '', specs = {} } = params;

  // 1. Clean the core device name from title
  // e.g. "Apple Vision Pro 2 In-Depth Review: The Spatial Computing Evolution" -> "Apple Vision Pro 2"
  const cleanTitle = title.split(/[:\-\–]/)[0].trim();
  const deviceName = cleanTitle || 'Tech Gadget';

  // 2. Derive genuine focus keyword based on search intent
  let focusKeyword = `${deviceName} review`;
  if (category.toLowerCase().includes('audio')) {
    focusKeyword = `${deviceName} review`;
  } else if (category.toLowerCase().includes('laptop')) {
    focusKeyword = `${deviceName} review`;
  }

  // 3. Extract genuine, content-related LSI keywords & tags
  const tagsSet = new Set<string>();

  // Add clean device name
  tagsSet.add(deviceName);

  // Add category
  tagsSet.add(category);

  // Add processor / silicon if available
  if (specs.processor) {
    const chipMatch = specs.processor.match(/(M[0-9]|Snapdragon|Ryzen|Intel|Oryon|QN[0-9]e?|Tensor|Exynos|Apple [A-Z0-9]+)/i);
    if (chipMatch) {
      tagsSet.add(chipMatch[0]);
    }
  }

  // Scan content for high-value technical terms
  const techTerms = [
    'Snapdragon', 'Apple Silicon', 'OLED', 'AMOLED', 'ANC', 'Spatial Audio', 
    'Micro-OLED', 'Battery Life', 'Noise Cancelling', '4K Video', 'ProMotion', 
    '120Hz', 'Ray Tracing', 'Fast Charging', 'Flagship', 'Hardware Benchmarks'
  ];

  for (const term of techTerms) {
    if (new RegExp(`\\b${term}\\b`, 'i').test(content) || new RegExp(`\\b${term}\\b`, 'i').test(title)) {
      tagsSet.add(term);
    }
  }

  tagsSet.add('GenZ Tech');
  tagsSet.add('Gen Z Reviews');
  tagsSet.add('Hardware Tests');
  tagsSet.add('GenZ Time Lab');

  const tags = Array.from(tagsSet).slice(0, 7);

  // 4. Generate High-CTR Meta Title (Optimal: 48-60 characters)
  // Pattern: [Device Name] Review: [Key Technical Advantage] | GenZ Time
  let keyBenefit = 'Lab Benchmarks & Specs';
  if (specs.processor && specs.processor.length < 25) {
    keyBenefit = `${specs.processor} Tested`;
  } else if (category.toLowerCase().includes('audio')) {
    keyBenefit = 'ANC & Acoustic Testing';
  } else if (category.toLowerCase().includes('smartphone')) {
    keyBenefit = 'Camera & Battery Benchmarks';
  } else if (category.toLowerCase().includes('laptop')) {
    keyBenefit = 'Performance & Thermals';
  }

  let metaTitle = `${deviceName} Review: ${keyBenefit} | GenZ Time`;
  if (metaTitle.length > 65) {
    metaTitle = `${deviceName} Review & Benchmarks | GenZ Time`;
  }
  if (metaTitle.length > 65) {
    metaTitle = `${deviceName} Review | GenZ Time`;
  }

  // 5. Generate High-CTR Meta Description (Optimal: 140-158 characters)
  // Must include: focus keyword + quantitative specs / lab findings + call to read
  let specSnippet = '';
  if (specs.processor && specs.battery) {
    specSnippet = `testing ${specs.processor}, ${specs.battery} battery endurance,`;
  } else if (specs.display) {
    specSnippet = `display colorimetry, ${specs.display},`;
  } else {
    specSnippet = 'thermals, battery benchmarks, and camera accuracy,';
  }

  let metaDescription = `In-depth ${deviceName} review: ${specSnippet} and full GenZ Time Lab score verdict tested hands-on by Sahil. Discover pros, cons, and performance.`.trim();

  // Fine-tune character length to be strictly between 135 and 160 characters
  if (metaDescription.length > 160) {
    metaDescription = `Comprehensive ${deviceName} review tested by Sahil: lab benchmarks, real-world battery tests, full specs sheet, and our independent GenZ Time verdict score.`;
  }
  if (metaDescription.length < 125) {
    metaDescription = `Hands-on ${deviceName} review tested by Sahil in the GenZ Time Lab: compute benchmarks, battery endurance rundown, pros, cons, and final verdict.`;
  }

  // 6. Generate Clean Semantic Slug
  const slug = deviceName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-review';

  return {
    focusKeyword,
    tags,
    metaTitle,
    metaDescription,
    slug,
  };
}
