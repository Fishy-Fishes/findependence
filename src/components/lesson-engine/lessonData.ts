export interface LessonStep {
  id: string;
  title: string;
  prompt: string;
  choices: {
    label: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export const financialInclusionLesson: LessonStep[] = [
  {
    id: "step-1",
    title: "Understanding Cash Flow",
    prompt:
      "You earned 120 AUD today as a gig worker. Your weekly bike rental is 45 AUD. How much cash should you set aside for an emergency buffer?",
    choices: [
      {
        label: "0 AUD (keep it all)",
        isCorrect: false,
        explanation:
          "Without any buffer you are vulnerable to unexpected expenses.",
      },
      {
        label: "30 AUD (25 % of earnings)",
        isCorrect: true,
        explanation:
          "A 25 % buffer is a common recommendation for irregular income.",
      },
      {
        label: "60 AUD (50 % of earnings)",
        isCorrect: false,
        explanation: "Too much may restrict ability to cover regular costs.",
      },
    ],
  },
  {
    id: "step-2",
    title: "Spotting Predatory Loans",
    prompt: "Which of the following loan offers looks most risky?",
    choices: [
      { label: "5 % monthly interest, no hidden fees", isCorrect: false },
      { label: "12 % APR, transparent schedule", isCorrect: false },
      {
        label: "400 % APR with small upfront fee",
        isCorrect: true,
        explanation: "A 400 % APR is extreme and likely a predatory product.",
      },
    ],
  },
  {
    id: "step-3",
    title: "Community Savings Circles",
    prompt:
      "In a ROSCA of 5 members contributing 20 AUD each week, how much does each member receive when it is their turn?",
    choices: [
      { label: "20 AUD", isCorrect: false },
      {
        label: "100 AUD",
        isCorrect: true,
        explanation: "5 x 20 AUD = 100 AUD per rotation.",
      },
      { label: "200 AUD", isCorrect: false },
    ],
  },
];
