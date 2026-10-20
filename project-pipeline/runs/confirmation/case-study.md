---
title: Employee Confirmation
summary: A probation-to-confirmed workflow that starts every review on time, routes it through reviewers with one evaluation form, and turns the final decision into the status change, the letter and the follow-up tasks.
date: 2026-10-01
type: case-study
kind: 0 to 1
icon: user-check
tone: mustard
featured: true
order: 6
tags: [HRMS, Workflows, Employee lifecycle, 0 to 1]
flow:
  - label: Policy
    note: Probation by employee category, reviewer levels, timing and an evaluation form
  - label: Track
    note: Every probation on one board; reviews start 15 days before the due date
  - label: Review
    note: The manager rates, recommends, and writes feedback the employee will see
  - label: Decide
    note: The final reviewer sees the full review and confirms, extends or does not confirm
  - label: Automate
    note: Status, notice period, letter, leave eligibility and tasks update on their own
  - label: Outcome
    note: The employee sees the decision and the feedback, and acknowledges the letter
gallery:
  - src: confirmation/SCR-policy.png
    alt: Confirmation policy screen with probation days by category, two reviewer levels, timing rules and a four-part evaluation form
    caption: One policy sets the probation length by category, the reviewers, the timing and the evaluation form.
  - src: confirmation/SCR-tracker.png
    alt: Probation tracker with counts for on probation, due, overdue and extension rate, and a board of employees by stage
    caption: The tracker shows what's due, what's late and who has the review.
  - src: confirmation/SCR-review.png
    alt: Manager review with ratings, a confirm, extend or do-not-confirm choice, feedback for the employee and private remarks
    caption: The manager rates, recommends, and separates feedback for the employee from remarks for reviewers.
  - src: confirmation/SCR-decision.png
    alt: Final decision screen showing the manager's recommendation, rating bars, a timeline and confirm, extend or do-not-confirm buttons
    caption: The final reviewer sees the whole review before deciding.
  - src: confirmation/SCR-confirmed.png
    alt: Decision result listing automatic changes to status, notice period, confirmation letter, leave eligibility and follow-up tasks
    caption: One decision updates the record, issues the letter and raises the follow-up tasks.
  - src: confirmation/SCR-employee.png
    alt: Employee view with confirmed status, the manager's feedback and the signed confirmation letter, acknowledged
    caption: The employee sees the outcome, the feedback and the signed letter in one place.
galleryNote: Screens from a clickable mockup of the hero flow, on fictional data.
---

## The problem

Probation reviews ran on a spreadsheet of joining dates and a lot of reminder emails. Reviews started late, so people stayed "on probation" weeks past their due date. Managers got a request with no context and wrote whatever they liked, so reviews couldn't be compared. After the decision, HR still had to update the record, recalculate the notice period, write and sign a letter, and tell payroll and IT. The employee was often the last to know.

## Who it's for

- **HR admins** set the rules once and need to see what's due and what's late.
- **Reporting managers** evaluate the new joiner and recommend an outcome.
- **The HR head** makes the final call and signs the letter.
- **Employees** want to know where they stand, and why.

## Key decisions

- **Start the review from the policy, not from a reminder.** Probation length comes from the employee's category, and the review opens on its own 15 days before the due date. If a reviewer doesn't act within 3 days, it moves to the next level, so nothing waits on one inbox.
- **Three outcomes, named plainly.** Confirm, extend, or do not confirm. The tool I studied only offered confirm and extend, plus a "reject" that cancelled the review but still sent it on to the next reviewer. Extending needs a reason and is capped at two, so probation can't be extended forever.
- **One evaluation form per policy.** The same four ratings for every new joiner make reviews comparable across managers and give the final reviewer something concrete to decide on.
- **Two text boxes, two audiences.** "Feedback for Meera" is shown to the employee. "Remarks for reviewers" stays private. Managers write more honestly when they know who will read what.
- **The decision does the paperwork.** Confirming changes the status and notice period from the effective date, generates and signs the confirmation letter, starts leave accrual, and raises tasks for payroll and IT. Before, those were five separate HR tasks.
- **A tracker, not a report you have to build.** Counts for due, overdue and the extension rate sit on top of a board by stage, so HR can see the whole pipeline without a custom query.

## What I'd do next

- A "do not confirm" path that hands straight into the exit process, with the notice period and final settlement worked out.
- Mid-probation check-ins at 30 and 60 days, so the final review isn't the first conversation.
- Reassign reviews automatically when a reporting manager changes or leaves during the review.
