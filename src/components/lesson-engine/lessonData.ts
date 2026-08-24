export type StepType = 'multiple-choice' | 'budget-allocation' | 'category-sort' | 'true-false';

export interface Choice {
  id: string;
  label: string;
  sublabel?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CategorySortItem {
  id: string;
  text: string;
  correctCategory: 'asset' | 'liability';
}

export interface BaseLessonStep {
  id: string;
  type: StepType;
  title: string;
  unit: string;
  scenario: string;
  mentorTip?: string;
  mascotMood?: 'happy' | 'thinking' | 'surprised' | 'celebrating';
  xpReward: number;
}

export interface MultipleChoiceStep extends BaseLessonStep {
  type: 'multiple-choice' | 'true-false';
  prompt: string;
  choices: Choice[];
}

export interface BudgetAllocationStep extends BaseLessonStep {
  type: 'budget-allocation';
  prompt: string;
  totalIncome: number;
  currency: string;
  categories: {
    id: string;
    label: string;
    recommendedMin: number;
    recommendedMax: number;
    description: string;
    color: string;
  }[];
  explanation: string;
}

export interface CategorySortStep extends BaseLessonStep {
  type: 'category-sort';
  prompt: string;
  items: CategorySortItem[];
  categories: {
    id: 'asset' | 'liability';
    label: string;
    color: string;
  }[];
  explanation: string;
}

export type LessonStep = MultipleChoiceStep | BudgetAllocationStep | CategorySortStep;

export const financialIndependenceCourse: LessonStep[] = [
  {
    id: 'step-1',
    type: 'multiple-choice',
    unit: 'Unit 1: Foundations of Cash Flow',
    title: 'Emergency Buffer Building',
    scenario: 'You just earned $150 AUD today doing flexible gig shifts. Your monthly phone bill and transport rent are approaching next week.',
    prompt: 'How much should you immediately funnel into your High-Yield Emergency Stash before any discretionary spending?',
    mentorTip: 'Rule of thumb: Always pay your future self first with at least 20-30% of variable earnings!',
    mascotMood: 'thinking',
    xpReward: 15,
    choices: [
      {
        id: 'c1',
        label: '$0 (Spend it now, save whatever is left)',
        sublabel: 'Leftover budgeting',
        isCorrect: false,
        explanation: 'Saving only what is left usually leads to $0 saved. Paying yourself first builds resilience.',
      },
      {
        id: 'c2',
        label: '$45 AUD (30% of daily income)',
        sublabel: 'Pay-Your-First strategy',
        isCorrect: true,
        explanation: 'Spot on! Diverting 20-30% immediately protects you against sudden income dips without squeezing living essentials.',
      },
      {
        id: 'c3',
        label: '$130 AUD (87% of daily income)',
        sublabel: 'Over-restriction',
        isCorrect: false,
        explanation: 'Over-restricting cash flow might leave you unable to cover immediate transport or food costs.',
      },
    ],
  },
  {
    id: 'step-2',
    type: 'budget-allocation',
    unit: 'Unit 1: The 50 / 30 / 20 Rule',
    title: 'Smart Income Allocation',
    scenario: 'You received a weekly paycheck of $600 AUD. Balance your budget sliders according to the proven 50/30/20 Financial Independence principle.',
    prompt: 'Distribute the $600 AUD between Needs, Wants, and Wealth/Emergency Savings.',
    mentorTip: 'Needs: ~50% ($300), Wants: ~30% ($180), Future You / Savings: ~20% ($120).',
    mascotMood: 'happy',
    xpReward: 25,
    totalIncome: 600,
    currency: 'AUD',
    categories: [
      {
        id: 'needs',
        label: 'Needs (Rent & Food)',
        recommendedMin: 45,
        recommendedMax: 55,
        description: 'Essential housing, groceries and bills.',
        color: '#008CA4',
      },
      {
        id: 'wants',
        label: 'Wants (Fun & Hobbies)',
        recommendedMin: 25,
        recommendedMax: 35,
        description: 'Dining out, coffee, subscriptions.',
        color: '#F59E0B',
      },
      {
        id: 'savings',
        label: 'Savings & Investing',
        recommendedMin: 18,
        recommendedMax: 30,
        description: 'Emergency buffer & ETF index funds.',
        color: '#10B981',
      },
    ],
    explanation: 'The 50/30/20 framework creates sustainable habits without forcing extreme burnout.',
  },
  {
    id: 'step-3',
    type: 'multiple-choice',
    unit: 'Unit 2: Debt Shields & Traps',
    title: 'Spotting Predatory Lending',
    scenario: 'You need $500 for a sudden laptop repair. You browse three lending offers online.',
    prompt: 'Which of the following deals is a predatory debt trap that will compound into financial trouble?',
    mentorTip: 'Watch out for "low upfront fee" marketing that disguises sky-high annual percentage rates (APR)!',
    mascotMood: 'surprised',
    xpReward: 15,
    choices: [
      {
        id: 'p1',
        label: 'A zero-interest emergency hardship grant from a community union',
        sublabel: 'Community supported',
        isCorrect: false,
        explanation: 'Community credit grants are safe and non-predatory.',
      },
      {
        id: 'p2',
        label: 'Payday Loan: "$15 fee per $100 borrowed, due in 14 days" (~391% APR)',
        sublabel: 'Payday trap',
        isCorrect: true,
        explanation: 'Correct! $15 per $100 for two weeks translates to an astronomical ~391% APR, trapping borrowers in endless rolling debt.',
      },
      {
        id: 'p3',
        label: 'A low-rate personal line of credit at 8.5% p.a. with transparent schedule',
        sublabel: 'Standard bank rate',
        isCorrect: false,
        explanation: '8.5% p.a. is a standard reasonable credit line.',
      },
    ],
  },
  {
    id: 'step-4',
    type: 'category-sort',
    unit: 'Unit 3: Balance Sheet Master',
    title: 'Assets vs Liabilities Sorting',
    scenario: 'Sort these financial items into Assets (put money in your pocket) or Liabilities (take money out of your pocket).',
    prompt: 'Tap each item to assign it to the correct column.',
    mentorTip: 'An asset generates income or appreciates in value. A liability generates ongoing holding expenses.',
    mascotMood: 'thinking',
    xpReward: 20,
    items: [
      { id: 'i1', text: 'Broad-Market Low-Cost ETF', correctCategory: 'asset' },
      { id: 'i2', text: 'High-Interest Credit Card Balance', correctCategory: 'liability' },
      { id: 'i3', text: 'High-Yield Cash Savings Account (4.8% APY)', correctCategory: 'asset' },
      { id: 'i4', text: 'Depreciating Sports Car with Big Monthly Loan', correctCategory: 'liability' },
    ],
    categories: [
      { id: 'asset', label: 'Assets (Generates Wealth)', color: '#10B981' },
      { id: 'liability', label: 'Liabilities (Drains Cash)', color: '#EF4444' },
    ],
    explanation: 'Financial independence is achieved when the passive cash flow from your Assets exceeds your living expenses!',
  },
  {
    id: 'step-5',
    type: 'true-false',
    unit: 'Unit 4: Community Wealth & ROSCA',
    title: 'Rotating Savings Circles',
    scenario: 'A ROSCA (Rotating Savings and Credit Association) has 10 members contributing $50 AUD each fortnight.',
    prompt: 'True or False: In this circle, every fortnight one member receives a lump sum payout of $500 AUD without paying interest fees.',
    mentorTip: 'ROSCAs (also called Tandas, Susu, Hui, Chit Funds) have empowered community mutual-aid for generations across the globe!',
    mascotMood: 'celebrating',
    xpReward: 15,
    choices: [
      {
        id: 'tf1',
        label: 'True',
        sublabel: '10 members x $50 = $500 lump sum rotation',
        isCorrect: true,
        explanation: 'Correct! ROSCAs offer 0% interest peer-to-peer savings discipline and early access to lump sum capital.',
      },
      {
        id: 'tf2',
        label: 'False',
        sublabel: 'There are bank fees deducted',
        isCorrect: false,
        explanation: 'In traditional community ROSCAs, 100% of contributions rotate directly among trusted members without intermediary fees.',
      },
    ],
  },
];

// Backwards compatibility alias
export const financialInclusionLesson = financialIndependenceCourse;

