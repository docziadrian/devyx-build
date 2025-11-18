export type FivemFramework = 'ESX' | 'ESX Legacy' | 'QBCore';

export type CurrencyCode = 'EUR' | 'USD' | 'HUF' | 'GBP';

export interface FivemResource {
  id: string;
  title: string;
  description: string;
  descriptionKey?: string;
  framework: FivemFramework;
  category: string;
  basePrice: number; // In EUR
  imageUrl?: string;
  features?: string[];
  documentationUrl?: string;
}

export interface FivemFilterState {
  currency: CurrencyCode;
  minPrice: number | null;
  maxPrice: number | null;
  searchTerm: string;
  frameworks: FivemFramework[];
}

