# Research: Letters — HR letter generation

> Written by the orchestrator from research already done in this session (greytHR help center, Freshdesk KB, product updates and blog).

## Problem summary
Letters run through the whole employee lifecycle: offer, appointment, confirmation, increment, address proof, experience, relieving [S1]. Without a system HR copies a Word file, edits names and numbers by hand, chases the signatory over email and sends PDFs one at a time. That causes errors, no audit trail and slow turnaround.

## Users & pain points
- **HR admin (Priya)** — Job: issue accurate letters quickly, often in bulk (an increment cycle). Pain: manual edits, inconsistent formats across locations, chasing signatures.
- **Authorised signatory (Rahul, HR head)** — Job: sign off letters with confidence. Pain: letters arrive by email with no context or queue.
- **Employee (Asha)** — Job: get and keep official letters. Pain: waits on HR, can't find old letters, no clear "I accept" step.

## Current alternatives
| Product | Strengths | Gaps |
|---|---|---|
| greytHR Letters | Template gallery, merge fields, letter number series, custom fields, single and bulk generation by filter, approval types incl. "no authorisation", up to 2 sequential signatories, release to ESS + email, password-protected attachments, accept / acknowledge / reject, employee requests with 1–3 reviewer levels [S2–S8] | Template authoring is a download/upload .odt round-trip; PFX digital signing only in demo accounts; settings split across three places; no delivery or read tracking [S2, S6] |
| Word + email (status quo) | Free, flexible | Manual edits, no audit, no bulk, no employee acceptance |
| Generic e-sign tools | Strong signing | Not tied to HR data or employee portal |

## Constraints
- Letters are legal records: signatory identity and an audit trail matter [S2, S6].
- Signatories must be active employees; actions must be traceable [S6].
- NDA: portfolio material uses fictional data and no vendor branding.

## UX patterns worth reusing
- Merge fields inserted from a side panel, previewed with real employee data [S3].
- Batch IDs that expand to individual letters [S2].
- Signatory inbox with preview, timeline and "Accept & sign" [S2].
- Release as a separate, explicit step with delivery options [S2, S6].

## Opportunities
- **O1** Edit templates in place with live merge-field preview instead of a file round-trip (evidence: upload/.odt flow) [S3, S4].
- **O2** One wizard from template to signed letter, with approval optional per letter (evidence: Jan 2026 "no authorisation" change) [S5].
- **O3** Bulk generation by filter with per-letter preview (evidence: bulk + filters) [S4, S7].
- **O4** Signing inside the product, in the signatory's inbox (evidence: PFX demo-only) [S2].
- **O5** Clear employee acknowledgement and delivery status (evidence: enforce options, no read tracking) [S3].

## Open questions
- Placeholder catalogue isn't public; the mockup uses a plausible set.

## Assumptions
- Image signature is the signing method shown (PFX not live for customers).
