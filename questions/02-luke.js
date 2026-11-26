// Luke: acute asthma
// See README.md ("Adding questions") for what each field does.
NUMERACY.addWorkbook({
  id: "luke",
  title: "Luke: acute asthma",
  system: "Respiratory system",
  theme: "respiratory",
  summary: "Peak flow, inhaler use, volume, oxygen duration and response to treatment.",
  questions: [
    {
      id: "pefDifference",
      topic: "Peak flow",
      title: "Calculate peak flow below personal best",
      context: "Luke’s personal-best peak expiratory flow is 480 L/min. His admission peak flow is 210 L/min.",
      data: ["Personal best: 480 L/min", "Admission peak flow: 210 L/min"],
      prompt: "Calculate how many L/min below personal best Luke is on admission.",
      expected: 270,
      unit: "L/min",
      units: ["L/min", "%", "mL/min"],
      formula: "Difference = personal-best peak flow − current peak flow",
      hint: "Subtract admission peak flow from personal best.",
      explanation: "480 L/min − 210 L/min = 270 L/min."
    },
    {
      id: "pefAdmissionPercent",
      topic: "Peak flow",
      title: "Calculate admission peak flow percentage",
      context: "Luke’s personal-best peak flow is 480 L/min. Admission peak flow is 210 L/min.",
      data: ["Personal best: 480 L/min", "Admission peak flow: 210 L/min"],
      prompt: "Calculate admission peak flow as a percentage of personal best. Give your answer to one decimal place.",
      expected: (210 / 480) * 100,
      dp: 1,
      unit: "%",
      units: ["%", "L/min", "mL"],
      formula: "Percentage = (current peak flow ÷ personal best) × 100",
      hint: "Divide 210 by 480, then multiply by 100.",
      explanation: "(210 ÷ 480) × 100 = 43.75%. Rounded to one decimal place, the answer is 43.8%. The app also accepts 43.75% as the exact calculated value before rounding."
    },
    {
      id: "relieverPuffs",
      topic: "Inhaler use",
      title: "Calculate total reliever inhaler use",
      context: "Luke took two puffs of his reliever inhaler on six occasions in 24 hours.",
      data: ["Puffs on each occasion: 2", "Number of occasions: 6"],
      prompt: "Calculate total reliever inhaler puffs used during the previous 24 hours.",
      expected: 12,
      unit: "puffs",
      units: ["puffs", "doses", "mg"],
      formula: "Total puffs = puffs per occasion × occasions",
      hint: "Multiply puffs each time by occasions.",
      explanation: "2 puffs × 6 occasions = 12 puffs."
    },
    {
      id: "nebuliserVolume",
      topic: "Volume calculation",
      title: "Calculate nebuliser volume",
      context: "Two pre-measured liquids are provided for a nebuliser chamber.",
      data: ["Solution A: 2.5 mL", "Solution B: 2.5 mL"],
      prompt: "Calculate the total volume in the nebuliser chamber.",
      expected: 5,
      unit: "mL",
      units: ["mL", "mg", "L"],
      formula: "Total volume = volume A + volume B",
      hint: "Add the two volumes.",
      explanation: "2.5 mL + 2.5 mL = 5 mL."
    },
    {
      id: "cylinderMinutes",
      topic: "Oxygen duration",
      title: "Calculate cylinder duration",
      context: "An oxygen cylinder contains 680 L and the prescribed flow rate is 4 L/min.",
      data: ["Available oxygen: 680 L", "Flow rate: 4 L/min"],
      prompt: "Calculate the estimated duration in minutes.",
      expected: 170,
      unit: "minutes",
      units: ["minutes", "hours", "L/min"],
      formula: "Duration = available oxygen ÷ flow rate",
      hint: "Divide litres by litres per minute.",
      explanation: "680 L ÷ 4 L/min = 170 minutes."
    },
    {
      id: "cylinderHours",
      topic: "Time conversion",
      title: "Convert cylinder duration to hours",
      context: "The calculated cylinder duration is 170 minutes.",
      data: ["Duration: 170 minutes", "1 hour: 60 minutes"],
      prompt: "Convert 170 minutes into decimal hours. Give your answer to two decimal places.",
      expected: 170 / 60,
      dp: 2,
      unit: "hours",
      units: ["hours", "minutes", "L/hour"],
      formula: "Hours = minutes ÷ 60",
      hint: "Divide minutes by 60.",
      explanation: "170 ÷ 60 = 2.8333… hours, rounded to 2.83 hours."
    },
    {
      id: "pefImprovement",
      topic: "Peak-flow response",
      title: "Calculate peak-flow improvement",
      context: "Luke’s peak flow rises from 210 L/min to 320 L/min.",
      data: [
        "Admission peak flow: 210 L/min",
        "Post-treatment peak flow: 320 L/min"
      ],
      prompt: "Calculate the increase in peak flow.",
      expected: 110,
      unit: "L/min",
      units: ["L/min", "%", "mL/min"],
      formula: "Increase = post-treatment peak flow − admission peak flow",
      hint: "Subtract the admission value.",
      explanation: "320 L/min − 210 L/min = 110 L/min."
    },
    {
      id: "pefPostTreatmentPercent",
      topic: "Peak-flow response",
      title: "Calculate post-treatment peak flow percentage",
      context: "Luke’s post-treatment peak flow is 320 L/min. Personal best remains 480 L/min.",
      data: ["Personal best: 480 L/min", "Post-treatment peak flow: 320 L/min"],
      prompt: "Calculate post-treatment peak flow as a percentage of personal best. Give your answer to one decimal place.",
      expected: (320 / 480) * 100,
      dp: 1,
      unit: "%",
      units: ["%", "L/min", "mL"],
      formula: "Percentage = (current peak flow ÷ personal best) × 100",
      hint: "Divide 320 by 480, then multiply by 100.",
      explanation: "(320 ÷ 480) × 100 = 66.6667%. Rounded to one decimal place this is 66.7%. The app accepts 66.67% or 66.7%."
    }
  ]
});
