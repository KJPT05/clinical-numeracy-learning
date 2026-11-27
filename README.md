# Clinical Numeracy Learning

An interactive, browser-based resource for clinical-numeracy education and revision.

## What's included

**Patient case workbooks** (in `questions/`)

| File | Workbook | Questions |
|---|---|---|
| 01-frank.js | Frank – acute heart failure | 12 |
| 02-luke.js | Luke – acute asthma | 8 |
| 03-mollie.js | Mollie – fluid overload in CKD | 7 |
| 04-bill.js | Bill – acute upper GI bleeding | 9 |
| 05-thomas.js | Thomas – suspected DKA | 10 |
| 06-robert.js | Robert – prolonged convulsive seizure | 8 |
| 07-patricia.js | Patricia – acute manic episode | 8 |
| 08-catherine.js | Catherine – suspected urosepsis | 8 |
| 09-william.js | William – ulcerative colitis | 9 |
| 10-laura.js | Laura – acute pyelonephritis | 10 |
| 11-george.js | George – exacerbation of COPD | 10 |
| 12-ruth.js | Ruth – Parkinson’s disease | 10 |
| 13-stephen.js | Stephen – acute coronary syndrome | 10 |

**Calculation skills** (in `js/drills.js`, shown first on the choice screen, in the order set by `SKILL_ORDER` in `js/app.js`) – new numbers every attempt: tablets and capsules, oral liquids, injection volumes, concentrations, unit conversions, infusion pump rates, gravity drip rates, weight-based doses, infusion times, and fluid balance.

## Modes

| | Learn | Practice | Challenge |
|---|---|---|---|
| Calculator | ✓ | ✓ | ✓ |
| Units and conversions | ✓ | ✓ | – |
| NEWS2 chart | ✓ | ✓ | – |
| Formula | ✓ | – | – |
| Hint | ✓ | – | – |
| Item scores (NEWS2, PHQ-9, GCS) | ✓ | – | – |
| Feedback | After each answer | After each answer | At the end |

After finishing, students can **review** their answers (read only, so a Challenge score is never overwritten) and **quick retry** the questions they got wrong, with Learn support. Retries don't change the score.

## Marking

- If a question asks for rounding (`dp`), only the correctly rounded value is marked correct. A *more precise* value that is consistent with the exact answer (e.g. 29.07 for 29.1) is accepted, with a reminder to follow the rounding instruction. Wrong roundings (e.g. 4.6 for 4.651…) are always rejected.
- `strictRounding: true` means that only the rounded value is accepted (used for drops/minute, where part of a drop cannot be counted).
- If there is no `dp`, the answer must match exactly.
- Specific feedback is given for rounding slips, sign errors (positive vs negative), and the wrong unit.
- Answers can be typed with commas (1,000). Negative values use the ± button (needed on iPhones, whose number keypad has no minus key).

## Adding questions

1. Copy an existing file in `questions/`, e.g. `10-laura.js`, and give it a new number and name.
2. Edit the workbook details and questions (fields explained below).
3. Add one line to `index.html` with the other question files:
   `<script src="./questions/14-yourname.js"></script>`
4. Run the checker (see below). The workbook card appears automatically on the choice screen.

### Workbook fields

| Field | Meaning |
|---|---|
| `id` | Short unique name, no spaces (e.g. `"laura"`). Never change it once published, because saved progress uses it. |
| `title` | Shown on the card, e.g. `"Laura: acute pyelonephritis"`. The part before the colon is used on the button. |
| `system` | The coloured label, e.g. `"Renal system"`. |
| `theme` | Colour: `cardio`, `respiratory`, `renal`, `blood`, `endocrine`, `neuro`, `mental-health`, `immune`, `gastrointestinal`. |
| `summary` | One line describing the calculations. |
| `intro` | Optional case summary, shown before starting and in a fold-out on every question. |

### Question fields

