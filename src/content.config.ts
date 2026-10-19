import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per piece of work in src/content/work/.
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    type: z.enum(['case-study', 'code', 'design', 'writing', 'video']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Position among featured work on the home page (lowest first). */
    order: z.number().default(99),
    draft: z.boolean().default(false),
    /** Short label shown on the tile, e.g. "AI agents". */
    kind: z.string().optional(),
    /** Tabler icon name for the tile artwork, e.g. "robot". */
    icon: z.string().default('bulb'),
    tone: z.enum(['lavender', 'mustard']).default('lavender'),
    company: z.string().optional(),
    role: z.string().optional(),
    impact: z.string().optional(),
    links: z
      .object({
        live: z.url().optional(),
        repo: z.url().optional(),
        figma: z.url().optional(),
        video: z.url().optional(),
        slides: z.url().optional(),
      })
      .default({}),
    // Images live in public/images/; paths are relative to it, e.g. "checkout-1.png".
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  }),
});

export const collections = { work };
