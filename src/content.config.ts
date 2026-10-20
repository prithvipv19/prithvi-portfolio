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
    /** Site path to an interactive demo page, e.g. "work/overtime-module/demo/". */
    demo: z.string().optional(),
    /** Self-hosted walkthrough video; paths are relative to public/, e.g. "videos/x.mp4". */
    video: z
      .object({ src: z.string(), captions: z.string().optional(), poster: z.string().optional(), label: z.string().optional() })
      .optional(),
    /** Figma prototype share URL, shown as a click-to-load embed. */
    prototype: z.url().optional(),
    /** Steps of the end-to-end flow, drawn as a diagram under the facts box. */
    flow: z.array(z.object({ label: z.string(), note: z.string().optional() })).default([]),
    // Images live in public/images/; paths are relative to it, e.g. "checkout-1.png".
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }))
      .default([]),
    /** One line shown above the gallery, e.g. that screens are recreated. */
    galleryNote: z.string().optional(),
    /** Key decisions, drawn as chose/over/cost forks after the write-up. */
    decisions: z
      .array(
        z.object({
          area: z.string(),
          icon: z.string().optional(),
          chose: z.string(),
          over: z.string(),
          tradeoff: z.string(),
        }),
      )
      .default([]),
    /** Short follow-ups shown under the decisions. */
    next: z.array(z.string()).default([]),
  }),
});

export const collections = { work };
