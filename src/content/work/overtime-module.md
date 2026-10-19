---
title: Overtime, from attendance to payslip
summary: An overtime module that turns extra hours in attendance into approved, policy-checked, payroll-ready pay or comp-off.
date: 2021-01-01
type: case-study
kind: 0 to 1
icon: clock-plus
tone: mustard
featured: false
draft: true
company: Greytip (greytHR)
role: Product Manager L3
impact: 100+ enterprises
tags: [HRMS, Payroll, Workflows, 0 to 1]
demo: work/overtime-module/demo/
flow:
  - label: Set the policy
    note: Eligibility, caps, rounding and pay rates by day type or shift
  - label: Assign it
    note: In bulk, per employee, or automatically by category
  - label: Capture OT
    note: Employee applies, manager applies for the team, or auto-grant from attendance
  - label: Approve
    note: 1 to 3 reviewer levels, with auto-forward
  - label: Finalize
    note: Admin considers or ignores each record and picks the payroll month
  - label: Pay
    note: Regular, arrear or reversal on an overtime payslip
# Add mockups to public/images/overtime/ and list them here, e.g.
# gallery:
#   - src: overtime/policy-payout.png
#     alt: Payout settings with a pay-rate grid by day type
#     caption: One grid sets rate, multiplier or comp-off for each day type.
# prototype: https://www.figma.com/proto/...
---

## The problem

In factories and other shift-heavy businesses, overtime is a large share of wages, and it was tracked in spreadsheets. Hours were missed or padded, approvals happened over chat, and payroll ended up correcting last month's mistakes by hand. Indian labour law adds rules that vary by state, such as caps and double pay.

## Who it's for

- **HR admins** set the rules once and need them applied the same way every time.
- **Managers** approve hours, and often apply them for blue-collar team members who don't use the app.
- **Employees** want to see what they've earned and what's still pending.
- **Payroll** needs a clean, locked number for each employee each month.

## Key decisions

- **Calculate from attendance, not from claims.** OT eligibility comes from clocked hours after break deductions and rounding to a time block, so requests start from a number the system already trusts.
- **Day type *or* shift, chosen per policy.** Some customers pay by day type (rest day, holiday), others by shift (night shift). One policy model supports both, so customers don't need two products.
- **Flat rate or salary component × multiplier.** Smaller firms want a simple amount per hour. Factories need "2× Basic + DA" to stay compliant. Both are supported, and admins can add their own multipliers.
- **A separate finalization step before payroll.** Approval says the hours were worked. Finalization says which payroll month pays them. Splitting the two made late approvals become clean arrears, and reductions become reversals, instead of manual fixes.
- **Manager-initiated OT.** Many workers never log in, so managers can apply for one person or the whole team, and the monthly and quarterly caps are still enforced.

## Outcome

- Adopted by 100+ enterprises.

## What I'd do next

- Pre-approval for planned overtime, so it's authorized before it's worked.
- An OT cost view by department, with alerts for excessive overtime.
