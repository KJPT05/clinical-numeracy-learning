// Patricia: acute manic episode
// See README.md ("Adding questions") for what each field does.
NUMERACY.addWorkbook({
  id: "patricia",
  title: "Patricia: acute manic episode",
  system: "Mental health and wellbeing",
  theme: "mental-health",
  summary: "Sleep, fluid balance, medicines, lithium-sample timing and physical-health monitoring.",
  questions: [
    {
      id: "sleepTotal",
      topic: "Sleep assessment",
      title: "Calculate total sleep",
      context: "Patricia reports reduced sleep during the three nights before admission.",
      data: ["Night 1: 2 hours", "Night 2: 3 hours", "Night 3: 1.5 hours"],
      prompt: "Calculate Patricia’s total sleep across the three nights.",
      expected: 6.5,
      unit: "hours",
      units: ["hours", "minutes", "days"],
      formula: "Total sleep = Night 1 + Night 2 + Night 3",
      hint: "Add 2, 3 and 1.5.",
      explanation: "2 + 3 + 1.5 = 6.5 hours."
    },
    {
      id: "sleepDeficit",
      topic: "Sleep assessment",
      title: "Calculate sleep deficit",
      context: "Use 8 hours per night as the reference amount for this activity.",
      data: [
        "Reference sleep: 8 hours each night",
        "Number of nights: 3",
        "Patricia’s total sleep: 6.5 hours"
      ],
      prompt: "Calculate Patricia’s total sleep deficit across the three nights.",
      expected: 17.5,
      unit: "hours",
      units: ["hours", "minutes", "days"],
      formula: "Sleep deficit = reference sleep − actual sleep",
      hint: "First calculate the reference sleep for three nights: 3 × 8.",
      explanation: "3 × 8 = 24 hours. 24 − 6.5 = 17.5 hours."
    },
    {
      id: "fluidBalanceMentalHealth",
      topic: "Fluid balance",
      title: "Calculate fluid balance",
      context: "During a 12-hour shift, Patricia’s fluid intake and output are recorded.",
      data: [
        "Water: 3 × 250 mL",
        "Tea: 2 × 200 mL",
        "Soup: 300 mL",
        "Urine output: 900 mL"
      ],
      prompt: "Calculate Patricia’s net fluid balance. The result is a positive balance; enter the numerical value and select the correct unit.",
      expected: 550,
      unit: "mL",
      units: ["mL", "L", "mL/hour"],
      formula: "Fluid balance = total intake − total output",
      hint: "Add all oral intake first, then subtract 900 mL.",
      explanation: "Intake: (3 × 250) + (2 × 200) + 300 = 1,450 mL. 1,450 − 900 = +550 mL."
    },
    {
      id: "olanzapineTablets",
      topic: "Oral medication",
      title: "Calculate tablets for one dose",
      context: "Olanzapine 10 mg at night is prescribed alongside lithium for acute mania. Olanzapine 5 mg tablets are available.",
      data: ["Prescribed dose: 10 mg", "Available strength: 5 mg per tablet"],
      prompt: "Calculate how many tablets are required for one prescribed dose.",
      expected: 2,
      unit: "tablets",
      units: ["tablets", "mg", "mL"],
      formula: "Tablets required = prescribed dose ÷ tablet strength",
      hint: "Divide 10 mg by 5 mg per tablet.",
      explanation: "10 mg ÷ 5 mg/tablet = 2 tablets. 10 mg daily is the usual starting dose when olanzapine is used in combination therapy for mania."
    },
    {
      id: "olanzapineSupply",
      topic: "Oral medication",
      title: "Calculate tablets for seven nights",
      context: "The same olanzapine dose is prescribed each night for seven nights.",
      data: ["Tablets per dose: 2", "Number of nights: 7"],
      prompt: "Calculate the total number of 5 mg tablets required for seven nights.",
      expected: 14,
      unit: "tablets",
      units: ["tablets", "mg", "days"],
      formula: "Total tablets = tablets per dose × number of doses",
      hint: "Multiply 2 tablets by 7 nights.",
      explanation: "2 tablets × 7 nights = 14 tablets."
    },
    {
      id: "lithiumSampleTime",
      topic: "Timing calculation",
      title: "Calculate lithium sample time",
      context: "Patricia takes lithium carbonate modified-release 400 mg once daily at night, at 21:30. A routine trough lithium blood sample is required 12 hours after the dose.",
      data: ["Lithium carbonate MR: 400 mg at night", "Lithium dose time: 21:30", "Required sample interval: 12 hours"],
      prompt: "Enter the lithium sample time the following day using 24-hour format.",
      answerType: "time",
      expected: "09:30",
      formula: "Sample time = dose time + 12 hours",
      hint: "Count forward to midnight, then continue for the remaining hours.",
      explanation: "21:30 + 12 hours = 09:30 the following day. Lithium samples are taken 12 hours after the dose because lithium has a narrow range between a therapeutic and a toxic level."
    },
    {
      id: "patriciaBmi",
      topic: "BMI",
      title: "Calculate Patricia’s BMI",
      context: "Patricia’s admission weight is 79.2 kg and height is 1.68 m.",
      data: ["Weight: 79.2 kg", "Height: 1.68 m"],
      prompt: "Calculate Patricia’s BMI. Give your answer to one decimal place.",
      expected: 79.2 / (1.68 * 1.68),
      dp: 1,
      unit: "kg/m²",
      units: ["kg/m²", "kg", "%"],
      formula: "BMI = weight (kg) ÷ height² (m²)",
      hint: "Square 1.68 first, then divide 79.2 by the answer.",
      explanation: "79.2 ÷ (1.68 × 1.68) = 28.061…, which rounds to 28.1 kg/m²."
    },
    {
      id: "patriciaWeightPercent",
      topic: "Percentage change",
      title: "Calculate percentage weight change",
      context: "Patricia’s admission weight is 79.2 kg and follow-up weight is 77.6 kg.",
      data: [
        "Admission weight: 79.2 kg",
        "Follow-up weight: 77.6 kg",
        "Weight change: 1.6 kg"
      ],
      prompt: "Calculate the percentage weight change from admission to follow-up. Give your answer to one decimal place.",
      expected: (1.6 / 79.2) * 100,
      dp: 1,
      unit: "%",
      units: ["%", "kg", "kg/m²"],
      formula: "Percentage change = (weight difference ÷ admission weight) × 100",
      hint: "Divide 1.6 by 79.2, then multiply by 100.",
      explanation: "(1.6 ÷ 79.2) × 100 = 2.020…%. Rounded to one decimal place, this is 2.0%. The app accepts 2.0% or 2.02%."
    }
  ]
});
