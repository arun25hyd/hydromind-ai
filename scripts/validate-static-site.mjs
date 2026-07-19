import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('/Users/Apple/Documents/HydroMind-Website/Web');

const pageMap = new Map([
  ['https://www.hydromindai.com/', 'index.html'],
  ['https://www.hydromindai.com/ai_advisor.html', 'ai_advisor.html'],
  ['https://www.hydromindai.com/crane_diagnostic.html', 'crane_diagnostic.html'],
  ['https://www.hydromindai.com/system_design.html', 'system_design.html'],
  ['https://www.hydromindai.com/knowledge_base.html', 'knowledge_base.html'],
  ['https://www.hydromindai.com/pricing.html', 'pricing.html'],
  ['https://www.hydromindai.com/feedback.html', 'feedback.html'],
  ['https://www.hydromindai.com/privacy.html', 'pages/privacy.html'],
  ['https://www.hydromindai.com/disclaimer.html', 'disclaimer.html'],
  ['https://www.hydromindai.com/circuit_walkthrough.html', 'circuit_walkthrough.html'],
]);

const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const brokenRefs = [];

for (const file of htmlFiles) {
  const absoluteFile = path.join(root, file);
  const content = fs.readFileSync(absoluteFile, 'utf8');
  const refPattern = /(?:href|src)=["']([^"'#?]+)["']/g;
  let match;

  while ((match = refPattern.exec(content))) {
    const ref = match[1];

    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) {
      continue;
    }

    const target = ref.startsWith('/')
      ? path.join(root, ref.replace(/^\//, ''))
      : path.join(path.dirname(absoluteFile), ref);

    if (!fs.existsSync(target)) {
      brokenRefs.push(`${file} -> ${ref}`);
    }
  }
}

if (brokenRefs.length > 0) {
  console.error('Broken local references found:');
  for (const ref of brokenRefs) {
    console.error(`- ${ref}`);
  }
  process.exit(1);
}

const sitemapPath = path.join(root, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlPattern = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
const sitemapIssues = [];
let entry;

while ((entry = urlPattern.exec(sitemap))) {
  const [, url, lastmod] = entry;
  const mappedFile = pageMap.get(url);

  if (!mappedFile) {
    sitemapIssues.push(`Unmapped sitemap URL: ${url}`);
    continue;
  }

  const filePath = path.join(root, mappedFile);
  if (!fs.existsSync(filePath)) {
    sitemapIssues.push(`Sitemap target missing on disk: ${mappedFile}`);
    continue;
  }

  const mtime = fs.statSync(filePath).mtime.toISOString().slice(0, 10);
  if (lastmod !== mtime) {
    sitemapIssues.push(`${mappedFile} lastmod ${lastmod} does not match file mtime ${mtime}`);
  }
}

if (sitemapIssues.length > 0) {
  console.error('Sitemap issues found:');
  for (const issue of sitemapIssues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, local references, and sitemap freshness.`);
