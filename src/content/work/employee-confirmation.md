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
gallery:
  - src: confirmation/flow.svg
    alt: Swimlane diagram. HR admin sets the policy, the system starts the review 15 days before the due date, the manager rates and recommends, and the HR head decides. Confirm leads to automatic paperwork and the employee seeing the outcome; extend loops back to restart the review; do not confirm hands off to the exit process.
    caption: Who does what, from the policy to the signed letter.
decisionsImage:
  src: confirmation/key-decisions.svg
  alt: "Key decisions placed under the five flow stages. Policy: auto-start the review 15 days before the due date instead of chasing dates in a spreadsheet; require a reason and allow at most 2 extensions. Track: a board with due, overdue and extension counts instead of query-built reports. Review: one rating form per policy; feedback for the employee kept apart from private remarks. Decide: three plain outcomes, confirm, extend or do not confirm; auto-forward to the HR head after 3 days. Automate: status, notice, letter, leave and tasks update on their own instead of five manual HR tasks. Each card also lists what the choice cost."
next:
  - Exit hand-off for do not confirm
  - 30 and 60 day check-ins
  - Auto-reassign when the manager changes
---

## The problem

Probation reviews ran on a spreadsheet of joining dates and a lot of reminder emails. Reviews started late, so people stayed "on probation" weeks past their due date. Managers got a request with no context and wrote whatever they liked, so reviews couldn't be compared. After the decision, HR still had to update the record, recalculate the notice period, write and sign a letter, and tell payroll and IT. The employee was often the last to know.

## Who it's for

- **HR admins** set the rules once and need to see what's due and what's late.
- **Reporting managers** evaluate the new joiner and recommend an outcome.
- **The HR head** makes the final call and signs the letter.
- **Employees** want to know where they stand, and why.
