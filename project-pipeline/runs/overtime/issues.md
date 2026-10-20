# Issues

Cross-stage gaps. Format: `- [<owning stage>] <what's missing> — needed for <item>`

- [spec] UC1's "selection would exceed monthly cap → error" can't happen with the seed data (Asha's eligible October days total 14:30 h, under the 20:00 h cap), and SCR-ot-apply lists one `error` state only. The mockup builds the over-cap message and a red cap meter, but no deep-link state shows it; `error` shows "Remarks are required." (F3.S1). Add an `error-cap` state and seed if the video needs it — needed for SCR-ot-apply error coverage
- [mockup] No deep-link state for SCR-ot-apply with 3 Oct and 4 Oct already ticked (e.g. `selected`); the default deep link reseeds an empty selection — needed for SC-05 (F1.S3), which re-ticks both days at 0.0–0.2 s as a workaround
- [mockup] No deep-link state for SCR-review after Asha's 3 Oct approval (seed stage 2); `default` reseeds her request as pending — needed for SC-08 (F1.S6), which opens zoomed on the payroll footer to keep the re-seeded card out of frame
- [mockup] SCR-review `default` seeds Asha's 3 Oct as pending, so SC-08's Continue to payroll lands on SCR-finalize with 4 records while SC-09's `default` deep link shows 5 (incl. Asha 3 Oct); a review state after the approval (seed stage 2) would make the SC-08 → SC-09 cut continuous — needed for SC-08/SC-09 (video shows a one-row jump at 51.0 s)
