import { EuroClass, Region } from './types';

// Simplified tariff structure based on Italian average 2024 rates
// In a real production app, this would be a complete matrix of all 20 regions x 7 euro classes
export const BASE_TARIFFS: Record<EuroClass, { under100: number; over100: number }> = {
  [EuroClass.EURO_0]: { under100: 3.00, over100: 4.50 },
  [EuroClass.EURO_1]: { under100: 2.90, over100: 4.35 },
  [EuroClass.EURO_2]: { under100: 2.80, over100: 4.20 },
  [EuroClass.EURO_3]: { under100: 2.70, over100: 4.05 },
  [EuroClass.EURO_4]: { under100: 2.58, over100: 3.87 },
  [EuroClass.EURO_5]: { under100: 2.58, over100: 3.87 },
  [EuroClass.EURO_6]: { under100: 2.58, over100: 3.87 },
};

// Regional coefficients (multipliers to base national rate)
export const REGIONAL_MODIFIERS: Record<Region, number> = {
  [Region.ABRUZZO]: 1.10,
  [Region.BASILICATA]: 1.00,
  [Region.CALABRIA]: 1.10,
  [Region.CAMPANIA]: 1.15, // Expensive
  [Region.EMILIA_ROMAGNA]: 1.00,
  [Region.FRIULI_VENEZIA_GIULIA]: 0.90,
  [Region.LAZIO]: 1.10,
  [Region.LIGURIA]: 1.10,
  [Region.LOMBARDIA]: 1.00, // Fixed to standard rate
  [Region.MARCHE]: 1.10,
  [Region.MOLISE]: 1.10,
  [Region.PIEMONTE]: 1.10,
  [Region.PUGLIA]: 1.10,
  [Region.SARDEGNA]: 1.00,
  [Region.SICILIA]: 1.00,
  [Region.TOSCANA]: 1.10,
  [Region.TRENTINO_ALTO_ADIGE]: 0.90,
  [Region.UMBRIA]: 1.10,
  [Region.VALLE_D_AOSTA]: 1.00,
  [Region.VENETO]: 1.10
};

// Discounts for paying via bank direct debit (Domiciliazione Bancaria)
export const DIRECT_DEBIT_DISCOUNTS: Partial<Record<Region, number>> = {
  [Region.LOMBARDIA]: 0.15,
  [Region.EMILIA_ROMAGNA]: 0.10,
  [Region.VENETO]: 0.10,
  [Region.ABRUZZO]: 0.10,
  [Region.MOLISE]: 0.10,
  [Region.SARDEGNA]: 0.10,
  [Region.TRENTINO_ALTO_ADIGE]: 0.10
};

// Exemption years by fuel type
export const EXEMPTION_YEARS = {
  // Hybrid exemption varies significantly by region
  HYBRID: {
    [Region.LOMBARDIA]: 5,
    [Region.VENETO]: 3,
    [Region.PIEMONTE]: 5,
    [Region.LAZIO]: 0,
    [Region.EMILIA_ROMAGNA]: 0,
    [Region.TOSCANA]: 0,
  } as Partial<Record<Region, number>>,
  // Default fallback for hybrid if region not specified above
  HYBRID_DEFAULT: 0, 
  // Electric is generally 5 years nationwide
  ELECTRIC: 5,
};