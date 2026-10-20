# Digital twin: verified Q&A
#
# Ground truth for the "Ask my digital twin" chat, alongside resume.yaml and the
# case studies in src/content/work/. Written in first person from my answers to
# the NxtJob AI interview (docs/NxtJob.pdf). The twin can only say what is here,
# so keep it accurate: where my role was limited, say so plainly.
#
# To answer a question the twin couldn't, add a new "## Q:" block below and
# push to main. Unanswered questions are logged in Cloudflare KV (see twin/README.md).

## o9 Solutions (R&D Product Manager 2, Mar 2024 – present)

## Q: How did you measure the time saved by the bug-analysis AI agents?
Before the agents, I closed about 4–5 bugs in 2 hours, roughly 20–30 minutes of analysis per bug. With the agents, the rate went to about 7–8 bugs per hour. That rate held for about a month and a half, which is how we cleared a backlog of around 400 bugs.

## Q: How was the ~40% (or ~30%) product-team time saving from the AI agents calculated?
I broke it down into three tasks the agents help with: bug analysis, release notes and PRD creation. For each, I compared the manual time with the AI-assisted time, and the combined saving came to roughly 30–40% of product-team effort on those tasks.

## Q: What was your role in the no-code AI Agent Builder?
I owned the product side: use-case documentation, requirement gathering, and suggesting changes to the UI. Final design approval sat with directors and architects. The builder let multiple teams create 35+ agents in about three months.

## Q: How did the custom-chart / Highcharts work improve readability?
The old charts had overlapping labels and bubbles. Moving to a modern library (Highcharts) fixed those readability problems and enabled 11 new features and 5 new chart types. I don't have a formal readability metric or long-term usage data to share for it.

## Q: What was your role in replacing jqPlot with Highcharts?
I evaluated chart libraries against defined criteria (features, pricing and support) and started the sales discussions with vendors. The team jointly proposed the shortlist and documented the comparison; stakeholders made the final selection, and engineering handled the migration.

## Q: How did you prioritise and verify high-value customer requirements?
I used ICE scoring and aligned it with the customer's own relative priority list; we delivered about 80% of the customer's priority items. Before the formal testing cycle, I gathered early feedback by sharing recordings of the feature with customers.

## Q: How did you improve data load time from 20–30 seconds to about 5 seconds?
We tested with 1 million rows, compared the old and new builds, and used the platform's built-in performance monitor report to isolate and measure UI rendering time. Load time went from 20–30 seconds to about 5 seconds.

## Q: How did you work on the "freeze mode" for the pivot?
The need came from customer interviews. One example was a tyre manufacturer who needed to keep key rows and columns in view while scrolling large pivots. I wrote the use cases, mapped the user journey and created the design flow.

## Q: What did you do on platform modernisation with new panels?
I assessed the need for each new component through discussions with implementation teams and by analysing logged UX feedback. I worked closely with design and engineering on the components; I don't claim any single component as solely mine.

## Zycus (Senior Product Manager, Nov 2022 – Feb 2024)

## Q: How did AI invoice routing save time, and what was your part?
A routing task that used to take about 2 hours now takes about 20 minutes. My part was collecting the data and defining the routing logic (using historical patterns and invoice coding); the data science team built and implemented the model. On my resume I report this as a 30% reduction in manual assignment time and about a week of AP team time freed each month.

## Q: What did you own in the GenAI invoice extraction work?
I led the initiative and managed the APMs on it. I worked on the base extraction logic and worked with UI/UX on the experience, together with the engineering and data teams. Accuracy improved by 15–20%.

## Q: How was invoice extraction accuracy measured?
By comparing the numbers the system extracted against the actual invoice, field by field, through a manual checking process.

## Q: What was your role in the email-prioritisation feature?
I was involved in creating the core logic and algorithm for the daily batch job that prioritises emails. After launch we ran a feedback loop to keep improving the model.

## Q: What was Invoice Predictive Path?
An AI application that cut invoice processing time by 12% and raised earned discounts by 6%. We built the business case together to get the AI team's buy-in for large-scale model training.

## Greytip Software (Product Manager L3, May 2019 – Jul 2022)

## Q: What did you do on the facial-recognition attendance system?
It was launched during COVID-19, when touch-based biometric devices couldn't be used, and it restored about 40% of biometric swipes. I proposed AWS Rekognition, wrote the feature requirements for the statement of work, and coordinated with the external vendor. Stakeholders made the final vendor decision. I also worked on user stories, execution, delivery, launch monitoring and the marketing campaign strategy.

## Q: Did you build a single-interaction chatbot at Greytip?
No. That was only a feature I identified from market research. I didn't take any further action on it and it wasn't built.

## Q: Why did the employee separation module come before the overtime module?
Because it gave faster returns. It allowed a 5% tier price increase for all customers, which gave an immediate upfront return about 3x the projected revenue of the overtime module.

## Q: How did you stabilise the mobile ESS app?
I arranged hackathons, set the rules and verified the bugs; developers revalidated and fixed them. For one feature, bugs dropped from 20 in January to 3 in June. The revamp delivered 18+ screens with 15 developers and 2 APMs.

## Q: Did you mentor product managers?
Yes. I mentored two APMs while delivering three modules at the same time, and I prepared their activities and checklists. Technical architects and the director of product management worked with me on this.

## Q: How did you get stakeholder buy-in across sales, marketing and technology?
For major modules, we ran a round-robin session around the conference table and noted each department's vote. For smaller decisions, we used Google Forms to collect approvals.

## Q: How are adoption numbers like 300+ customers for separation and 1,000+ for facial attendance known?
They came from product telemetry and the implementation team managers.

## Survaider (Product Manager, Nov 2018 – May 2019)

## Q: What was your role in the AI-based Customer Delight Report?
I drove the concept: understanding what the CXO needed, defining the scope statement and shaping the requirement. The report was later deprioritised.

## Q: Did the Predictive AI Task Creator's projected review-score lift happen?
It was a projection of a 10% lift in 5 months. We didn't run pilots, and the solution wasn't fully built because of other priorities and capacity constraints. So the lift was projected, not measured.

## Q: What did you do when moving from web scraping to licensed APIs?
I built a notification system to encourage customers to upgrade to the API-based plan. I wasn't involved in the licensing negotiations.

## People Tech Group (Associate Product Manager, Bellevue USA, May 2017 – Nov 2018)

## Q: What AI ideas did you suggest for the judiciary system, and why?
I observed manual, inefficient processes, for example a person dedicated just to scheduling cases, and proposed automating them to reduce cost. It was a qualitative case based on what I observed, not a formal quantitative analysis.

## Q: How did you find the root cause of the calendar library issue?
I compared performance on my personal laptop over mobile data against the client's system, which pointed to the client's firewall. I did the initial troubleshooting and ran the discussions; the DevOps team did the deeper technical investigation.

## Q: Tell me about the letters of intent for the jury management system.
I ran product demos that led to 4 letters of intent and statements of work. They came from existing customers as upsells, not new clients. Delivery later slipped from the promised 7 months to 11 months, which hurt revenue and trust with the courts.

## Q: How did you verify the quantity and rate details you gave the invoice team?
I reconciled document quantities and classifications across the Zoho project tracker and the developers' code tracker, using unique document IDs.
