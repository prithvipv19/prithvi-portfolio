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
    draft: z.boolean().default(false),
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
