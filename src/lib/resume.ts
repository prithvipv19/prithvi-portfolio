import { parse } from 'yaml';
import raw from '../data/resume.yaml?raw';

export interface Resume {
  basics: {
    name: string;
    /** Friendly first name used in greetings; falls back to name. */
    shortName?: string;
    headline: string;
    location?: string;
    email: string;
    intro: string;
    tagline: string;
    years: string;
    status?: string;
    photo?: string;
    photoAlt?: string;
    socials: { label: string; url: string }[];
    focus: { label: string; icon: string }[];
    stats: { value: number; prefix?: string; suffix?: string; label: string; icon: string }[];
    aboutLine?: string;
  };
  about: string[];
  experience: {
    company: string;
    role: string;
    start: string;
    end: string;
    location?: string;
    summary?: string;
    highlights: string[];
    short?: string;
    logo?: string;
    logoLarge?: boolean;
    domain?: string;
    icon?: string;
    highlight?: string;
  }[];
  education: {
    school: string;
    degree: string;
    start?: string | number;
    end: string | number;
    timeline?: { short: string; icon: string; highlight: string };
    /** Campus photo, relative to public/. */
    image?: string;
    imageAlt?: string;
  }[];
  skills: { group: string; items: string[] }[];
  certifications: { name: string; issuer: string; year: string | number }[];
}

export const resume = parse(raw) as Resume;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "Mar 2024" → 2024.17, "2017" → 2017, "Present" → today, as a fractional year. */
export function toYear(value: string | number | undefined): number {
  if (value === undefined) return NaN;
  const text = String(value).trim();
  if (/present|now/i.test(text)) {
    const d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  }
  const [a, b] = text.split(/\s+/);
  if (!b) return Number(a);
  return Number(b) + Math.max(0, MONTHS.indexOf(a.slice(0, 3).toLowerCase())) / 12;
}

export const yearOf = (value: string | number | undefined) => String(value ?? '').match(/\d{4}/)?.[0] ?? '';

export interface CareerStop {
  name: string;
  fullName: string;
  role: string;
  start: number;
  end: number;
  from: string;
  to: string;
  logo?: string;
  logoLarge?: boolean;
  domain: string;
  icon: string;
  highlight: string;
  kind: 'past' | 'now' | 'study';
}

/** Jobs plus timeline-flagged study, oldest first, for the career timeline. */
export function careerStops(): CareerStop[] {
  const jobs: CareerStop[] = resume.experience.map((e) => {
    const current = /present/i.test(e.end);
    return {
      name: e.short ?? e.company,
      fullName: e.company,
      role: e.role,
      start: toYear(e.start),
      end: toYear(e.end),
      from: yearOf(e.start),
      to: current ? 'now' : yearOf(e.end),
      logo: e.logo,
      logoLarge: e.logoLarge,
      domain: e.domain ?? '',
      icon: e.icon ?? 'briefcase',
      highlight: e.highlight ?? e.highlights[0] ?? '',
      kind: current ? 'now' : 'past',
    };
  });
  const study: CareerStop[] = resume.education
    .filter((e) => e.timeline)
    .map((e) => ({
      name: e.timeline!.short,
      fullName: e.school,
      role: e.degree,
      start: toYear(e.start),
      end: toYear(e.end),
      from: yearOf(e.start),
      to: yearOf(e.end),
      domain: 'Education',
      icon: e.timeline!.icon,
      highlight: e.timeline!.highlight,
      kind: 'study',
    }));
  return [...jobs, ...study].sort((a, b) => a.start - b.start);
}

/** "1.6 yrs", "6 mo" */
export function tenure(years: number) {
  return years < 1 ? `${Math.round(years * 12)} mo` : `${Math.round(years * 10) / 10} yrs`;
}
