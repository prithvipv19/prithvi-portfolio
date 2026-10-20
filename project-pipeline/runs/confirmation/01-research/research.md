# Research: Confirmation

> Condensed from the greytHR Employee Confirmation teardown done in this session (17 of the 20 help articles, the Letters docs, the launch blog and community threads). Sources in `sources.md`.

## Problem summary
Probation reviews run on spreadsheets and reminders. Due dates are missed, so employees stay "on probation" for months past the date. Manager feedback is unstructured. After the decision, HR still has to change the status, write the letter and tell payroll, IT and benefits by hand.

## Users & pain points
- **HR admin (Priya):** tracks dozens of due dates; chases managers; no view of what is overdue.
- **Reporting manager (Divya):** gets an email with no context; doesn't know what "good" looks like for the review.
- **HR head (Rahul):** signs off without seeing the manager's reasoning; signs letters separately.
- **Employee (Meera):** doesn't know where they stand, or hears about the decision late.

## Current alternatives
| Product | Strengths | Gaps |
|---|---|---|
| greytHR | Auto-initiation N days before due; 1–5 reviewer levels; auto-forward; extension cap; per-reviewer tasks and forms; employee-visible feedback vs. private remarks | Module off by default (support ticket); no letter on outcome; no "do not confirm" path; "Reject" is ambiguous; no confirmation reports (Query Builder only); admin can't override a running workflow |
| Keka / Darwinbox / Zoho People | Probation tracking, review forms, letters | Letters and downstream updates usually separate steps |
| Spreadsheet + email | Flexible, free | No reminders, no audit trail, nothing automatic |

## Constraints
- Probation terms and extension rules come from the appointment letter and state law (India); extensions should state a reason.
- Confirmation changes notice period, leave eligibility and sometimes pay; these must update on the effective date.

## UX patterns worth reusing
- Pipeline/kanban by status with due-date urgency.
- Structured evaluation with ratings plus free text.
- Split "feedback the employee sees" from "remarks only reviewers see".
- Timeline of actions per request.

## Opportunities
- **O1** One tracker for every probation with due, overdue and extension counts (greytHR has no confirmation report).
- **O2** Three explicit outcomes: confirm, extend, do not confirm (greytHR only has confirm/extend, plus an ambiguous reject).
- **O3** A structured evaluation form so reviews are comparable.
- **O4** The decision drives everything after it: status, letter, eligibility and tasks (greytHR letters are a separate manual run).
- **O5** The employee sees the outcome and the feedback in one place.

## Open questions
None for this run.

## Assumptions
- Competitor gaps for Keka / Darwinbox / Zoho People are from general product knowledge, not verified in this run.
