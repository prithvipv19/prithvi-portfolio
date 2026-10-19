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
---

## The problem

When COVID-19 hit, companies stopped using shared fingerprint scanners, and attendance data started to fall apart.

## What I did

Took Facial Attendance from 0 to 1: an AI-based face-recognition check-in built into the HRMS.

## Key decisions

- **Phones and tablets customers already own, not new hardware.** Customers could start the same day, with no device to buy, ship or maintain. The cost: Android only, and camera quality varies, so we published a minimum spec (Android 10, 4 GB RAM, 5 MP camera).
- **A blink check for liveness, not depth sensors.** A natural blink stops someone holding up a photo, and it works on any ordinary camera. It's weaker against a video replay, which is the main thing I'd strengthen next.
- **Two ways to enroll.** Large companies can bulk-sync existing profile photos. Smaller ones, and new joiners, register at the kiosk itself, which gives better matches but takes longer. Both use the same photo rules: the face fills at least 60% of the frame, in good light.
- **One face, one employee.** The same face can't be registered for two people, which blocks proxy enrollment. Edge cases have their own path: a stricter match threshold for twins, and delete-then-register for people who rejoin.
- **A kiosk swipe is just a swipe.** The kiosk only records time, direction and door, and the existing attendance engine applies shift rules, regularization and payroll. Nothing downstream had to change, and companies could mix kiosks with other swipe methods.
- **One device or two.** A single device set to both counts the first swipe of the day as In and the last as Out. Sites that need exact In and Out records put one device at each door.
- **The kiosk screen is locked.** Opening the kiosk needs the device's own PIN, pattern or biometric, so nobody else can change its settings.

## Outcome

- Restored 40% of the biometric swipes that had been lost.
- Grew to 1,000+ customers.

## What I'd do next

- Passive anti-spoofing that also stops video replays, not just photos.
- Offline capture that syncs swipes when the network comes back.
- One place to manage all kiosks, with each device's health and settings.
