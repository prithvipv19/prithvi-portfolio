import { getCollection, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;
export type WorkType = WorkEntry['data']['type'];

export const workTypes: { id: WorkType; label: string; plural: string }[] = [
  { id: 'case-study', label: 'Case study', plural: 'Case studies' },
  { id: 'code', label: 'Code', plural: 'Code' },
  { id: 'design', label: 'Design', plural: 'Design' },
  { id: 'writing', label: 'Writing & talks', plural: 'Writing & talks' },
  { id: 'video', label: 'Video', plural: 'Videos' },
];

export const typeLabel = (type: WorkType) => workTypes.find((t) => t.id === type)!.label;

/** Published work, newest first. */
export async function getWork() {
  const entries = await getCollection('work', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Prefix a path with the site's base URL (needed when hosted on a GitHub Pages repo subpath). */
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export const formatMonth = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Turn a YouTube or Vimeo page URL into a privacy-friendly embed URL. */
export function videoEmbedUrl(pageUrl: string): string | null {
  try {
    const u = new URL(pageUrl);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}?autoplay=1`;
    if (host.endsWith('youtube.com')) {
      const id = u.searchParams.get('v') ?? u.pathname.split('/').pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : null;
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : null;
    }
  } catch {}
  return null;
}
