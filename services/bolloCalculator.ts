import { BASE_TARIFFS, REGIONAL_MODIFIERS, EXEMPTION_YEARS, DIRECT_DEBIT_DISCOUNTS } from '../constants';
import { BolloResult, EuroClass, FuelType, Region } from '../types';

export const calculateBolloSequence = (
  kw: number,
  region: Region,
  fuel: FuelType,
  euroClass: EuroClass,
  registrationYear: number,
  yearsToCalculate: number,
  useDirectDebit: boolean = false
): BolloResult[] => {
  const results: BolloResult[] = [];
  const currentYear = new Date().getFullYear();

  // Determine Modifier
  const modifier = REGIONAL_MODIFIERS[region] || 1.0;
  
  // Determine Base Rates
  const rates = BASE_TARIFFS[euroClass] || BASE_TARIFFS[EuroClass.EURO_6];

  for (let i = 0; i < yearsToCalculate; i++) {
    const calcYear = currentYear + i;
    // Calculate how many years old the car is relative to registration
    const yearsSinceRegistration = calcYear - registrationYear;

    let isExempt = false;
    let message = "";
    let amount = 0;

    // Logic for Exemptions
    if (fuel === FuelType.ELETTRICA) {
      if (yearsSinceRegistration < EXEMPTION_YEARS.ELECTRIC) {
        isExempt = true;
        message = `Esenzione Elettrica (${yearsSinceRegistration + 1}/${EXEMPTION_YEARS.ELECTRIC} anni)`;
      } else {
        // Electric usually pays 25% of the rate after exemption
        const fullAmount = calculateStandardAmount(kw, rates, modifier);
        amount = fullAmount * 0.25; 
        message = "Tariffa ridotta (25%) post-esenzione";
      }
    } else if (fuel === FuelType.IBRIDA) {
      // Determine specific hybrid exemption duration for this region
      const hybridDuration = EXEMPTION_YEARS.HYBRID[region] ?? EXEMPTION_YEARS.HYBRID_DEFAULT;

      if (yearsSinceRegistration < hybridDuration) {
        isExempt = true;
        message = `Esenzione Ibrida (${yearsSinceRegistration + 1}/${hybridDuration} anni)`;
      } else {
        amount = calculateStandardAmount(kw, rates, modifier);
        message = "Tariffa standard";
      }
    } else {
      // Standard Internal Combustion Engine
      amount = calculateStandardAmount(kw, rates, modifier);
      message = "Tariffa standard";
    }

    // GPL/Metano reduction logic
    if (!isExempt && (fuel === FuelType.GPL || fuel === FuelType.METANO)) {
      amount = amount * 0.75;
      message = "Tariffa ridotta ecologica";
    }

    // Apply Direct Debit Discount if enabled and applicable
    if (!isExempt && useDirectDebit && amount > 0) {
      const discountRate = DIRECT_DEBIT_DISCOUNTS[region] || 0;
      if (discountRate > 0) {
        amount = amount * (1 - discountRate);
        const discountPercent = (discountRate * 100).toFixed(0);
        
        // Append to message if not already present (simple check)
        if (!message.includes("domiciliazione")) {
           message += ` + Sconto domiciliazione (-${discountPercent}%)`;
        }
      }
    }

    if (isExempt) amount = 0;

    results.push({
      year: calcYear,
      yearLabel: `Anno ${i + 1} (${calcYear})`,
      amount: parseFloat(amount.toFixed(2)),
      isExempt,
      message
    });
  }

  return results;
};

const calculateStandardAmount = (
  kw: number, 
  rates: { under100: number; over100: number }, 
  modifier: number
): number => {
  let total = 0;
  
  if (kw <= 100) {
    total = kw * rates.under100;
  } else {
    const first100 = 100 * rates.under100;
    const excess = (kw - 100) * rates.over100;
    total = first100 + excess;
  }

  return total * modifier;
};