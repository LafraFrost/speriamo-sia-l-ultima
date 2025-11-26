export enum Region {
  ABRUZZO = "Abruzzo",
  BASILICATA = "Basilicata",
  CALABRIA = "Calabria",
  CAMPANIA = "Campania",
  EMILIA_ROMAGNA = "Emilia Romagna",
  FRIULI_VENEZIA_GIULIA = "Friuli Venezia Giulia",
  LAZIO = "Lazio",
  LIGURIA = "Liguria",
  LOMBARDIA = "Lombardia",
  MARCHE = "Marche",
  MOLISE = "Molise",
  PIEMONTE = "Piemonte",
  PUGLIA = "Puglia",
  SARDEGNA = "Sardegna",
  SICILIA = "Sicilia",
  TOSCANA = "Toscana",
  TRENTINO_ALTO_ADIGE = "Trentino Alto Adige",
  UMBRIA = "Umbria",
  VALLE_D_AOSTA = "Valle d'Aosta",
  VENETO = "Veneto"
}

export enum FuelType {
  BENZINA = "Benzina",
  DIESEL = "Diesel",
  GPL = "GPL",
  METANO = "Metano",
  IBRIDA = "Ibrida",
  ELETTRICA = "Elettrica"
}

export enum EuroClass {
  EURO_0 = "Euro 0",
  EURO_1 = "Euro 1",
  EURO_2 = "Euro 2",
  EURO_3 = "Euro 3",
  EURO_4 = "Euro 4",
  EURO_5 = "Euro 5",
  EURO_6 = "Euro 6"
}

export interface TariffRate {
  under100: number; // Cost per kW up to 100kW
  over100: number;  // Cost per kW over 100kW
}

export interface BolloResult {
  year: number;
  yearLabel: string;
  amount: number;
  isExempt: boolean;
  message: string;
}

export interface FuelResult {
  year: number;
  km: number;
  liters: number;
  cost: number;
}

export interface SavedCar {
  id: string;
  name: string;
  kw: number;
  region: Region;
  fuel: FuelType;
  euroClass: EuroClass;
  regYear: number;
  consumption?: number; // L/100km
  kmAnnual?: number;
  directDebit?: boolean; // Added to persist discount preference
  createdAt: number;
}