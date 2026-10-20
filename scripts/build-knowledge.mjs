// Builds the digital twin's knowledge base: everything it is allowed to talk about.
// Sources: src/data/resume.yaml, published case studies in src/content/work/, and
// the verified Q&A in src/data/twin/qa.md. Output: twin/knowledge.json.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8');

const resume = parse(read('src/data/resume.yaml'));
const { basics } = resume;

function resumeText() {
  const lines = [
    `Name: ${basics.name} (goes by ${basics.shortName ?? basics.name})`,
    `Headline: ${basics.headline}, ${basics.years} of experience, based in ${basics.location}`,
    `Email: ${basics.email}`,
    ...basics.socials.map((s) => `${s.label}: ${s.url}`),
    `Focus areas: ${basics.focus.map((f) => f.label).join(', ')}`,
    `Summary: ${basics.intro}`,
    '',
    'About me:',
    ...resume.about.map((p) => `- ${p.trim()}`),
    '',
    'Experience:',
  ];
  for (const job of resume.experience) {
    lines.push(`### ${job.role}, ${job.company} (${job.start} – ${job.end}${job.location ? `, ${job.location}` : ''})`);
    if (job.domain) lines.push(`Domain: ${job.domain}`);
    if (job.summary) lines.push(job.summary);
    for (const h of job.highlights ?? []) lines.push(`- ${h}`);
    lines.push('');
  }
  lines.push('Education:');
  for (const e of resume.education) lines.push(`- ${e.degree}, ${e.school} (${e.start} – ${e.end})`);
  lines.push('', 'Skills:');
  for (const s of resume.skills) lines.push(`- ${s.group}: ${s.items.join(', ')}`);
  lines.push('', 'Certifications:');
  for (const c of resume.certifications) lines.push(`- ${c.name} (${c.issuer}, ${c.year})`);
  return lines.join('\n');
}

function caseStudies() {
  const dir = 'src/content/work/';
  return readdirSync(root + dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const [, fm, body] = read(dir + file).match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      const data = parse(fm);
      return { slug: file.replace(/\.md$/, ''), data, body: body.trim() };
    })
    .filter(({ data }) => !data.draft)
    .map(({ slug, data, body }) => {
      const facts = [
        `## ${data.title}`,
        `Link: /work/${slug}/`,
        `Type: ${data.category === 'personal' ? 'Personal project' : 'Career project'}`,
        data.company && `Company: ${data.company}`,
        data.role && `My role: ${data.role}`,
        data.impact && `Impact: ${data.impact}`,
        `Summary: ${data.summary}`,
        data.tags?.length && `Tags: ${data.tags.join(', ')}`,
        data.links?.live && `Live app: ${data.links.live}`,
        ...(data.decisions ?? []).map((d) => `Decision (${d.area}): chose ${d.chose} over ${d.over}; trade-off: ${d.tradeoff}`),
        ...(data.next ?? []).map((n) => `Next: ${n}`),
        '',
        // Drop embedded components and HTML; keep the prose.
        body.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n'),
      ];
      return facts.filter(Boolean).join('\n');
    })
    .join('\n\n');
}

// Strip the file's own comment header; keep the Q&A.
const qa = read('src/data/twin/qa.md').replace(/^(#(?!#).*\n)+/, '').trim();

const knowledge = {
  name: basics.name,
  shortName: basics.shortName ?? basics.name,
  email: basics.email,
  text: [
    '<resume>', resumeText(), '</resume>',
    '<case_studies>', caseStudies(), '</case_studies>',
    '<interview_answers>', qa, '</interview_answers>',
  ].join('\n'),
};

writeFileSync(root + 'twin/knowledge.json', JSON.stringify(knowledge, null, 1) + '\n');
console.log(`Twin knowledge: ${knowledge.text.length.toLocaleString()} chars -> twin/knowledge.json`);
