export type TaxBracket = {
  min: number;
  max: number;
  rate: number;
};

export const OLD_PIT_BRACKETS: TaxBracket[] = [
  { min: 0, max: 300_000, rate: 0.07 },
  { min: 300_000, max: 600_000, rate: 0.11 },
  { min: 600_000, max: 1_100_000, rate: 0.15 },
  { min: 1_100_000, max: 1_600_000, rate: 0.19 },
  { min: 1_600_000, max: 3_200_000, rate: 0.21 },
  { min: 3_200_000, max: Number.POSITIVE_INFINITY, rate: 0.24 }
];

export const NEW_PIT_BRACKETS: TaxBracket[] = [
  { min: 0, max: 800_000, rate: 0 },
  { min: 800_000, max: 3_000_000, rate: 0.15 },
  { min: 3_000_000, max: 12_000_000, rate: 0.18 },
  { min: 12_000_000, max: 25_000_000, rate: 0.21 },
  { min: 25_000_000, max: 50_000_000, rate: 0.23 },
  { min: 50_000_000, max: Number.POSITIVE_INFINITY, rate: 0.25 }
];

export type ProgressiveTaxResult = {
  total: number;
  breakdown: Array<{
    range: string;
    rate: string;
    taxableAmount: number;
    tax: number;
  }>;
};

export const formatCurrency = (value: number) =>
  `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export const buildRangeLabel = (bracket: TaxBracket) => {
  const upperLabel = Number.isFinite(bracket.max)
    ? formatCurrency(bracket.max)
    : "Above";
  return `${formatCurrency(bracket.min)} - ${upperLabel}`;
};

export const calculateProgressiveTax = (
  income: number,
  brackets: TaxBracket[]
): ProgressiveTaxResult => {
  let totalTax = 0;
  const breakdown: ProgressiveTaxResult["breakdown"] = [];

  for (const bracket of brackets) {
    if (income <= bracket.min) continue;

    const taxableTop = Math.min(income, bracket.max);
    const taxableAmount = taxableTop - bracket.min;

    if (taxableAmount <= 0) continue;

    const taxAtThisBand = taxableAmount * bracket.rate;
    totalTax += taxAtThisBand;

    breakdown.push({
      range: buildRangeLabel(bracket),
      rate: `${(bracket.rate * 100).toFixed(0)}%`,
      taxableAmount,
      tax: taxAtThisBand
    });

    if (income <= bracket.max) break;
  }

  return { total: totalTax, breakdown };
};
