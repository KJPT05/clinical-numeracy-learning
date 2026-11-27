// Topic drills: questions with new numbers every time a drill is started.
// Each drill has a make() function that returns one question in the same
// format as the workbook questions (see README.md, "Adding questions").
(function () {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min, max, step = 1) => min + step * Math.floor(Math.random() * (Math.floor((max - min) / step) + 1));
  const clean = n => Math.round(n * 1e9) / 1e9;
  const fmt = n => clean(n).toLocaleString('en-GB', { maximumFractionDigits: 6 });

  // Masses are held in mg internally.
  const massText = (mg, unit) => {
    if (unit === 'g') return `${fmt(mg / 1000)} g`;
    if (unit === 'micrograms') return `${fmt(mg * 1000)} micrograms`;
    return `${fmt(mg)} mg`;
  };

  // ---------- Tablets and capsules ----------
  const tabletDrugs = [
    { drug: 'prednisolone', strength: 5, doses: [10, 15, 20, 25, 30, 40], doseUnits: ['mg'] },
    { drug: 'bisoprolol', strength: 1.25, doses: [2.5, 3.75, 5], doseUnits: ['mg'] },
    { drug: 'furosemide', strength: 20, doses: [40, 60, 80], doseUnits: ['mg'] },
    { drug: 'paracetamol', strength: 500, doses: [1000], doseUnits: ['g'] },
    { drug: 'aspirin (dispersible)', strength: 75, doses: [150, 300], doseUnits: ['mg'] },
    { drug: 'levothyroxine', strength: 0.025, strengthUnit: 'micrograms', doses: [0.05, 0.075, 0.1, 0.125], doseUnits: ['micrograms', 'mg'] },
    { drug: 'digoxin', strength: 0.0625, strengthUnit: 'micrograms', doses: [0.125, 0.0625], doseUnits: ['micrograms', 'mg'] },
    { drug: 'cefalexin capsules', strength: 250, doses: [500], doseUnits: ['mg', 'g'], form: 'capsules' }
  ];
  NUMERACY.addDrill({
    id: 'drill-tablets',
    title: 'Tablets and capsules',
    summary: 'How many tablets or capsules for one dose, including doses written in different units.',
    count: 10,
    make() {
      const d = pick(tabletDrugs);
      const dose = pick(d.doses);
      const doseUnit = pick(d.doseUnits);
      const sUnit = d.strengthUnit || 'mg';
      const form = d.form || 'tablets';
      const answer = clean(dose / d.strength);
      const convert = doseUnit !== sUnit;
      return {
        topic: 'Tablets and capsules',
        title: `Calculate ${d.drug.replace(' capsules', '')} ${form} for one dose`,
        context: `${massText(dose, doseUnit)} of ${d.drug.replace(' capsules', '')} is prescribed. Each ${form === 'capsules' ? 'capsule' : 'tablet'} contains ${massText(d.strength, sUnit)}.`,
        data: [`Prescribed dose: ${massText(dose, doseUnit)}`, `Available: ${massText(d.strength, sUnit)} per ${form === 'capsules' ? 'capsule' : 'tablet'}`],
        prompt: `How many ${form} are needed for one dose?`,
        expected: answer,
        unit: form,
        units: [form, 'mg', 'doses'],
        formula: `Number of ${form} = dose prescribed ÷ strength of one ${form === 'capsules' ? 'capsule' : 'tablet'} (same units)`,
        hint: convert ? `Convert both amounts to the same unit first (1 mg = 1,000 micrograms; 1 g = 1,000 mg).` : `Divide the dose by the strength of one ${form === 'capsules' ? 'capsule' : 'tablet'}.`,
        explanation: (convert ? `${massText(dose, doseUnit)} = ${massText(dose, sUnit)}. ` : '') +
          `${massText(dose, sUnit)} ÷ ${massText(d.strength, sUnit)} = ${fmt(answer)} ${form}.`
      };
    }
  });

  // ---------- Oral liquids ----------
  const liquids = [
    { drug: 'amoxicillin', mg: 250, ml: 5, doses: [250, 500] },
    { drug: 'paracetamol', mg: 250, ml: 5, doses: [500, 1000] },
    { drug: 'oral morphine solution', mg: 10, ml: 5, doses: [2.5, 5, 10] },
    { drug: 'furosemide oral solution', mg: 20, ml: 5, doses: [20, 40] },
    { drug: 'flucloxacillin', mg: 250, ml: 5, doses: [250, 500] },
    { drug: 'omeprazole oral suspension', mg: 20, ml: 5, doses: [20, 40] }
  ];
  NUMERACY.addDrill({
    id: 'drill-liquids',
    title: 'Oral liquid medicines',
    summary: 'Volume of oral solution or suspension to give for a prescribed dose.',
    count: 10,
    make() {
      const d = pick(liquids);
      const dose = pick(d.doses);
      const useGrams = dose >= 1000 && Math.random() < 0.5;
      const answer = clean((dose / d.mg) * d.ml);
      return {
        topic: 'Oral liquid medicine',
        title: `Calculate the volume of ${d.drug}`,
        context: `${d.drug.charAt(0).toUpperCase() + d.drug.slice(1)} ${massText(dose, useGrams ? 'g' : 'mg')} is prescribed. The liquid available contains ${d.mg} mg in ${d.ml} mL.`,
        data: [`Prescribed dose: ${massText(dose, useGrams ? 'g' : 'mg')}`, `Available: ${d.mg} mg in ${d.ml} mL`],
        prompt: 'What volume contains the prescribed dose?',
        expected: answer,
        unit: 'mL',
        units: ['mL', 'mg', 'mg/mL'],
        formula: 'Volume = (dose prescribed ÷ dose available) × volume available',
        hint: useGrams ? 'Convert the dose to mg first.' : `Divide ${fmt(dose)} by ${d.mg}, then multiply by ${d.ml} mL.`,
        explanation: (useGrams ? `${massText(dose, 'g')} = ${fmt(dose)} mg. ` : '') +
          `(${fmt(dose)} mg ÷ ${d.mg} mg) × ${d.ml} mL = ${fmt(answer)} mL.`
      };
    }
  });

  // ---------- Injections ----------
  const injections = [
    { drug: 'furosemide', mg: 50, ml: 5, doses: [20, 40, 60, 80] },
    { drug: 'enoxaparin', mg: 100, ml: 1, doses: [40, 60, 70, 80, 90, 100] },
    { drug: 'morphine sulfate', mg: 10, ml: 1, doses: [2.5, 5, 7.5, 10] },
    { drug: 'gentamicin', mg: 80, ml: 2, doses: [80, 100, 120, 140] },
    { drug: 'ondansetron', mg: 4, ml: 2, doses: [4, 8] },
    { drug: 'metoclopramide', mg: 10, ml: 2, doses: [10] },
    { drug: 'cyclizine', mg: 50, ml: 1, doses: [25, 50] }
  ];
  NUMERACY.addDrill({
    id: 'drill-injections',
    title: 'Injection volumes',
    summary: 'Volume to draw up from an ampoule, vial or pre-filled syringe.',
    count: 10,
    make() {
      const d = pick(injections);
      const dose = pick(d.doses);
      const answer = clean((dose / d.mg) * d.ml);
      return {
        topic: 'Injection volume',
        title: `Calculate the ${d.drug} volume`,
        context: `${d.drug.charAt(0).toUpperCase() + d.drug.slice(1)} ${fmt(dose)} mg is prescribed. The injection available contains ${d.mg} mg in ${d.ml} mL.`,
        data: [`Prescribed dose: ${fmt(dose)} mg`, `Available: ${d.mg} mg in ${d.ml} mL`],
        prompt: 'What volume should be drawn up?',
        expected: answer,
        unit: 'mL',
        units: ['mL', 'mg', 'mg/mL'],
        formula: 'Volume = (dose prescribed ÷ dose available) × volume available',
        hint: `Divide ${fmt(dose)} by ${d.mg}, then multiply by ${d.ml} mL.`,
        explanation: `(${fmt(dose)} mg ÷ ${d.mg} mg) × ${d.ml} mL = ${fmt(answer)} mL.`
      };
    }
  });

  // ---------- Unit conversions ----------
  const conversions = [
    { from: 'micrograms', to: 'mg', values: [25, 50, 62.5, 125, 250, 500, 750], factor: 1 / 1000, rule: 'divide by 1,000' },
    { from: 'mg', to: 'micrograms', values: [0.05, 0.0625, 0.125, 0.25, 0.5, 1.5], factor: 1000, rule: 'multiply by 1,000' },
    { from: 'mg', to: 'g', values: [75, 250, 500, 1200, 1500, 2000], factor: 1 / 1000, rule: 'divide by 1,000' },
    { from: 'g', to: 'mg', values: [0.25, 0.5, 1.2, 1.5, 2, 4.5], factor: 1000, rule: 'multiply by 1,000' },
    { from: 'L', to: 'mL', values: [0.25, 0.75, 1.5, 2.1, 3], factor: 1000, rule: 'multiply by 1,000' },
    { from: 'mL', to: 'L', values: [250, 750, 1500, 2100, 500], factor: 1 / 1000, rule: 'divide by 1,000' }
  ];
  NUMERACY.addDrill({
    id: 'drill-conversions',
    title: 'Unit conversions',
    summary: 'Micrograms, milligrams, grams, litres and millilitres.',
    count: 10,
    make() {
      const c = pick(conversions);
      const v = pick(c.values);
      const answer = clean(v * c.factor);
      const all = { micrograms: ['micrograms', 'mg', 'g'], mg: ['mg', 'micrograms', 'g'], g: ['g', 'mg', 'micrograms'], mL: ['mL', 'L', 'mL/hour'], L: ['L', 'mL', 'mL/hour'] };
      return {
        topic: 'Unit conversion',
        title: `Convert ${c.from} to ${c.to}`,
        context: `A dose or volume is written as ${fmt(v)} ${c.from}.`,
        data: [`Amount: ${fmt(v)} ${c.from}`],
        prompt: `Express ${fmt(v)} ${c.from} in ${c.to}.`,
        expected: answer,
        unit: c.to,
        units: all[c.to],
        formula: c.from === 'micrograms' || c.to === 'micrograms' ? '1 mg = 1,000 micrograms' : c.from === 'g' || c.to === 'g' ? '1 g = 1,000 mg' : '1 L = 1,000 mL',
        hint: `To convert ${c.from} to ${c.to}, ${c.rule}.`,
        explanation: `${fmt(v)} ${c.from} → ${c.rule} → ${fmt(answer)} ${c.to}.`
      };
    }
  });

  // ---------- Infusion pump rates (mL/hour) ----------
  NUMERACY.addDrill({
    id: 'drill-pump',
    title: 'Infusion pump rates',
    summary: 'mL/hour from a volume and a time given in hours or minutes.',
    count: 10,
    make() {
      let volume, minutes;
      do {
        if (Math.random() < 0.6) {
          volume = pick([250, 500, 1000]);
          minutes = 60 * pick([1, 2, 4, 5, 6, 8, 10, 12]);
        } else {
          volume = pick([50, 100, 250]);
          minutes = pick([15, 20, 30, 60]);
        }
      } while ((volume * 60) % minutes !== 0);
      const answer = (volume * 60) / minutes;
      const timeText = minutes >= 60 && minutes % 60 === 0 ? `${minutes / 60} hour${minutes === 60 ? '' : 's'}` : `${minutes} minutes`;
      const what = volume <= 250 && minutes < 60 ? 'An IV medicine has been prepared in' : 'An IV infusion of sodium chloride 0.9% contains';
      return {
        topic: 'Infusion pump rate',
        title: 'Calculate the pump rate',
        context: `${what} ${fmt(volume)} mL. It is prescribed over ${timeText}.`,
        data: [`Volume: ${fmt(volume)} mL`, `Time: ${timeText}`],
        prompt: 'Calculate the pump rate in mL/hour.',
        expected: answer,
        unit: 'mL/hour',
        units: ['mL/hour', 'mL/min', 'drops/minute'],
        formula: 'Rate (mL/hour) = volume (mL) ÷ time (hours)',
        hint: minutes < 60 ? `Convert ${minutes} minutes to hours first (÷ 60).` : 'Divide the volume by the number of hours.',
        explanation: minutes < 60
          ? `${minutes} minutes = ${fmt(minutes / 60)} hours. ${fmt(volume)} mL ÷ ${fmt(minutes / 60)} hours = ${fmt(answer)} mL/hour.`
          : `${fmt(volume)} mL ÷ ${minutes / 60} hours = ${fmt(answer)} mL/hour.`
      };
    }
  });

  // ---------- Gravity drip rates ----------
  NUMERACY.addDrill({
    id: 'drill-drip',
    title: 'Gravity drip rates',
    summary: 'Drops/minute with crystalloid (20 drops/mL) and blood (15 drops/mL) giving sets.',
    count: 10,
    make() {
      const blood = Math.random() < 0.35;
      const volume = blood ? pick([250, 280, 300, 320]) : pick([500, 1000]);
      const hours = blood ? pick([2, 3, 4]) : pick([2, 4, 6, 8, 10, 12]);
      const dpm = blood ? 15 : 20;
      const minutes = hours * 60;
      const exact = (volume * dpm) / minutes;
      return {
        topic: 'Gravity drip rate',
        title: 'Calculate the drip rate',
        context: blood
          ? `A unit of red cells (${volume} mL) is to be given over ${hours} hours using a blood administration set that delivers ${dpm} drops/mL.`
          : `${fmt(volume)} mL of sodium chloride 0.9% is to be given over ${hours} hours using a giving set that delivers ${dpm} drops/mL.`,
        data: [`Volume: ${fmt(volume)} mL`, `Time: ${hours} hours`, `Giving set: ${dpm} drops/mL`],
        prompt: 'Calculate the drip rate in drops/minute. Give your answer to the nearest whole drop.',
        expected: exact,
        dp: 0,
        strictRounding: true,
        unit: 'drops/minute',
        units: ['drops/minute', 'mL/hour', 'drops/hour'],
        formula: 'Drops/minute = (volume (mL) × drops per mL) ÷ time (minutes)',
        hint: `Convert ${hours} hours to minutes first (× 60).`,
        explanation: `${hours} hours = ${minutes} minutes. (${fmt(volume)} × ${dpm}) ÷ ${minutes} = ${fmt(volume * dpm)} ÷ ${minutes} = ${fmt(Math.round(exact * 100) / 100)}${Number.isInteger(clean(exact)) ? '' : '…'}, so ${Math.round(exact)} drops/minute.`
      };
    }
  });

  // ---------- Weight-based doses ----------
  const weightDoses = [
    () => { const w = randInt(50, 110); return { drug: 'enoxaparin', per: 1, unit: 'mg', w, text: '1 mg/kg' }; },
    () => { const w = randInt(51, 90, 3); return { drug: 'gentamicin', per: 5, unit: 'mg', w, text: '5 mg/kg daily', divide: 3 }; },
    () => { const w = randInt(30, 90); return { drug: 'IV lorazepam', per: 0.1, unit: 'mg', w, text: '0.1 mg/kg', max: 4 }; },
    () => { const w = randInt(35, 49); return { drug: 'IV paracetamol', per: 15, unit: 'mg', w, text: '15 mg/kg' }; },
    () => { const w = randInt(50, 110); return { drug: 'fixed-rate insulin', per: 0.1, unit: 'units/hour', w, text: '0.1 units/kg/hour' }; }
  ];
  NUMERACY.addDrill({
    id: 'drill-weight',
    title: 'Weight-based doses',
    summary: 'mg/kg and units/kg/hour doses, including divided daily doses and checking against a maximum dose.',
    count: 10,
    make() {
      const d = pick(weightDoses)();
      const raw = clean(d.per * d.w);
      const answer = d.divide ? clean(raw / d.divide) : d.max ? Math.min(raw, d.max) : raw;
      const capped = d.max && raw > d.max;
      return {
        topic: d.max ? 'Weight-based dose with a maximum' : 'Weight-based dose',
        title: `Calculate the ${d.drug} dose`,
        context: `${d.drug.charAt(0).toUpperCase() + d.drug.slice(1)} is prescribed at ${d.text}${d.divide ? ` in ${d.divide} divided doses, given every 8 hours` : ''}${d.max ? `, to a maximum single dose of ${d.max} mg` : ''}. The patient’s dosing weight is ${d.w} kg.`,
        data: [`Prescribed: ${d.text}${d.divide ? ` in ${d.divide} divided doses (every 8 hours)` : ''}`, ...(d.max ? [`Maximum single dose: ${d.max} mg`] : []), `Dosing weight: ${d.w} kg`],
        prompt: d.divide ? 'Calculate the amount for each 8-hourly dose.' : d.max ? 'Calculate the dose to give, taking the maximum dose into account.' : `Calculate the dose in ${d.unit}.`,
        expected: answer,
        unit: d.unit,
        units: d.unit === 'mg' ? ['mg', 'mg/kg', 'mL'] : ['units/hour', 'units/kg', 'mL/hour'],
        formula: 'Dose = dose per kg × weight' + (d.divide ? ', then divide by the number of doses' : '') + (d.max ? ', then compare with the maximum' : ''),
        hint: `Multiply ${fmt(d.per)} by ${d.w}.` + (d.divide ? ` Then divide the daily total by ${d.divide}.` : '') + (d.max ? ' Then check the maximum.' : ''),
        explanation: `${d.text.replace(' daily', '')} × ${d.w} kg = ${fmt(raw)} ${d.unit}${d.divide ? ' daily' : ''}.` + (d.divide ? ` ${fmt(raw)} ÷ ${d.divide} = ${fmt(answer)} ${d.unit} every 8 hours.` : '') +
          (d.max ? (capped ? ` This is more than the ${d.max} mg maximum, so give ${d.max} mg.` : ` This is within the ${d.max} mg maximum.`) : '')
      };
    }
  });

  // ---------- Concentrations (mg/mL) ----------
  const concentrations = [
    { drug: 'furosemide injection', amount: 50, unit: 'mg', vol: 5 },
    { drug: 'furosemide injection', amount: 20, unit: 'mg', vol: 2 },
    { drug: 'gentamicin injection', amount: 80, unit: 'mg', vol: 2 },
    { drug: 'ondansetron injection', amount: 4, unit: 'mg', vol: 2 },
    { drug: 'metoclopramide injection', amount: 10, unit: 'mg', vol: 2 },
    { drug: 'fondaparinux pre-filled syringe', amount: 2.5, unit: 'mg', vol: 0.5 },
    { drug: 'enoxaparin pre-filled syringe', amount: 40, unit: 'mg', vol: 0.4 },
    { drug: 'amoxicillin oral suspension', amount: 250, unit: 'mg', vol: 5 },
    { drug: 'paracetamol oral suspension', amount: 250, unit: 'mg', vol: 5 },
    { drug: 'oral morphine solution', amount: 10, unit: 'mg', vol: 5 },
    { drug: 'omeprazole oral suspension', amount: 20, unit: 'mg', vol: 5 }
  ];
  NUMERACY.addDrill({
    id: 'drill-concentration',
    title: 'Concentrations',
    summary: 'Work out mg per mL from the amount of drug and the volume it is in.',
    count: 10,
    make() {
      const c = pick(concentrations);
      const answer = clean(c.amount / c.vol);
      return {
        topic: 'Concentration',
        title: `Calculate the concentration of ${c.drug}`,
        context: `The label on the ${c.drug} says it contains ${fmt(c.amount)} ${c.unit} in ${fmt(c.vol)} mL.`,
        data: [`Amount of drug: ${fmt(c.amount)} ${c.unit}`, `Volume: ${fmt(c.vol)} mL`],
        prompt: 'Calculate the concentration in mg/mL.',
        expected: answer,
        unit: 'mg/mL',
        units: ['mg/mL', 'mg', 'mL'],
        formula: 'Concentration (mg/mL) = amount of drug (mg) ÷ volume (mL)',
        hint: `Divide ${fmt(c.amount)} by ${fmt(c.vol)}.`,
        explanation: `${fmt(c.amount)} mg ÷ ${fmt(c.vol)} mL = ${fmt(answer)} mg/mL.`
      };
    }
  });

  // ---------- Infusion finish times ----------
  NUMERACY.addDrill({
    id: 'drill-times',
    title: 'Infusion times',
    summary: 'How long an infusion will take and what time it will finish (24-hour clock).',
    count: 10,
    make() {
      const combos = [[1000, 125], [1000, 250], [500, 125], [500, 100], [500, 200], [1000, 100], [250, 50], [1000, 200]];
      const [volume, rate] = pick(combos);
      const minutes = (volume / rate) * 60;
      const start = randInt(0, 23 * 4 + 3) * 15;
      const end = (start + minutes) % (24 * 60);
      const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      const askTime = Math.random() < 0.6;
      const base = {
        topic: 'Infusion time',
        context: `${fmt(volume)} mL of IV fluid is running at ${rate} mL/hour. It started at ${hhmm(start)}.`,
        data: [`Volume: ${fmt(volume)} mL`, `Rate: ${rate} mL/hour`, `Start time: ${hhmm(start)}`],
        hint: 'Duration (hours) = volume ÷ rate. Then add it to the start time.'
      };
      if (askTime) {
        return Object.assign(base, {
          title: 'Calculate the finish time',
          prompt: 'At what time will the infusion finish? Use the 24-hour clock.',
          answerType: 'time',
          expected: hhmm(end),
          formula: 'Finish time = start time + (volume ÷ rate)',
          explanation: `${fmt(volume)} ÷ ${rate} = ${fmt(minutes / 60)} hours (${minutes} minutes). ${hhmm(start)} + ${fmt(minutes / 60)} hours = ${hhmm(end)}${start + minutes >= 1440 ? ' the next day' : ''}.`
        });
      }
      return Object.assign(base, {
        title: 'Calculate the infusion duration',
        prompt: 'How long will the infusion take, in hours?',
        expected: minutes / 60,
        unit: 'hours',
        units: ['hours', 'minutes', 'mL/hour'],
        formula: 'Duration (hours) = volume (mL) ÷ rate (mL/hour)',
        hint: 'Divide the volume by the rate.',
        explanation: `${fmt(volume)} mL ÷ ${rate} mL/hour = ${fmt(minutes / 60)} hours.`
      });
    }
  });

  // ---------- Fluid balance (including negative balances) ----------
  NUMERACY.addDrill({
    id: 'drill-fluid',
    title: 'Fluid balance',
    summary: 'Positive and negative balances from intake and output records.',
    count: 10,
    make() {
      const intakeItems = [
        ['Oral fluids', randInt(200, 1200, 50)],
        ['IV fluids', pick([0, 500, 1000, 1500])],
        ['Tea', randInt(1, 4) * 200]
      ].filter(i => i[1] > 0);
      const outputItems = [
        ['Urine', randInt(400, 2200, 50)],
        ...(Math.random() < 0.4 ? [['Vomit', randInt(100, 400, 50)]] : []),
        ...(Math.random() < 0.3 ? [['Drain', randInt(50, 300, 50)]] : [])
      ];
      const tin = intakeItems.reduce((a, b) => a + b[1], 0);
      const tout = outputItems.reduce((a, b) => a + b[1], 0);
      const bal = tin - tout;
      return {
        topic: 'Fluid balance',
        title: 'Calculate the fluid balance',
        context: 'A patient’s intake and output have been recorded over 24 hours.',
        data: [...intakeItems.map(i => `Intake – ${i[0]}: ${fmt(i[1])} mL`), ...outputItems.map(o => `Output – ${o[0]}: ${fmt(o[1])} mL`)],
        prompt: 'Calculate the 24-hour fluid balance. Use the ± button for a negative balance.',
        expected: bal,
        unit: 'mL',
        units: ['mL', 'L', 'mL/hour'],
        formula: 'Fluid balance = total intake − total output',
        hint: 'Total the intake, total the output, then subtract. If output is bigger, the answer is negative.',
        explanation: `Intake = ${fmt(tin)} mL. Output = ${fmt(tout)} mL. ${fmt(tin)} − ${fmt(tout)} = ${bal > 0 ? '+' : ''}${fmt(bal).replace('-', '−')} mL${bal < 0 ? ' (a negative balance)' : bal > 0 ? ' (a positive balance)' : ''}.`
      };
    }
  });
})();
