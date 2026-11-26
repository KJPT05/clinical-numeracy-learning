// Robert: prolonged convulsive seizure
// See README.md ("Adding questions") for what each field does.
NUMERACY.addWorkbook({
  id: "robert",
  title: "Robert: prolonged convulsive seizure",
  system: "Neurological system",
  theme: "neuro",
  summary: "Timing, medicine calculations, glucose, GCS and recovery monitoring.",
  questions: [
    {
      id: "seizureDuration",
      topic: "Time calculation",
      title: "Calculate seizure duration",
      context: "Robert’s seizure began at 10:12. Emergency assessment begins at 10:17.",
      data: ["Seizure start: 10:12", "Emergency assessment: 10:17"],
      prompt: "Calculate the duration of the seizure.",
      expected: 5,
      unit: "minutes",
      units: ["minutes", "seconds", "hours"],
      formula: "Duration = end time − start time",
      hint: "Count the minutes between 10:12 and 10:17.",
      explanation: "10:17 − 10:12 = 5 minutes."
    },
    {
      id: "weightDose",
      topic: "Weight-based dose with a maximum",
      title: "Calculate the lorazepam dose",
      context: "IV lorazepam is prescribed at 0.1 mg/kg, to a maximum single dose of 4 mg. Robert weighs 74 kg.",
      data: ["Prescribed dose: 0.1 mg/kg", "Maximum single dose: 4 mg", "Weight: 74 kg"],
      prompt: "Calculate the dose Robert should receive, taking the maximum dose into account.",
      expected: 4,
      unit: "mg",
      units: ["mg", "mL", "mg/kg"],
      formula: "Dose = dose per kg × weight, then compare with the maximum dose",
      hint: "Work out 0.1 × 74 first, then check it against the 4 mg maximum.",
      explanation: "0.1 mg/kg × 74 kg = 7.4 mg. This is more than the 4 mg maximum, so the dose is 4 mg. Always check a weight-based dose against any stated maximum."
    },
    {
      id: "glucoseDifference",
      topic: "Blood glucose",
      title: "Calculate difference below stated minimum",
      context: "Robert’s capillary blood glucose is 3.2 mmol/L. The stated minimum for this exercise is 4.0 mmol/L.",
      data: ["Measured glucose: 3.2 mmol/L", "Stated minimum: 4.0 mmol/L"],
      prompt: "Calculate how far below 4.0 mmol/L Robert’s blood glucose is.",
      expected: 0.8,
      unit: "mmol/L",
      units: ["mmol/L", "mg/dL", "%"],
      formula: "Difference = stated minimum − measured glucose",
      hint: "Subtract 3.2 from 4.0.",
      explanation: "4.0 mmol/L − 3.2 mmol/L = 0.8 mmol/L."
    },
    {
      id: "medicineVolume",
      topic: "Medicine volume",
      title: "Calculate medicine volume",
      context: "A prescribed dose is 10 mg. Available concentration is 5 mg/mL.",
      data: ["Prescribed dose: 10 mg", "Available concentration: 5 mg/mL"],
      prompt: "Calculate the volume required.",
      expected: 2,
      unit: "mL",
      units: ["mL", "mg", "mL/hour"],
      formula: "Volume = dose ÷ concentration",
      hint: "Divide the prescribed dose by the concentration.",
      explanation: "10 mg ÷ 5 mg/mL = 2 mL."
    },
    {
      id: "infusionRate",
      topic: "IV infusion rate",
      title: "Calculate infusion pump rate",
      context: "A prescribed infusion has a total volume of 100 mL and is to run over 15 minutes.",
      data: ["Total volume: 100 mL", "Prescribed time: 15 minutes"],
      prompt: "Calculate the pump rate in mL/hour.",
      expected: 400,
      unit: "mL/hour",
      units: ["mL/hour", "mL/min", "L/hour"],
      formula: "Rate = volume ÷ time in hours",
      hint: "Convert 15 minutes to 0.25 hours first.",
      explanation: "15 minutes = 0.25 hours. 100 mL ÷ 0.25 hours = 400 mL/hour."
    },
    {
      id: "gcs",
      topic: "Glasgow Coma Scale",
      title: "Calculate Glasgow Coma Scale total",
      context: "Thirty minutes after the seizure stops, Robert opens eyes to speech, is confused in conversation and obeys commands.",
      data: [
        "Eye opening to speech = 3",
        "Confused verbal response = 4",
        "Obeys commands = 6"
      ],
      prompt: "Calculate Robert’s Glasgow Coma Scale total.",
      expected: 13,
      unit: "points",
      units: ["points", "score", "bpm"],
      formula: "GCS total = eye + verbal + motor",
      hint: "Add the three component scores.",
      explanation: "E3 + V4 + M6 = 13 points.",
      scoreTitle: "Glasgow Coma Scale components",
      scoreList: [
        "Eye opening to speech = 3 points",
        "Confused verbal response = 4 points",
        "Obeys commands = 6 points"
      ]
    },
    {
      id: "oxygenIncrease",
      topic: "Post-ictal monitoring",
      title: "Calculate oxygen saturation increase",
      context: "Robert’s oxygen saturation improves during post-ictal monitoring.",
      data: ["Initial oxygen saturation: 90%", "Follow-up oxygen saturation: 96%"],
      prompt: "Calculate the increase in oxygen saturation.",
      expected: 6,
      unit: "percentage points",
      units: ["percentage points", "%", "mmol/L"],
      formula: "Increase = follow-up value − initial value",
      hint: "Subtract 90 from 96.",
      explanation: "96 − 90 = 6 percentage points.",
      unitNote: "When two percentages are subtracted, the difference is in percentage points. A rise from 90% to 96% is a 6.7% increase relative to 90, which is a different calculation."
    },
    {
      id: "glucoseIncrease",
      topic: "Post-ictal monitoring",
      title: "Calculate blood glucose increase",
      context: "Robert’s blood glucose is reassessed after treatment.",
      data: ["Initial glucose: 3.2 mmol/L", "Follow-up glucose: 5.6 mmol/L"],
      prompt: "Calculate the increase in capillary blood glucose.",
      expected: 2.4,
      unit: "mmol/L",
      units: ["mmol/L", "mg/dL", "%"],
      formula: "Increase = follow-up glucose − initial glucose",
      hint: "Subtract 3.2 from 5.6.",
      explanation: "5.6 mmol/L − 3.2 mmol/L = 2.4 mmol/L."
    }
  ]
});
