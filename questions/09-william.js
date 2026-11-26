// William: ulcerative colitis
// See README.md ("Adding questions") for what each field does.
NUMERACY.addWorkbook({
  id: "william",
  title: "William: ulcerative colitis",
  system: "Gastrointestinal system",
  theme: "gastrointestinal",
  summary: "BMI, bowel frequency, NEWS2, pump and drip rates, fluid balance and weight change.",
  questions: [
    {
      id: "williamBmi",
      topic: "BMI",
      title: "Calculate William’s BMI",
      context: "William weighs 65 kg and is 1.74 m tall. He reports recent unintentional weight loss.",
      data: ["Weight: 65 kg", "Height: 1.74 m"],
      prompt: "Calculate William’s BMI. Give your answer to one decimal place.",
      expected: 65 / (1.74 * 1.74),
      dp: 1,
      unit: "kg/m²",
      units: ["kg/m²", "kg", "%"],
      formula: "BMI = weight (kg) ÷ height² (m²)",
      hint: "Square 1.74 first, then divide 65 by the answer.",
      explanation: "1.74 × 1.74 = 3.0276. 65 ÷ 3.0276 = 21.469…, which rounds to 21.5 kg/m². BMI alone does not describe recent nutritional change."
    },
    {
      id: "williamBowelFrequency",
      topic: "Bowel frequency",
      title: "Calculate the change in bowel frequency",
      context: "Before his symptoms worsened, William usually opened his bowels once each day. He is now opening his bowels approximately eight times each day.",
      data: [
        "Usual bowel frequency: 1 motion per day",
        "Current bowel frequency: 8 motions per day"
      ],
      prompt: "Calculate the number of additional bowel motions William is experiencing each day.",
      expected: 7,
      unit: "motions per day",
      units: ["motions per day", "motions", "times per day"],
      formula: "Additional motions = current daily frequency − usual daily frequency",
      hint: "Subtract 1 from 8.",
      explanation: "8 − 1 = 7 additional bowel motions per day."
    },
    {
      id: "williamNews",
      topic: "NEWS2",
      title: "Calculate William’s NEWS2 score",
      context: "Use the NEWS2 Scale 1 reference in the Tools drawer.",
      data: [
        "Respiratory rate: 22 breaths/min",
        "SpO₂: 97% on room air",
        "Supplemental oxygen: no",
        "Temperature: 37.8°C",
        "Systolic BP: 104 mmHg",
        "Pulse: 112 bpm",
        "Consciousness: alert"
      ],
      prompt: "Calculate and enter William’s NEWS2 score.",
      expected: 5,
      unit: "points",
      units: ["points", "score", "bpm"],
      formula: "NEWS2 total = sum of each parameter score",
      hint: "Score each observation separately, then add the scores.",
      explanation: "Respiratory rate 22 = 2; SpO₂ 97% = 0; supplemental oxygen = 0; temperature 37.8°C = 0; systolic BP 104 = 1; pulse 112 = 2; alert = 0. Total = 5 points.",
      scoreTitle: "NEWS2 parameter scores",
      scoreList: [
        "Respiratory rate 22 = 2 points",
        "SpO₂ 97% on Scale 1 = 0 points",
        "Supplemental oxygen: no = 0 points",
        "Temperature 37.8°C = 0 points",
        "Systolic BP 104 = 1 point",
        "Pulse 112 = 2 points",
        "Alert = 0 points"
      ],
      showNews: true
    },
    {
      id: "williamFluidRate",
      topic: "IV infusion rate",
      title: "Calculate William’s IV fluid rate",
      context: "Following review, William is prescribed 1,000 mL of sodium chloride 0.9% over four hours.",
      data: ["Total volume: 1,000 mL", "Prescribed time: 4 hours"],
      prompt: "Calculate the infusion rate in mL/hour.",
      expected: 250,
      unit: "mL/hour",
      units: ["mL/hour", "mL/min", "L/hour"],
      formula: "Rate = total volume ÷ time",
      hint: "Divide 1,000 mL by 4 hours.",
      explanation: "1,000 mL ÷ 4 hours = 250 mL/hour."
    },
    {
      id: "williamDripRate",
      topic: "Gravity drip rate",
      title: "Calculate the drip rate",
      context: "The same 1,000 mL infusion is to be given over four hours using a gravity giving set that delivers 20 drops per mL.",
      data: ["Volume: 1,000 mL", "Time: 4 hours (240 minutes)", "Giving set: 20 drops/mL"],
      prompt: "Calculate the drip rate in drops/minute. Give your answer to the nearest whole drop.",
      expected: (1000 * 20) / 240,
      dp: 0,
      strictRounding: true,
      unit: "drops/minute",
      units: ["drops/minute", "mL/hour", "drops/hour"],
      formula: "Drops/minute = (volume (mL) × drops per mL) ÷ time (minutes)",
      hint: "Convert 4 hours to minutes first, then multiply 1,000 by 20 and divide by the minutes.",
      explanation: "(1,000 mL × 20 drops/mL) ÷ 240 minutes = 20,000 ÷ 240 = 83.33… drops/minute. You cannot count part of a drop, so round to 83 drops/minute."
    },
    {
      id: "williamFluidIntake",
      topic: "Fluid balance",
      title: "Calculate William’s total fluid intake",
      context: "William’s fluid intake is recorded over 24 hours.",
      data: ["Oral fluids: 750 mL", "IV fluids: 2,000 mL"],
      prompt: "Calculate William’s total fluid intake over 24 hours.",
      expected: 2750,
      unit: "mL",
      units: ["mL", "L", "mL/hour"],
      formula: "Total fluid intake = oral fluids + IV fluids",
      hint: "Add 750 mL and 2,000 mL.",
      explanation: "750 mL + 2,000 mL = 2,750 mL."
    },
    {
      id: "williamFluidBalance",
      topic: "Fluid balance",
      title: "Calculate William’s fluid balance",
      context: "Use William’s 24-hour fluid totals to calculate his balance.",
      data: [
        "Total fluid intake: 2,750 mL",
        "Urine output: 1,150 mL",
        "Measured liquid stool losses: 1,250 mL"
      ],
      prompt: "Calculate William’s 24-hour fluid balance. Enter the number and select the unit.",
      expected: 350,
      unit: "mL",
      units: ["mL", "L", "mL/hour"],
      formula: "Fluid balance = total intake − total measured output",
      hint: "Add the two outputs first, then subtract them from intake.",
      explanation: "Total output = 1,150 mL + 1,250 mL = 2,400 mL. Fluid balance = 2,750 mL − 2,400 mL = +350 mL. A positive balance alone does not establish adequate hydration."
    },
    {
      id: "williamWeightGain",
      topic: "Weight change",
      title: "Calculate William’s weight gain",
      context: "William’s weight is recorded again during his ongoing assessment.",
      data: ["Admission weight: 65 kg", "Current weight: 67 kg"],
      prompt: "Calculate William’s weight gain in kg.",
      expected: 2,
      unit: "kg",
      units: ["kg", "g", "%"],
      formula: "Weight gain = current weight − admission weight",
      hint: "Subtract 65 kg from 67 kg.",
      explanation: "67 kg − 65 kg = 2 kg."
    },
    {
      id: "williamWeightPercent",
      topic: "Weight change",
      title: "Calculate percentage weight increase",
      context: "William’s admission weight was 65 kg and his current weight is 67 kg.",
      data: [
        "Admission weight: 65 kg",
        "Current weight: 67 kg",
        "Weight increase: 2 kg"
      ],
      prompt: "Calculate the percentage increase from William’s admission weight. Give your answer to one decimal place.",
      expected: (2 / 65) * 100,
      dp: 1,
      unit: "%",
      units: ["%", "kg", "points"],
      formula: "Percentage increase = (weight increase ÷ admission weight) × 100",
      hint: "Divide 2 by 65, then multiply by 100.",
      explanation: "(2 kg ÷ 65 kg) × 100 = 3.076…, which rounds to 3.1%. Consider weight alongside fluid balance, stool frequency, intake and overall assessment."
    }
  ]
});
