import { parse } from 'yaml';
import raw from '../data/resume.yaml?raw';

export interface Resume {
  basics: {
    name: string;
    headline: string;
    location?: string;
    email: string;
    intro: string;
    now?: string;
    socials: { label: string; url: string }[];
  };
  about: string[];
  experience: {
    company: string;
    role: string;
    start: string | number;
    end: string | number;
    location?: string;
    summary?: string;
    highlights: string[];
  }[];
  education: { school: string; degree: string; start?: string | number; end: string | number }[];
  skills: { group: string; items: string[] }[];
  certifications: { name: string; issuer: string; year: string | number }[];
}

export const resume = parse(raw) as Resume;
