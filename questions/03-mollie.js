// Mollie: fluid overload in CKD
// See README.md ("Adding questions") for what each field does.
NUMERACY.addWorkbook({
  id: "mollie",
  title: "Mollie: fluid overload in CKD",
  system: "Renal system",
  theme: "renal",
  summary: "Weight, fluid balance, fluid restriction, infusion rates and urine output.",
  questions: [
    {
      id: "weightAboveDry",
      topic: "Weight and fluid status",
      title: "Calculate weight above dry weight",
      context: "Mollie’s admission weight is 82.4 kg and documented dry weight is 78.6 kg.",
      data: ["Documented dry weight: 78.6 kg", "Admission weight: 82.4 kg"],
      prompt: "Calculate Mollie’s weight above documented dry weight. Give your answer to one decimal place.",
      expected: 3.8,
      dp: 1,
      unit: "kg",
      units: ["kg", "%", "mL"],
      formula: "Weight above dry weight = admission weight − dry weight",
      hint: "Subtract dry weight from admission weight.",
      explanation: "82.4 kg − 78.6 kg = 3.8 kg."
    },
    {
      id: "fluidBalance",
      topic: "Fluid balance",
      title: "Calculate 24-hour fluid balance",
      context: "Review Mollie’s recorded intake and output over the previous 24 hours.",
      data: [
        "Three cups of tea: 200 mL each",
        "Two glasses of water: 250 mL each",
        "One bowl of soup: 300 mL",
        "Urine output: 350 mL",
        "One episode of diarrhoea: 180 mL"
      ],
      prompt: "Calculate net fluid balance. The result is positive; enter the numerical value and select the unit.",
      expected: 870,
      unit: "mL",
      units: ["mL", "L", "mL/hour"],
      formula: "Fluid balance = total intake − total output",
      hint: "Calculate intake first, then subtract output.",
      explanation: "Intake = 1,400 mL. Output = 530 mL. Net balance = +870 mL."
    },
    {
      id: "fluidAllowance",
      topic: "Fluid restriction",
      title: "Calculate remaining fluid allowance",
      context: "Mollie has a 24-hour fluid allowance of 1,000 mL. By 14:00, 620 mL has been consumed.",
      data: ["24-hour allowance: 1,000 mL", "Already consumed: 620 mL"],
      prompt: "Calculate how much fluid remains in the 24-hour allowance.",
      expected: 380,
      unit: "mL",
      units: ["mL", "L", "mL/hour"],
      formula: "Remaining allowance = total allowance − consumed amount",
      hint: "Subtract consumed fluid from the allowance.",
      explanation: "1,000 mL − 620 mL = 380 mL remaining."
    },
    {
      id: "infusionRate",
      topic: "IV infusion rate",
      title: "Calculate IV infusion rate",
      context: "A prescribed IV infusion contains 250 mL and is to run over two hours.",
      data: ["Total volume: 250 mL", "Prescribed time: 2 hours"],
      prompt: "Calculate the pump rate in mL/hour.",
      expected: 125,
      unit: "mL/hour",
      units: ["mL/hour", "mL/min", "L/hour"],
      formula: "Rate = total volume ÷ time",
      hint: "Divide volume by time in hours.",
      explanation: "250 mL ÷ 2 hours = 125 mL/hour."
    },
    {
      id: "urinePerHour",
      topic: "Urine output",
      title: "Calculate average urine output",
      context: "Six hours after treatment begins, Mollie has passed 180 mL of urine.",
      data: ["Urine output: 180 mL", "Time period: 6 hours"],
      prompt: "Calculate average urine output per hour.",
      expected: 30,
      unit: "mL/hour",
      units: ["mL/hour", "mL/kg/hour", "mL"],
      formula: "Average output = total urine output ÷ time",
      hint: "Divide volume by hours.",
      explanation: "180 mL ÷ 6 hours = 30 mL/hour."
    },
    {
      id: "weightReduction",
      topic: "Weight response",
      title: "Calculate weight reduction",
      context: "Mollie’s admission weight is 82.4 kg and follow-up weight is 80.9 kg.",
      data: ["Admission weight: 82.4 kg", "Follow-up weight: 80.9 kg"],
      prompt: "Calculate weight reduction. Give your answer to one decimal place.",
      expected: 1.5,
      dp: 1,
      unit: "kg",
      units: ["kg", "%", "mL"],
      formula: "Weight reduction = admission weight − follow-up weight",
      hint: "Subtract follow-up weight.",
      explanation: "82.4 kg − 80.9 kg = 1.5 kg."
    },
    {
      id: "weightReductionPercent",
      topic: "Percentage change",
      title: "Calculate percentage weight reduction",
      context: "Use Mollie’s admission and follow-up weights.",
      data: [
        "Admission weight: 82.4 kg",
        "Follow-up weight: 80.9 kg",
        "Weight reduction: 1.5 kg"
      ],
      prompt: "Calculate percentage weight reduction from admission weight. Give your answer to one decimal place.",
      expected: (1.5 / 82.4) * 100,
      dp: 1,
      unit: "%",
      units: ["%", "kg", "kg/m²"],
      formula: "Percentage reduction = (weight reduction ÷ admission weight) × 100",
      hint: "Divide reduction by admission weight.",
      explanation: "(1.5 ÷ 82.4) × 100 = 1.820…%. Rounded to one decimal place this is 1.8%. The app accepts 1.8% or 1.82%."
    }
  ]
});
