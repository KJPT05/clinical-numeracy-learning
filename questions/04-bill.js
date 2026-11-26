// Bill: acute upper gastrointestinal bleeding
// See README.md ("Adding questions") for what each field does.
NUMERACY.addWorkbook({
  id: "bill",
  title: "Bill: acute upper gastrointestinal bleeding",
  system: "Blood and blood vessels",
  theme: "blood",
  summary: "Haemoglobin, NEWS2, red-cell volume, transfusion pump and drip rates, and urine output.",
  questions: [
    {
      id: "billBmi",
      topic: "BMI",
      title: "Calculate Bill’s BMI",
      context: "Bill weighs 82 kg and is 1.75 m tall.",
      data: ["Weight: 82 kg", "Height: 1.75 m"],
      prompt: "Calculate Bill’s BMI. Give your answer to one decimal place.",
      expected: 82 / (1.75 * 1.75),
      dp: 1,
      unit: "kg/m²",
      units: ["kg/m²", "kg", "%"],
      formula: "BMI = weight ÷ height²",
      hint: "Square height first.",
      explanation: "82 ÷ (1.75 × 1.75) = 26.7755…, rounded to 26.8 kg/m²."
    },
    {
      id: "haemoglobinDifference",
      topic: "Haemoglobin",
      title: "Calculate difference below reference limit",
      context: "Bill’s admission haemoglobin is 72 g/L. The stated lower reference limit is 130 g/L.",
      data: [
        "Admission haemoglobin: 72 g/L",
        "Stated lower reference limit: 130 g/L"
      ],
      prompt: "Calculate how many g/L below the stated lower reference limit Bill’s haemoglobin is.",
      expected: 58,
      unit: "g/L",
      units: ["g/L", "mg/L", "mmol/L"],
      formula: "Difference = lower reference limit − measured haemoglobin",
      hint: "Subtract the result from the reference limit.",
      explanation: "130 g/L − 72 g/L = 58 g/L."
    },
    {
      id: "billNews",
      topic: "NEWS2",
      title: "Calculate Bill’s NEWS2 score",
      context: "Use the NEWS2 Scale 1 reference in the Tools drawer.",
      data: [
        "Respiratory rate: 24 breaths/min",
        "SpO₂: 96% on room air",
        "Supplemental oxygen: no",
        "Temperature: 36.8°C",
        "Systolic BP: 90 mmHg",
        "Pulse: 118 bpm",
        "Consciousness: Alert"
      ],
      prompt: "Calculate and enter Bill’s NEWS2 score.",
      expected: 7,
      unit: "points",
      units: ["points", "score", "bpm"],
      formula: "NEWS2 total = sum of each parameter score",
      hint: "Score each observation, then add.",
      explanation: "Respiratory rate 24 = 2; systolic BP 90 = 3; pulse 118 = 2; all other parameters = 0. Total = 7 points.",
      scoreTitle: "NEWS2 parameter scores",
      scoreList: [
        "Respiratory rate 24 = 2 points",
        "SpO₂ 96% = 0 points",
        "Supplemental oxygen: no = 0 points",
        "Temperature 36.8°C = 0 points",
        "Systolic BP 90 = 3 points",
        "Pulse 118 = 2 points",
        "Alert = 0 points"
      ],
      showNews: true
    },
    {
      id: "redCellVolume",
      topic: "Red-cell volume",
      title: "Calculate total red-cell volume",
      context: "Bill is prescribed two red-cell units. Each unit contains 280 mL.",
      data: ["Number of units: 2", "Volume per unit: 280 mL"],
      prompt: "Calculate total volume across both units.",
      expected: 560,
      unit: "mL",
      units: ["mL", "L", "mL/hour"],
      formula: "Total volume = number of units × volume per unit",
      hint: "Multiply units by volume.",
      explanation: "2 × 280 mL = 560 mL."
    },
    {
      id: "redCellRate",
      topic: "Red-cell rate",
      title: "Calculate rate for one red-cell unit",
      context: "Each red-cell unit contains 280 mL and is administered one unit at a time over two hours.",
      data: [
        "One unit volume: 280 mL",
        "Time for one unit: 2 hours",
        "Units administered sequentially"
      ],
      prompt: "Calculate the infusion rate for one unit in mL/hour.",
      expected: 140,
      unit: "mL/hour",
      units: ["mL/hour", "mL/min", "L/hour"],
      formula: "Rate = volume of one unit ÷ time",
      hint: "Divide volume by hours.",
      explanation: "280 mL ÷ 2 hours = 140 mL/hour."
    },
    {
      id: "redCellDripRate",
      topic: "Gravity drip rate",
      title: "Calculate the drip rate for one red-cell unit",
      context: "If an infusion pump is not available, the red-cell unit could be given using a blood administration set. The set delivers 15 drops per mL.",
      data: ["Volume: 280 mL", "Time: 2 hours (120 minutes)", "Blood administration set: 15 drops/mL"],
      prompt: "Calculate the drip rate in drops/minute. Give your answer to the nearest whole drop.",
      expected: (280 * 15) / 120,
      dp: 0,
      strictRounding: true,
      unit: "drops/minute",
      units: ["drops/minute", "mL/hour", "drops/hour"],
      formula: "Drops/minute = (volume (mL) × drops per mL) ÷ time (minutes)",
      hint: "Multiply 280 by 15, then divide by the time in minutes (2 hours = 120 minutes).",
      explanation: "(280 mL × 15 drops/mL) ÷ 120 minutes = 4,200 ÷ 120 = 35 drops/minute. Blood sets usually deliver 15 drops/mL; standard crystalloid sets usually deliver 20 drops/mL."
    },
    {
      id: "billUrine",
      topic: "Urine output",
      title: "Calculate urine output",
      context: "Bill’s urine output is recorded over 24 hours.",
      data: ["Weight: 82 kg", "Total urine output: 1,800 mL", "Duration: 24 hours"],
      prompt: "Calculate urine output in mL/kg/hour. Give your answer to two decimal places.",
      expected: 1800 / 82 / 24,
      dp: 2,
      unit: "mL/kg/hour",
      units: ["mL/kg/hour", "mL/hour", "mL/kg"],
      formula: "Urine output = total output ÷ weight ÷ time",
      hint: "Divide by weight and then by hours.",
      explanation: "1,800 ÷ 82 ÷ 24 = 0.9146… = 0.91 mL/kg/hour."
    },
    {
      id: "haemoglobinIncrease",
      topic: "Haemoglobin response",
      title: "Calculate haemoglobin increase",
      context: "Bill’s repeat haemoglobin is 92 g/L after treatment.",
      data: ["Admission haemoglobin: 72 g/L", "Repeat haemoglobin: 92 g/L"],
      prompt: "Calculate the increase in haemoglobin.",
      expected: 20,
      unit: "g/L",
      units: ["g/L", "mg/L", "%"],
      formula: "Increase = repeat − admission",
      hint: "Subtract admission value.",
      explanation: "92 g/L − 72 g/L = 20 g/L."
    },
    {
      id: "haemoglobinPercent",
      topic: "Percentage change",
      title: "Calculate percentage haemoglobin increase",
      context: "Use Bill’s admission and repeat haemoglobin values.",
      data: [
        "Admission haemoglobin: 72 g/L",
        "Repeat haemoglobin: 92 g/L",
        "Haemoglobin increase: 20 g/L"
      ],
      prompt: "Calculate percentage increase in haemoglobin. Give your answer to one decimal place.",
      expected: (20 / 72) * 100,
      dp: 1,
      unit: "%",
      units: ["%", "g/L", "mmol/L"],
      formula: "Percentage increase = (increase ÷ original value) × 100",
      hint: "Divide the increase by admission haemoglobin.",
      explanation: "(20 ÷ 72) × 100 = 27.777…%. Rounded to one decimal place this is 27.8%. The app accepts 27.78% or 27.8%."
    }
  ]
});
