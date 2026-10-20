# Research: Overtime — from attendance to payslip

## Problem summary
Overtime (OT) is work beyond an employee's normal hours. In Indian manufacturing, automobile and garment businesses it's a large, recurring share of wages. Statute requires OT pay once a worker exceeds roughly 9 hours a day or 48 a week, often at twice the ordinary rate, and rules vary by state and establishment type [S1, S8]. Without a system, OT is tracked in spreadsheets and approved over chat, so hours are missed or padded, costs are hard to control, and payroll corrects past months by hand [S1].

## Users & pain points
- **HR / payroll admin (Priya)** — Job: pay OT correctly and compliantly every month. Pain: reconciling attendance, approvals and payroll by hand; fixing late approvals and over-payments after payroll closes.
- **Line manager (Vikram)** — Job: approve legitimate OT and keep costs in check. Pain: requests arrive in chat; many team members don't use any app, so the manager ends up entering OT for them [S4].
- **Employee (Asha)** — Job: get paid for extra hours. Pain: no visibility of what's eligible, pending or paid.

## Current alternatives
| Product | Strengths | Gaps |
|---|---|---|
| greytHR Overtime | Deep policy model: break deduction, min hours, rounding blocks, daily-to-quarterly caps, rates by day type or shift, flat or component × multiplier pay, auto-grant, 1–3 approval levels, a finalization step, register with arrears and reversals [S2, S3, S5, S6, S7] | Spread across many menus; dense pay-rate grid that's easy to misconfigure; no planned / pre-approved OT; little cost analytics [S2] |
| Keka | Bulk import of OT requests from Excel, day-wise or date-range [S9] | Imports create requests but don't auto-approve; policy depth less documented |
| PeopleForce | OT types with multipliers, pay-or-time-off compensation, auto-classification by day/time, payroll component mapping [S10] | Time-off compensation needs manual balance import |
| Personio | Daily vs weekly OT calculation, deficit-hours tracking [S11] | Built for salaried knowledge workers; little for shift / statutory OT |
| Spreadsheet + chat (status quo) | Free, flexible | No caps, no audit trail, manual payroll fixes |

## Constraints
- Statutory OT rules (Factories Act, Minimum Wages, state Shops & Establishments rules) and statutory registers such as Form IV [S1, S8].
- Payroll months close: anything approved after close must be paid as an arrear or recovered as a reversal [S7].
- Many workers have no app access, so managers must be able to act on their behalf [S4].
- NDA: portfolio material must use fictional data and no vendor branding.

## UX patterns worth reusing
- Show eligible hours already computed from attendance, so employees only pick days and give a reason [S5].
- Show cap balances (monthly / quarterly) up front, and block over-cap entries visibly (greytHR highlights them in pink) [S4].
- Separate "approved" from "paid": a finalization step picks the payroll month [S6].
- A register that labels each line as regular, arrear or reversal [S7].

## Opportunities
- **O1** Compute eligibility from attendance with a transparent breakdown (break → minimum → rounding → cap), so nobody types hours. Evidence: greytHR rule set [S2, S3].
- **O2** Let managers apply for the whole team while caps are enforced row by row. Evidence: manager-initiated OT release and cap behaviour [S4].
- **O3** Make finalization a distinct, explicit step so late approvals become clean arrears and corrections become reversals. Evidence: [S6, S7].
- **O4** Keep the policy readable in plain language on one card, instead of a dense grid. Evidence: greytHR's grid complexity [S2].
- **O5** Give employees a clear view of eligible, pending and approved hours against their cap. Evidence: ESS balance header [S5].

## Open questions
- Should planned OT require pre-approval before it's worked? (Out of scope for this run.)

## Assumptions
- Hourly rate for the component method = monthly Basic ÷ (26 days × 8 h), a common Indian payroll convention (assumption, not from a cited source).
