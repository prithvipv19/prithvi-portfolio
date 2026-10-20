/*
  Weight Loss Tracker mockup: router, sample data, screen templates, chart.
  Deep links: index.html#SCR-<id>[?state=default][&range=week|month|year]
  All sample data is fictional ("Alex"), Tuesday, October 20, 2026.
*/
(function () {
  'use strict';

  // ------------------------------------------------------------------ data
  const TARGET_KCAL = 1800;
  const DATE_LABEL = 'Tuesday, October 20';
  const MEALS_DATE = 'Tue, Oct 20, 2026';
  const DATE_LOCAL = '20/10/2026';

  const MACRO_KEYS = ['calories', 'protein', 'carbs', 'fat', 'saturatedFat', 'fiber', 'sugar'];
  const MICRO_KEYS = ['sodium', 'cholesterol', 'potassium', 'calcium', 'iron', 'vitaminA', 'vitaminC', 'vitaminD', 'vitaminB12'];

  // Per-100 g values for the AI draft of "Chicken rice bowl".
  const ITEMS = [
    { key: 'chicken', name: 'Grilled chicken breast', grams: 120,
      per100: { calories: 165, protein: 31, carbs: 0, fat: 3.6, saturatedFat: 1, fiber: 0, sugar: 0 },
      micro100: { sodium: 74, cholesterol: 85, potassium: 256, calcium: 15, iron: 1, vitaminA: 9, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.3 } },
    { key: 'rice', name: 'Jasmine rice (cooked)', grams: 200,
      per100: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, saturatedFat: 0.1, fiber: 0.4, sugar: 0.1 },
      micro100: { sodium: 1, cholesterol: 0, potassium: 35, calcium: 10, iron: 0.2, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0 } },
    { key: 'broccoli', name: 'Steamed broccoli', grams: 80,
      per100: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, saturatedFat: 0.1, fiber: 3.3, sugar: 1.4 },
      micro100: { sodium: 41, cholesterol: 0, potassium: 293, calcium: 40, iron: 0.7, vitaminA: 77, vitaminC: 64.9, vitaminD: 0, vitaminB12: 0 } },
    { key: 'dressing', name: 'Sesame soy dressing', grams: 20,
      per100: { calories: 260, protein: 3, carbs: 16, fat: 21, saturatedFat: 3, fiber: 0.5, sugar: 12 },
      micro100: { sodium: 2600, cholesterol: 0, potassium: 120, calcium: 20, iron: 1, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0 } },
  ];
  const RICE_EDITED = 150; // the portion Alex corrects in F1.S5

  const MORNING_MEAL = { name: 'Greek yogurt & berries', calories: 327, protein: 23.6, carbs: 38, fat: 9.3 };

  // Reports: Oct 6 to Oct 20 (null = no weigh-in that day; line connects across).
  const DAYS = ['Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11', 'Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20'];
  const WEIGHTS = [88.7, 88.5, 88.4, 88.1, 87.9, null, 87.5, 87.3, 87.1, 86.8, 86.5, null, 86.1, 86.0, 85.7];
  const INTAKE = [1506, 1401, 1429, 1465, 1528, 1484, 1332, 1365, 1429, 1498, 1506, 1376, 1561, 1296, null]; // Oct 20 = today's consumed
  const BURNED = [185, 374, 235, 385, 161, 479, 307, 446, 230, 321, 401, 429, 338, 343, 219];
  const TARGET_WEIGHT = 78;

  // ------------------------------------------------------------------ helpers
  const r1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
  const fmt = (n) => String(n);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function scaleItem(item, grams) {
    const f = (Number(grams) || 0) / 100;
    const macros = {}, micros = {};
    MACRO_KEYS.forEach((k) => { const v = item.per100[k] * f; macros[k] = k === 'calories' ? Math.round(v) : Math.round(v * 10) / 10; });
    MICRO_KEYS.forEach((k) => { micros[k] = Math.round(item.micro100[k] * f * 10) / 10; });
    return { macros, micros };
  }
  function computeTotals(weights) {
    const macros = {}, micros = {};
    MACRO_KEYS.forEach((k) => (macros[k] = 0));
    MICRO_KEYS.forEach((k) => (micros[k] = 0));
    ITEMS.forEach((it) => {
      const s = scaleItem(it, weights[it.key]);
      MACRO_KEYS.forEach((k) => (macros[k] += s.macros[k]));
      MICRO_KEYS.forEach((k) => (micros[k] += s.micros[k]));
    });
    MACRO_KEYS.forEach((k) => (macros[k] = k === 'calories' ? Math.round(macros[k]) : r1(macros[k])));
    MICRO_KEYS.forEach((k) => (micros[k] = r1(micros[k])));
    return { macros, micros };
  }

  // ------------------------------------------------------------------ state
  const state = {};
  function resetState(screen, params) {
    const edited = ['SCR-log-meal-details', 'SCR-log-meal-saved'].includes(screen);
    state.weights = { chicken: 120, rice: edited ? RICE_EDITED : 200, broccoli: 80, dressing: 20 };
    state.mealTime = 'lunch';
    state.menuOpen = false;
    state.range = ['week', 'month', 'year'].includes(params.range) ? params.range : 'week';
    state.busy = false;
  }

  // ------------------------------------------------------------------ shared bits
  const ICON_CAL = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="1.5" fill="none" stroke="#f3ede0" stroke-width="1.4"/><path d="M2 6.5h12M5 1.5v3M11 1.5v3" stroke="#f3ede0" stroke-width="1.4"/></svg>';

  function header(title, backEl, extraClass) {
    return `<div class="page-header ${extraClass || ''}">
      <button class="back-button" data-el="${backEl}" data-go="SCR-dashboard">← Back</button>
      <h1>${title}</h1>
      <div class="spacer"></div>
    </div>`;
  }

  // ------------------------------------------------------------------ screens
  function onboarding() {
    const accents = [['Coral', '#ff6b47'], ['Green', '#2f9e44'], ['Blue', '#3172f0'], ['Yellow', '#f0a202']];
    return `<div class="onboarding-container"><div class="onboarding-card">
      <h1 class="onboarding-title">Complete Your Profile</h1>
      <p class="onboarding-subtitle">Help us understand your weight loss goals</p>
      <div class="appearance-section">
        <p class="appearance-label">How do you want it to look?</p>
        <div class="theme-toggle-group">
          <button type="button" class="theme-option"><span class="theme-swatch theme-swatch-light"></span><span>☀️ Morning Momentum</span><span class="theme-option-desc">Light</span></button>
          <button type="button" class="theme-option active"><span class="theme-swatch theme-swatch-dark"></span><span>🌙 Night Training</span><span class="theme-option-desc">Dark</span></button>
        </div>
        <p class="appearance-label accent-label">Accent color</p>
        <div class="accent-picker">
          ${accents.map(([l, c]) => `<button type="button" class="accent-swatch-btn ${l === 'Yellow' ? 'active' : ''}" style="--swatch-color:${c}" aria-label="${l}" title="${l}"></button>`).join('')}
        </div>
      </div>
      <form class="onboarding-form" onsubmit="return false">
        <div class="form-group"><label for="ob-height">Height (cm)</label><input id="ob-height" data-el="height-input" type="text" inputmode="decimal" value="176"></div>
        <div class="form-group"><label>Biological Sex</label><button type="button" class="fake-select">Male</button></div>
        <div class="form-group"><label>Date of Birth</label><span class="fake-date">22/03/1990${ICON_CAL}</span></div>
        <div class="form-group"><label for="ob-cw">Current Weight (kg)</label><input id="ob-cw" type="text" inputmode="decimal" value="86.0"></div>
        <div class="form-group"><label for="ob-gw">Goal Weight (kg)</label><input id="ob-gw" data-el="goal-weight-input" type="text" inputmode="decimal" value="78"></div>
        <div class="form-group"><label>Goal</label><button type="button" class="fake-select">Lose Weight</button></div>
        <button type="button" class="onboarding-button on-gradient" data-el="continue-btn" data-go="SCR-dashboard">Continue to Dashboard</button>
      </form>
      <div class="progress-info"><p>You're almost there! Just a few more details to get started.</p></div>
    </div></div>`;
  }

  function dashboard() {
    const tiles = [
      ['tile-capture-weight', 'SCR-capture-weight', '📸', 'Capture Weight', 'Snap your scale, auto-logged for today', true],
      ['tile-log-weight', null, '⚖️', 'Log Weight', 'Track your daily weight'],
      ['tile-log-water', null, '💧', 'Log Water', 'Track your daily water intake'],
      ['tile-log-meal', 'SCR-log-meal-upload', '🍽️', 'Log Meal', 'Record your meals'],
      ['tile-log-calories', null, '🔥', 'Log Calories', 'Log exercise & calories burned'],
      ['tile-reports', 'SCR-reports-graph', '📊', 'Reports', 'Weight trends and diet correlation'],
      ['tile-profile', null, '👤', 'Profile', 'Update your profile'],
    ];
    return `<div class="page">
      <div class="dashboard-hero">
        <div class="dashboard-hero-text">
          <span class="dashboard-eyebrow">${DATE_LABEL}</span>
          <h1>Keep the momentum, Alex.</h1>
        </div>
        <button class="logout-button" type="button">Logout</button>
      </div>
      <div class="tile-grid">
        ${tiles.map(([el, go, ic, t, d, feat]) => `<button type="button" class="tile-card ${feat ? 'tile-card-featured' : ''}" data-el="${el}" ${go ? `data-go="${go}"` : ''}>
          <span class="tile-icon">${ic}</span><h3>${t}</h3><p>${d}</p></button>`).join('')}
      </div>
    </div>`;
  }

  function itemRows() {
    return ITEMS.map((it) => {
      const s = scaleItem(it, state.weights[it.key]);
      return `<div class="item-row">
        <span class="item-name" data-el="item-name-${it.key}" title="Click to correct this item's identification">✏️ ${esc(it.name)}<span class="source-badge gemini">AI</span></span>
        <div class="item-weight-input"><input type="text" inputmode="numeric" data-el="item-weight-${it.key}" data-item="${it.key}" value="${state.weights[it.key]}" aria-label="${esc(it.name)} weight in grams"><span class="unit">g</span></div>
        <span class="item-calories" data-kcal="${it.key}">${s.macros.calories} kcal</span>
        <button type="button" class="scan-label-btn" title="Scan the nutrition facts label for a more accurate reading">🏷️</button>
        <button type="button" class="delete-item-btn" title="Remove this item">🗑️</button>
      </div>`;
    }).join('');
  }

  function totalsGrid(t) {
    const m = t.macros, u = t.micros;
    const mac = [['Calories', m.calories + 'kcal', 'calories'], ['Protein', m.protein + 'g', 'protein'], ['Carbs', m.carbs + 'g', 'carbs'], ['Fat', m.fat + 'g', 'fat'], ['Saturated Fat', m.saturatedFat + 'g', 'saturatedFat'], ['Fiber', m.fiber + 'g', 'fiber'], ['Sugar', m.sugar + 'g', 'sugar']];
    const mic = [['Sodium', u.sodium + 'mg'], ['Cholesterol', u.cholesterol + 'mg'], ['Potassium', u.potassium + 'mg'], ['Calcium', u.calcium + 'mg'], ['Iron', u.iron + 'mg'], ['Vitamin A', u.vitaminA + 'mcg'], ['Vitamin C', u.vitaminC + 'mg'], ['Vitamin D', u.vitaminD + 'mcg'], ['Vitamin B12', u.vitaminB12 + 'mcg']];
    return `<h4 class="nutrition-subheading">Macronutrients (Total)</h4>
      <div class="nutrition-grid" data-el="macro-totals">${mac.map(([l, v, k]) => `<div class="nutrition-item"><span class="label">${l}</span><span class="value" data-total="${k}">${v}</span></div>`).join('')}</div>
      <h4 class="nutrition-subheading">Micronutrients (Total)</h4>
      <div class="nutrition-grid">${mic.map(([l, v]) => `<div class="nutrition-item"><span class="label">${l}</span><span class="value">${v}</span></div>`).join('')}</div>`;
  }

  function lunchMeal() {
    const t = computeTotals(state.weights).macros;
    return { name: 'Chicken rice bowl', calories: t.calories, protein: t.protein, carbs: t.carbs, fat: t.fat };
  }

  function budgetCard(consumed) {
    const remaining = TARGET_KCAL - consumed;
    const pct = Math.min((consumed / TARGET_KCAL) * 100, 100);
    return `<div class="cal-target-card" data-el="budget-card">
      <h2>Today's Calorie Budget</h2>
      <div class="cal-target-stats">
        <div class="cal-stat"><span class="cal-stat-value" data-el="budget-consumed">${consumed}</span><span class="cal-stat-label">Consumed</span></div>
        <div class="cal-stat"><span class="cal-stat-value">${TARGET_KCAL}</span><span class="cal-stat-label">Target</span></div>
        <div class="cal-stat"><span class="cal-stat-value" data-el="budget-remaining">${remaining}</span><span class="cal-stat-label">Remaining</span></div>
      </div>
      <div class="cal-progress-bar"><div class="cal-progress-fill" style="width:${pct.toFixed(1)}%"></div></div>
    </div>`;
  }

  function mealGroup(label, meals, el, isNew) {
    const sum = meals.reduce((a, m) => ({ calories: a.calories + m.calories, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    return `<div class="meal-time-group" data-el="${el}">
      <div class="meal-time-header"><span class="meal-time-title">${label}</span><span class="meal-time-count">${meals.length} ${meals.length === 1 ? 'capture' : 'captures'}</span></div>
      <div class="meals-list">${meals.map((m) => `<div class="meal-entry ${isNew ? 'new' : ''}">
        <div class="meal-header"><div class="meal-name">${esc(m.name)}</div><div class="meal-header-right"><div class="meal-date">${DATE_LOCAL}</div><button type="button" class="delete-meal-btn" title="Delete this meal">🗑️</button></div></div>
        <div class="meal-nutrition"><span>${m.calories} cal</span><span>${r1(m.protein)}g protein</span></div>
      </div>`).join('')}</div>
      <div class="meal-time-total"><span class="total-label">Accumulated total — ${label}</span>
        <div class="total-macros"><span><strong>${sum.calories}</strong> kcal</span><span><strong>${r1(sum.protein)}</strong>g protein</span><span><strong>${r1(sum.carbs)}</strong>g carbs</span><span><strong>${r1(sum.fat)}</strong>g fat</span></div>
      </div>
    </div>`;
  }

  // stage: upload | photo | review | details | saved
  function logMeal(stage) {
    const hasPhoto = ['photo', 'review', 'details'].includes(stage);
    const hasNutrition = ['review', 'details'].includes(stage);
    const saved = stage === 'saved';
    const lunch = lunchMeal();
    const consumed = MORNING_MEAL.calories + (saved ? lunch.calories : 0);
    const totals = computeTotals(state.weights);
    const lunchTimeLabel = { morning: 'Morning', 'mid-afternoon': 'Mid Afternoon', lunch: 'Lunch', 'mid-evening': 'Mid Evening', dinner: 'Dinner' };
    const times = Object.keys(lunchTimeLabel);

    let groups = [];
    times.forEach((t) => {
      const list = [];
      if (t === 'morning') list.push(MORNING_MEAL);
      if (saved && state.mealTime === t) list.push(lunch);
      if (list.length) groups.push(mealGroup(lunchTimeLabel[t], list, `meals-${t}-group`, saved && t === state.mealTime && t !== 'morning'));
    });

    return `<div class="page">
      ${header('Log Meal', 'meal-back-btn')}
      <div class="content-col">
        <div class="card">
          <h2>Add Meal Entry</h2>
          ${saved ? '<div class="success-message" data-el="meal-success">✓ Meal logged successfully!</div>' : ''}
          <div class="entry-mode-toggle">
            <button type="button" class="entry-mode-btn active" ${hasNutrition ? 'disabled' : ''}>📸 Photo</button>
            <button type="button" class="entry-mode-btn" ${hasNutrition ? 'disabled' : ''}>✍️ Manual Entry</button>
          </div>
          <div class="photo-section">
            <h3>Step 1: Upload Photo</h3>
            <div class="photo-input-wrapper">
              <button type="button" class="photo-upload-label" data-el="select-photo-btn" ${stage === 'upload' || saved ? 'data-go="SCR-log-meal-photo"' : ''}><span class="lbl">📸 Select or Take a Photo</span></button>
            </div>
            ${hasPhoto ? `<div class="photo-preview" data-el="meal-photo">
              <div class="photo-frame">${window.MockArt.mealPhoto}</div>
              <button type="button" class="remove-photo-btn" data-el="remove-photo-btn" data-go="SCR-log-meal-upload">✕ Remove</button>
            </div>` : ''}
          </div>
          ${stage === 'photo' ? '<button type="button" class="extract-button on-gradient" data-el="extract-btn" data-action="extract">🤖 Extract Nutrition</button>' : ''}
          ${hasNutrition ? `<div class="nutrition-section" id="step2">
            <h3>Step 2: Nutrition Information</h3>
            <div class="nutrition-card">
              <div class="nutrition-item food-name"><span class="label">Food</span><span class="value">Chicken rice bowl</span></div>
              <h4 class="nutrition-subheading">Food Items (edit weight to recalculate)</h4>
              <div class="items-list" data-el="food-items">${itemRows()}</div>
              <p class="scan-label-hint">🏷️ Tap the tag icon next to an item to scan its nutrition facts label for a more accurate reading.</p>
              <div data-totals>${totalsGrid(totals)}</div>
            </div>
          </div>
          <form class="meal-form" id="step3" onsubmit="return false">
            <h3>Step 3: Meal Details</h3>
            <div class="form-group"><label for="mealName">Meal Name</label><input id="mealName" data-el="meal-name-input" type="text" value="Chicken rice bowl" placeholder="e.g., Grilled Chicken Salad"></div>
            <div class="form-group"><label>Date</label><span class="fake-date">${DATE_LOCAL}${ICON_CAL}</span></div>
            <div class="form-group"><label>For which meal of the day?</label>
              <div class="select-wrap">
                <button type="button" class="fake-select ${state.menuOpen ? 'open' : ''}" data-el="meal-time-select" data-action="toggle-menu" aria-haspopup="listbox">${lunchTimeLabel[state.mealTime]}</button>
                <div class="select-menu ${state.menuOpen ? 'open' : ''}" role="listbox">
                  ${times.map((t) => `<button type="button" role="option" class="select-option ${state.mealTime === t ? 'selected' : ''}" data-el="meal-time-option-${t}" data-action="pick-time" data-value="${t}">${lunchTimeLabel[t]}${state.mealTime === t ? '<span>✓</span>' : ''}</button>`).join('')}
                </div>
              </div>
            </div>
            <div class="form-group"><label for="notes">Notes (optional)</label><textarea id="notes" rows="2" placeholder="Any notes about this meal?"></textarea></div>
            <div class="meal-form-actions">
              <button type="button" class="discard-button" data-el="discard-meal-btn" data-go="SCR-log-meal-upload">Discard</button>
              <button type="button" class="submit-button on-gradient" data-el="save-meal-btn" data-action="save-meal">Save Meal</button>
            </div>
          </form>` : ''}
        </div>
        ${budgetCard(consumed)}
        <div class="card recent-meals-card" data-el="meals-list">
          <h2>Meals on ${MEALS_DATE}</h2>
          <div class="meals-by-time">${groups.join('')}</div>
        </div>
      </div>
    </div>`;
  }

  // stage: idle | confirm | saved
  function captureWeight(stage) {
    return `<div class="page">
      ${header('Capture Weight', 'weight-back-btn')}
      <div class="capture-weight-card">
        <h2>Snap a Photo of Your Scale</h2>
        <p class="capture-subtitle">Take a photo of your weighing scale display and we'll read it — you can review and confirm before it's logged.</p>
        ${stage === 'saved' ? `<div class="success-message" data-el="weight-success">✓ Weight logged: 85.7 kg<br>at ${DATE_LOCAL}, 13:12:08</div>
          <button type="button" class="retake-btn" data-el="capture-another-btn" data-go="SCR-capture-weight">Capture Another</button>` : ''}
        ${stage === 'idle' ? `<div class="photo-input-wrapper" data-slot="idle">
          <button type="button" class="photo-upload-label" data-el="take-photo-btn" data-action="take-photo"><span class="lbl">📸 Take or Upload Photo</span></button>
        </div><div data-slot="reading"></div>` : ''}
        ${stage === 'confirm' ? `<div class="photo-preview" data-el="scale-photo">
          <div class="photo-frame">${window.MockArt.scalePhoto}</div>
          <button type="button" class="retake-btn" data-el="retake-btn" data-go="SCR-capture-weight">Retake</button>
        </div>
        <div class="review-card" data-el="confirm-card">
          <h3>Confirm the reading</h3>
          <div class="review-fields">
            <div class="form-group"><label for="reviewWeight">Weight (kg)</label><input id="reviewWeight" data-el="weight-input" type="text" inputmode="decimal" value="85.7"></div>
            <div class="form-group"><label for="reviewBmr">BMR (optional, kcal)</label><input id="reviewBmr" data-el="bmr-input" type="text" inputmode="numeric" placeholder="If shown on scale"></div>
          </div>
          <div class="review-actions">
            <button type="button" class="discard-review-btn" data-el="discard-weight-btn" data-go="SCR-capture-weight">Discard</button>
            <button type="button" class="save-review-btn on-gradient" data-el="save-weight-btn" data-action="save-weight">✓ Save Weight</button>
          </div>
        </div><div data-slot="saving"></div>` : ''}
        ${stage === 'saved' ? `<div class="photo-preview"><div class="photo-frame">${window.MockArt.scalePhoto}</div></div>` : ''}
      </div>
    </div>`;
  }

  function reports() {
    const latestDelta = r1(85.7 - 86.0);
    return `<div class="page">
      ${header('Reports', 'reports-back-btn', 'reports')}
      <div class="reports-content">
        <div class="view-toggle">
          <button class="view-btn active" data-el="view-graph"><span class="ic">📈</span>Graph</button>
          <button class="view-btn"><span class="ic">🥗</span>Nutrition</button>
          <button class="view-btn"><span class="ic">📋</span>Tabular</button>
          <button class="view-btn"><span class="ic">🍽️</span>Meals</button>
        </div>
        <div class="range-selector" data-el="range-selector">
          ${['week', 'month', 'year'].map((r) => `<button class="range-btn ${state.range === r ? 'active on-gradient' : ''}" data-el="range-${r}" data-action="range" data-value="${r}">${r[0].toUpperCase() + r.slice(1)}</button>`).join('')}
        </div>
        <div class="stats-row">
          <div class="stat-pill" data-el="target-weight-pill"><span class="stat-pill-label">🎯 Target Weight</span><span class="stat-pill-value">${TARGET_WEIGHT} kg</span></div>
          <div class="stat-pill good" data-el="latest-weight-pill"><span class="stat-pill-label">Latest Weight</span><span class="stat-pill-value">85.7 kg</span><span class="stat-pill-subtitle down">▼ ${Math.abs(latestDelta)} kg vs previous</span></div>
        </div>
        <div class="series-selector">
          <button class="series-btn active" style="border-color:#667eea;color:#8f9cf5"><span class="series-swatch" style="background:#667eea"></span>⚖️ Weight</button>
          <button class="series-btn active" style="border-color:#f6ad55;color:#f6ad55"><span class="series-swatch" style="background:#f6ad55"></span>🍽️ Calorie Intake</button>
          <button class="series-btn active" style="border-color:#48bb78;color:#5fcf8e"><span class="series-swatch" style="background:#48bb78"></span>🔥 Calories Burnt</button>
        </div>
        <div class="chart-card" data-el="weight-chart">
          <div data-chart>${chartSVG(state.range)}</div>
          <div class="chart-legend">
            <span><span class="legend-dot down"></span> Lost weight</span>
            <span><span class="legend-dot up"></span> Gained weight</span>
            <span class="legend-hint">Click a point/bar to see that day's diet</span>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ------------------------------------------------------------------ chart (mirrors the Recharts ComposedChart)
  function monotonePath(pts) {
    // d3.curveMonotoneX
    const n = pts.length;
    if (n < 2) return '';
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const d = [], m = [];
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) {
      if (d[i - 1] * d[i] <= 0) m[i] = 0;
      else {
        const h0 = xs[i] - xs[i - 1], h1 = xs[i + 1] - xs[i];
        const p = (d[i - 1] * h1 + d[i] * h0) / (h0 + h1);
        m[i] = (Math.sign(d[i - 1]) + Math.sign(d[i])) * Math.min(Math.abs(d[i - 1]), Math.abs(d[i]), 0.5 * Math.abs(p));
      }
    }
    let s = `M${xs[0].toFixed(2)},${ys[0].toFixed(2)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = (xs[i + 1] - xs[i]) / 3;
      s += `C${(xs[i] + h).toFixed(2)},${(ys[i] + m[i] * h).toFixed(2)},${(xs[i + 1] - h).toFixed(2)},${(ys[i + 1] - m[i + 1] * h).toFixed(2)},${xs[i + 1].toFixed(2)},${ys[i + 1].toFixed(2)}`;
    }
    return s;
  }

  function chartSVG(range) {
    const start = range === 'week' ? DAYS.length - 7 : 0;
    const today = MORNING_MEAL.calories + lunchMeal().calories;
    const intake = INTAKE.map((v, i) => (v == null ? today : v)).slice(start);
    const days = DAYS.slice(start), weights = WEIGHTS.slice(start), burned = BURNED.slice(start);
    const W = 302, H = 340, L = 60, R = 232, T = 10, B = 310;
    const n = days.length, band = (R - L) / n;
    const xAt = (i) => L + band * (i + 0.5);
    const wv = weights.filter((w) => w != null);
    const wMin = r1(Math.min(...wv) - 2), wMax = r1(Math.max(...wv) + 2);
    const calMax = Math.max(...intake, ...burned) + 100;
    const yW = (w) => B - ((w - wMin) / (wMax - wMin)) * (B - T);
    const yC = (c) => B - (c / calMax) * (B - T);

    // ticks like Recharts' nice ticks: from min in steps, plus the max
    const wStep = range === 'week' ? 1.5 : 2;
    const wTicks = [];
    for (let v = wMin; v < wMax - 0.35; v = r1(v + wStep)) wTicks.push(v);
    wTicks.push(wMax);
    const cTicks = [0, 450, 900, 1350].filter((v) => v < calMax - 120).concat([calMax]);
    const xTickIdx = range === 'week' ? [0, 2, 4, 6] : [2, 6, 10, 14];
    const gridX = range === 'week' ? [1, 3, 5, 6] : [2, 5, 9, 14];

    const barW = Math.min(22, (band * 0.8 - 4) / 2);
    let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Weight against calorie intake and calories burnt, ${days[0]} to ${days[n - 1]}">`;
    // grid (dashed, as rendered by CartesianGrid on the dark theme)
    s += `<g stroke="#eee" stroke-dasharray="3 3" stroke-width="1" fill="none">`;
    s += `<line x1="${L}" y1="${T}" x2="${R - 2}" y2="${T}"/>`;
    gridX.forEach((i) => (s += `<line x1="${xAt(i).toFixed(1)}" y1="${T}" x2="${xAt(i).toFixed(1)}" y2="${B}"/>`));
    s += `</g>`;
    // bars
    intake.forEach((v, i) => {
      const x = xAt(i) - barW - 2, y = yC(v);
      s += `<rect class="grow" style="animation-delay:${(i * 0.02).toFixed(2)}s" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barW.toFixed(2)}" height="${(B - y).toFixed(2)}" rx="${Math.min(3, barW / 2).toFixed(2)}" fill="#f6ad55"/>`;
    });
    burned.forEach((v, i) => {
      const x = xAt(i) + 2, y = yC(v);
      s += `<rect class="grow" style="animation-delay:${(i * 0.02).toFixed(2)}s" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barW.toFixed(2)}" height="${(B - y).toFixed(2)}" rx="${Math.min(3, barW / 2).toFixed(2)}" fill="#48bb78"/>`;
    });
    // axes
    s += `<g stroke="#666" stroke-width="1"><line x1="${L}" y1="${T}" x2="${L}" y2="${B}"/><line x1="${R}" y1="${T}" x2="${R}" y2="${B}"/><line x1="${L}" y1="${B}" x2="${R}" y2="${B}"/>`;
    wTicks.forEach((v) => (s += `<line x1="${L - 6}" y1="${yW(v).toFixed(1)}" x2="${L}" y2="${yW(v).toFixed(1)}"/>`));
    cTicks.forEach((v) => (s += `<line x1="${R}" y1="${yC(v).toFixed(1)}" x2="${R + 6}" y2="${yC(v).toFixed(1)}"/>`));
    xTickIdx.forEach((i) => (s += `<line x1="${xAt(i).toFixed(1)}" y1="${B}" x2="${xAt(i).toFixed(1)}" y2="${B + 6}"/>`));
    s += `</g>`;
    wTicks.forEach((v) => (s += `<text class="tick" x="${L - 9}" y="${(yW(v) + 4).toFixed(1)}" text-anchor="end">${v.toFixed(1)}</text>`));
    cTicks.forEach((v) => (s += `<text class="tick" x="${R + 9}" y="${(yC(v) + 4).toFixed(1)}">${v}</text>`));
    xTickIdx.forEach((i) => (s += `<text class="tick" x="${xAt(i).toFixed(1)}" y="${B + 20}" text-anchor="middle">${days[i]}</text>`));
    s += `<text class="axis-label" transform="translate(12 ${(T + B) / 2}) rotate(-90)" text-anchor="middle">Weight (kg)</text>`;
    s += `<text class="axis-label" transform="translate(${W - 10} ${(T + B) / 2}) rotate(90)" text-anchor="middle">Calories</text>`;
    // weight line (connectNulls) + dots
    const pts = [];
    weights.forEach((w, i) => { if (w != null) pts.push([xAt(i), yW(w)]); });
    s += `<path class="draw" d="${monotonePath(pts)}" fill="none" stroke="#667eea" stroke-width="2"/>`;
    s += `<g class="dots">`;
    let prev = start > 0 ? WEIGHTS.slice(0, start).filter((w) => w != null).pop() : null;
    weights.forEach((w, i) => {
      if (w == null) return;
      const delta = prev == null ? null : r1(w - prev);
      const c = delta == null ? '#667eea' : delta > 0 ? '#e53e3e' : delta < 0 ? '#38a169' : '#667eea';
      s += `<circle cx="${xAt(i).toFixed(2)}" cy="${yW(w).toFixed(2)}" r="5" fill="${c}" stroke="white" stroke-width="2"/>`;
      prev = w;
    });
    s += `</g></svg>`;
    return s;
  }

  // ------------------------------------------------------------------ router
  const SCREENS = {
    'SCR-onboarding': { group: 'onboarding', render: onboarding },
    'SCR-dashboard': { group: 'dashboard', render: dashboard },
    'SCR-log-meal-upload': { group: 'meal', render: () => logMeal('upload') },
    'SCR-log-meal-photo': { group: 'meal', render: () => logMeal('photo') },
    'SCR-log-meal-review': { group: 'meal', render: () => logMeal('review'), anchor: '#step2' },
    'SCR-log-meal-details': { group: 'meal', render: () => logMeal('details'), anchor: '#step3' },
    'SCR-log-meal-saved': { group: 'meal', render: () => logMeal('saved') },
    'SCR-capture-weight': { group: 'weight', render: () => captureWeight('idle') },
    'SCR-capture-weight-confirm': { group: 'weight', render: () => captureWeight('confirm') },
    'SCR-capture-weight-saved': { group: 'weight', render: () => captureWeight('saved') },
    'SCR-reports-graph': { group: 'reports', render: reports },
  };

  let current = null;
  let internalNav = false;
  let timers = [];
  const app = document.getElementById('app');

  Object.keys(SCREENS).forEach((id) => {
    const sec = document.createElement('section');
    sec.className = 'screen';
    sec.setAttribute('data-screen', id);
    sec.setAttribute('data-state', 'default');
    app.appendChild(sec);
  });

  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    const [id, query] = raw.split('?');
    const params = {};
    (query || '').split('&').filter(Boolean).forEach((kv) => { const [k, v] = kv.split('='); params[k] = v; });
    return { id: SCREENS[id] ? id : 'SCR-onboarding', params };
  }

  function anchorTop(sec, sel) {
    const el = sec.querySelector(sel);
    if (!el) return 0;
    return Math.max(0, el.getBoundingClientRect().top - sec.getBoundingClientRect().top + sec.scrollTop - 12);
  }

  function show() {
    const { id, params } = parseHash();
    const internal = internalNav;
    internalNav = false;
    timers.forEach(clearTimeout); timers = [];
    if (!internal) resetState(id, params);
    state.menuOpen = false;
    state.busy = false;

    const prev = current ? document.querySelector(`[data-screen="${current}"]`) : null;
    const sec = document.querySelector(`[data-screen="${id}"]`);
    const sameGroup = internal && current && SCREENS[current].group === SCREENS[id].group;
    const prevScroll = prev ? prev.scrollTop : 0;

    sec.innerHTML = SCREENS[id].render();
    sec.setAttribute('data-state', 'default');
    document.querySelectorAll('.screen').forEach((s) => { if (s !== sec) { s.classList.remove('active', 'enter'); s.innerHTML = ''; } });
    sec.classList.add('active');
    sec.classList.remove('enter');
    if (!sameGroup) { void sec.offsetWidth; sec.classList.add('enter'); }
    current = id;
    document.title = `Weight Loss Tracker · ${id}`;

    const anchor = SCREENS[id].anchor;
    const target = anchor ? anchorTop(sec, anchor) : 0;
    if (sameGroup) {
      sec.scrollTop = prevScroll;
      if (Math.abs(prevScroll - target) > 2) sec.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      sec.scrollTop = target;
    }
  }

  function go(id) {
    internalNav = true;
    if (location.hash === '#' + id) show();
    else location.hash = id;
  }

  // ------------------------------------------------------------------ live recalculation (F1.S5)
  function recalc(sec) {
    const totals = computeTotals(state.weights);
    ITEMS.forEach((it) => {
      const k = sec.querySelector(`[data-kcal="${it.key}"]`);
      if (k) k.textContent = scaleItem(it, state.weights[it.key]).macros.calories + ' kcal';
    });
    const box = sec.querySelector('[data-totals]');
    if (box) {
      const before = {};
      box.querySelectorAll('[data-total]').forEach((e) => (before[e.dataset.total] = e.textContent));
      box.innerHTML = totalsGrid(totals);
      box.querySelectorAll('[data-total]').forEach((e) => { if (before[e.dataset.total] !== e.textContent) e.classList.add('flash'); });
    }
  }

  function scheduleAdvance() {
    const sec = document.querySelector(`[data-screen="${current}"]`);
    if (current !== 'SCR-log-meal-review' || state.advancing) return;
    state.advancing = true;
    timers.push(setTimeout(() => { state.advancing = false; go('SCR-log-meal-details'); }, 800));
    void sec;
  }

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset && t.dataset.item) {
      state.weights[t.dataset.item] = Number(t.value.replace(/[^0-9.]/g, '')) || 0;
      recalc(t.closest('.screen'));
    }
  });
  document.addEventListener('change', (e) => { if (e.target.dataset && e.target.dataset.item) scheduleAdvance(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.dataset && e.target.dataset.item) { e.preventDefault(); e.target.blur(); scheduleAdvance(); }
  });

  // ------------------------------------------------------------------ clicks
  document.addEventListener('click', (e) => {
    const goEl = e.target.closest('[data-go]');
    const actEl = e.target.closest('[data-action]');
    if (actEl) {
      e.preventDefault();
      const sec = actEl.closest('.screen');
      const a = actEl.dataset.action;
      if (state.busy) return;
      if (a === 'extract') {
        state.busy = true;
        actEl.disabled = true;
        actEl.textContent = 'Analyzing...';
        actEl.classList.add('pulse');
        timers.push(setTimeout(() => go('SCR-log-meal-review'), 1200));
      } else if (a === 'toggle-menu') {
        state.menuOpen = !state.menuOpen;
        actEl.classList.toggle('open', state.menuOpen);
        sec.querySelector('.select-menu').classList.toggle('open', state.menuOpen);
      } else if (a === 'pick-time') {
        state.mealTime = actEl.dataset.value;
        state.menuOpen = false;
        const labels = { morning: 'Morning', 'mid-afternoon': 'Mid Afternoon', lunch: 'Lunch', 'mid-evening': 'Mid Evening', dinner: 'Dinner' };
        const btn = sec.querySelector('[data-el="meal-time-select"]');
        btn.textContent = labels[state.mealTime];
        btn.classList.remove('open');
        const menu = sec.querySelector('.select-menu');
        menu.classList.remove('open');
        menu.querySelectorAll('.select-option').forEach((o) => {
          const on = o.dataset.value === state.mealTime;
          o.classList.toggle('selected', on);
          o.innerHTML = labels[o.dataset.value] + (on ? '<span>✓</span>' : '');
        });
      } else if (a === 'save-meal') {
        state.busy = true;
        actEl.disabled = true;
        actEl.textContent = 'Saving...';
        timers.push(setTimeout(() => go('SCR-log-meal-saved'), 700));
      } else if (a === 'take-photo') {
        state.busy = true;
        const idle = sec.querySelector('[data-slot="idle"]');
        idle.outerHTML = `<div class="photo-preview"><div class="photo-frame">${window.MockArt.scalePhoto}</div></div>`;
        sec.querySelector('[data-slot="reading"]').innerHTML = '<div class="processing-indicator pulse" data-el="reading-indicator">🤖 Reading your scale...</div>';
        timers.push(setTimeout(() => go('SCR-capture-weight-confirm'), 1400));
      } else if (a === 'save-weight') {
        state.busy = true;
        const v = sec.querySelector('[data-el="weight-input"]').value || '85.7';
        sec.querySelector('[data-slot="saving"]').innerHTML = `<div class="processing-indicator pulse">💾 Logging ${esc(v)} kg for today...</div>`;
        actEl.disabled = true;
        timers.push(setTimeout(() => go('SCR-capture-weight-saved'), 900));
      } else if (a === 'range') {
        state.range = actEl.dataset.value;
        sec.querySelectorAll('[data-action="range"]').forEach((b) => { const on = b.dataset.value === state.range; b.classList.toggle('active', on); b.classList.toggle('on-gradient', on); });
        sec.querySelector('[data-chart]').innerHTML = chartSVG(state.range);
        sec.scrollTo({ top: sec.scrollHeight, behavior: 'smooth' });
      }
      return;
    }
    if (goEl) {
      e.preventDefault();
      if (state.busy) return;
      go(goEl.dataset.go);
      return;
    }
    // close an open dropdown when tapping elsewhere
    if (state.menuOpen && !e.target.closest('.select-wrap')) {
      state.menuOpen = false;
      document.querySelectorAll('.select-menu.open, .fake-select.open').forEach((m) => m.classList.remove('open'));
    }
  });

  window.addEventListener('hashchange', show);

  show();
  const ready = () => document.documentElement.setAttribute('data-ready', '1');
  if (document.fonts && document.fonts.load) {
    Promise.all(['20px "Bebas Neue"', '14px Karla', '600 14px Karla', '700 14px Karla', 'italic 13px Karla'].map((f) => document.fonts.load(f)))
      .then(() => document.fonts.ready).then(ready, ready);
  } else ready();
})();
