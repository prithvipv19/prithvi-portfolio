---
title: Touch-free attendance
summary: Face-recognition check-in, launched during COVID-19 when shared biometric scanners stopped being an option.
date: 2020-06-01
type: case-study
kind: 0 to 1
icon: face-id
tone: lavender
featured: true
order: 3
company: Greytip (greytHR)
role: Product Manager L3
impact: 1,000+ customers
tags: [HRMS, Computer vision, 0 to 1]
flow:
  - label: Enroll faces
    note: Bulk sync from profile photos, or register at the kiosk
  - label: Set up the kiosk
    note: Any Android phone or tablet, set to In, Out or both
  - label: Look and blink
    note: The blink shows it's a live person, not a photo
  - label: Match
    note: The face is matched against the company's enrolled employees
  - label: Log the swipe
    note: Time, In/Out and door go to attendance as a normal swipe
  - label: Process
    note: Shift rules, regularization, then payroll
galleryNote: Screens recreated for this portfolio. All names, numbers and people are made up.
gallery:
  - src: attendance/kiosk-dashboard.svg
    alt: Kiosk app home screen with Initiate kiosk, Register faces, Kiosk settings and today's check-in count
    caption: The kiosk admin starts the kiosk, tracks face registration, and changes settings from one screen.
  - src: attendance/register-face.svg
    alt: Register faces screen with an employee selected, a face guide oval and three photo-quality checks
    caption: Faces can be registered at the kiosk. Quality checks run before saving, and one face can't belong to two employees.
  - src: attendance/kiosk-settings.svg
    alt: Kiosk settings with Swipe In, Swipe Out and Both options, door name, wait time, audio message and instruction text
    caption: Each device is set to In, Out or both, and tagged with the door it's placed at.
  - src: attendance/scan-and-blink.svg
    alt: Camera view tracking an illustrated face, with steps for face found, blink detected and matching
    caption: The employee looks at the camera and blinks. No touching, no card, no queue at a fingerprint scanner.
  - src: attendance/checked-in.svg
    alt: Success screen saying Good morning, Ananya, with time, door, shift and a spoken confirmation
    caption: A spoken confirmation, then the kiosk is ready for the next person.
  - src: attendance/admin-swipes.svg
    alt: Admin web page listing employee swipes filtered to source Kiosk, with times and door names
    caption: Kiosk swipes show up next to every other swipe in the admin portal, ready for attendance processing.
decisions:
  - area: Hardware
    icon: device-mobile
    chose: Phones and tablets customers already own
    over: Dedicated face scanners
    tradeoff: Android only, with a minimum device spec
  - area: Liveness
    icon: eye
    chose: A natural blink check
    over: Depth or IR sensors
    tradeoff: Weaker against video replays
  - area: Enrollment
    icon: user-plus
    chose: Bulk photo sync plus register at the kiosk
    over: Bulk photo sync only
    tradeoff: Registering at the kiosk is slower
  - area: Identity
    icon: id-badge-2
    chose: One face, one employee
    over: Allowing duplicate faces
    tradeoff: Twins need a stricter match threshold
  - area: Integration
    icon: plug-connected
    chose: Send a normal swipe to attendance
    over: A separate kiosk attendance flow
    tradeoff: The kiosk applies no rules of its own
  - area: In and Out
    icon: door-enter
    chose: One device for both, or one per door
    over: Always two devices
    tradeoff: One device infers first In, last Out
next:
  - Passive anti-spoofing
  - Offline capture
  - Central kiosk management
---

## The problem

When COVID-19 hit, companies stopped using shared fingerprint scanners, and attendance data started to fall apart.

## What I did

Took Facial Attendance from 0 to 1: an AI-based face-recognition check-in built into the HRMS.

## Outcome

- Restored 40% of the biometric swipes that had been lost.
- Grew to 1,000+ customers.
