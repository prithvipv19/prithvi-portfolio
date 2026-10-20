---
title: Weight Loss Tracker
summary: A mobile-first web app that logs weight, meals, water and activity, and uses AI to read meal photos, nutrition labels and scale displays.
date: 2026-07-01
category: personal
type: code
kind: Personal project
icon: scale
tone: lavender
company: Personal project
role: Solo builder, from product and design to full-stack
impact: Live app, built end to end
tags: [React, Vite PWA, Firebase Auth, Firestore, Cloud Functions, Express, Gemini 2.5 Flash, Recharts]
links:
  live: https://weight-loss-pwa.web.app/
flowLink: true
video:
  src: videos/weight-loss-demo.mp4
  captions: videos/weight-loss-demo.vtt
  poster: videos/weight-loss-demo.jpg
  label: Watch the 40-second walkthrough
  portrait: true
flow:
  - label: Set up
    note: Height, sex, age, weight and goal, everything BMR needs
  - label: Snap a meal
    note: Gemini drafts the items, portions and nutrition
  - label: Review the draft
    note: Fix a portion and the totals update before saving
  - label: Check the budget
    note: Consumed, target and remaining for today
  - label: Snap the scale
    note: The reading is confirmed before it's logged
  - label: See the trend
    note: Weight against calories in and burnt, by week, month or year
galleryNote: Screens from the real app, captured locally on test data.
gallery:
  - src: personal/weight-loss/onboarding.jpg
    alt: Onboarding screen. Pick a light or dark theme and an accent colour, then enter height, sex, date of birth, current weight and goal weight.
    caption: Onboarding collects what BMR needs.
  - src: personal/weight-loss/log-meal.jpg
    alt: Log Meal screen with photo or manual entry, and today's meals grouped by meal time with a running calorie and macro total.
    caption: Log a meal from a photo, or by hand.
  - src: personal/weight-loss/capture-weight.jpg
    alt: Capture Weight screen asking for a photo of the scale display, with a note that the reading can be reviewed before it's logged.
    caption: Snap the scale; confirm the reading.
  - src: personal/weight-loss/reports.jpg
    alt: Reports, month view. Target 78 kg against latest 85.7 kg, with a chart of weight falling over daily calorie intake and calories burnt.
    caption: Weight against calories in and out.
  - src: personal/weight-loss/log-water.jpg
    alt: Log Water form with date, litres and notes, a 3-litre daily goal, and recent entries below.
    caption: Water, with a daily goal.
  - src: personal/weight-loss/dashboard.jpg
    alt: Dashboard greeting "Keep the momentum, Alex." above tiles for Capture Weight, Log Weight, Log Water and Log Meal.
    caption: One tap to every log.
---

## Why I built it

Most trackers make logging food the hard part, so people stop. I wanted to see how far AI could take the typing out of it, and to build a real product end to end myself: idea, design, front end, API, data and hosting.

## What it does

- **Photo logging for meals.** Snap a plate or a nutrition label, and the app suggests the items, portions and nutrition to confirm.
- **Photo logging for weight.** Point the camera at a weighing scale and it reads the display.
- **Everything else in one place.** Water, steps and workouts, with calories burned estimated from standard activity values and always editable.
- **A daily budget at a glance.** Log Meal shows today's calories consumed, the target and what's left. BMR (Mifflin-St Jeor) is worked out from the onboarding details, and the daily target is set in the profile.
- **Reports.** Charts of weight and intake over time.
- **Admin tools.** Manage users and roles, disable accounts, and "view as" a user to help them with their data.

## How it's built

- **Front end:** React 19 and Vite as an installable PWA. API calls use a network-first cache, so recent data still shows on a weak connection.
- **Back end:** an Express API on Firebase Cloud Functions, with Firebase Auth (email and Google) and Firestore.
- **AI:** Gemini 2.5 Flash reads meal photos, nutrition labels and scale displays, and estimates nutrition for foods it hasn't seen before.
- **Hosting:** Firebase Hosting, with the API behind `/api`.

## What I learned

- **Confirm, don't auto-save.** AI suggestions work best as a draft the person checks, especially for portions.
- **Every estimate needs an override.** Calories burned and serving sizes are estimates, so each one can be edited.
- **The PM in me liked the admin view most.** Supporting real users needs tooling, not just features.