| Field | Meaning |
|---|---|
| `id` | Unique within the workbook. Never change it once published. |
| `topic` | Small heading above the title, e.g. `"IV infusion rate"`. |
| `title` | Question heading. |
| `context` | The scenario sentence. |
| `data` | List of the information provided, one item per line. |
| `prompt` | The instruction. If rounding is needed, say so here (e.g. "Give your answer to one decimal place."). |
| `expected` | The exact answer. You can write the calculation itself, e.g. `80 / (1.78 * 1.78)` – this avoids typing a rounded number by mistake. |
| `dp` | Decimal places required (`0`, `1` or `2`). Leave out if no rounding is asked for. |
| `strictRounding` | Optional `true`: accept only the rounded value. |
| `unit` | The correct unit. |
| `units` | The dropdown choices; must include `unit`. Three is a good number. |
| `formula`, `hint` | Shown in Learn mode. |
| `explanation` | Worked method shown in feedback. Should include the final answer. |
| `unitNote` | Optional extra feedback when the wrong unit is chosen. |
| `answerType: "time"` | For a 24-hour time answer; then `expected` is `"HH:MM"` and no unit is needed. |
| `showNews: true` | Adds the NEWS2 chart button. |
| `scoreList`, `scoreTitle` | Item-by-item scores, shown in Learn mode only. |

## Checking questions before publishing

With Node.js installed, run from this folder:

```
node tools/check-questions.js
```

It checks that every question is complete, that the model answer is marked correct, that wrong roundings, wrong signs and wrong units are rejected, that the `dp` matches the rounding asked for in the prompt, that the explanation shows the answer, and that every NEWS2 question recalculates to its expected score. It also generates 400 questions from each drill and checks them all.

If the site is deployed on Netlify from GitHub, `netlify.toml` runs this check automatically, and a deploy with errors is stopped.

## Single-file version (for Blackboard or emailing)

```
node tools/build-single-file.js
```

This creates `dist/clinical-numeracy-learning.html`, a single file containing everything.

## Use

Open `index.html` in a current web browser, or use the hosted version. No installation, account, or internet connection is required once the files are available locally.

## Progress and privacy

The app stores learner progress, answers, and settings locally in the browser using local storage. It does not collect, transmit, or share personal data. Progress is specific to the browser and device being used; clearing browser data removes saved progress. Progress saved by v1.9 is carried over automatically.

## Educational-use statement

All patients and scenarios are fictional. Medicines, doses, strengths and rates are included for calculation practice only; they may not reflect current guidance, the BNF or local policy, and must not be used as a dosing reference.

This resource supports clinical-numeracy education and revision only. It does not provide clinical advice and must not be used to calculate, verify, or make decisions about real patient care or medicine administration.

Always follow local policy, approved medicines information, supervision requirements, escalation procedures, and professional judgement.

## Version

Current release: v2.0

### Changes in v2.0

- Questions moved into one file per workbook; workbook cards built automatically.
- Strict rounding marking; specific feedback for rounding, sign and unit errors.
- ± button for negative answers (iPhone keypad has no minus key).
- Calculator: brackets, x², Ans, continue from answer, keyboard input.
- Practice mode now gives less support than Learn (no formula, hint or item scores).
- Read-only review and quick retry no longer change Challenge results.
- Content: NEWS2 chart corrected (supplemental oxygen scores 2, not 3); William’s BMI corrected to 21.5; Robert’s weight-based dose now lorazepam with the 4 mg maximum; duplicate PHQ-9 questions in Thomas and Catherine replaced with an insulin syringe-pump rate and a fluid-bolus rate; drip-rate questions added to Bill and William.
- New workbooks: Laura, George, Ruth, Stephen. New randomised topic drills.
- Accessibility: feedback announced to screen readers, keyboard focus managed in the tools drawer and dialogs, Escape closes them, larger question buttons, no browser pop-ups.
- Progress storage key no longer changes between versions.
- Statement added that all patients and scenarios are fictional and doses are for calculation practice only.
- Choice screen reorganised: Step 1 calculation skills (in teaching order), then Step 2 patient cases. "Topic drills" renamed "Calculation skills".
- Medicines screening against NICE, SmPCs and the BNF: Stephen's anticoagulant changed to fondaparinux; Luke's nebulisers named (salbutamol and ipratropium); lithium and olanzapine doses aligned with the BNF; lansoprazole suspension replaced with licensed omeprazole suspension; gentamicin uses the BNF 8-hourly regimen; the syringe pump drill is replaced with a concentrations drill.
