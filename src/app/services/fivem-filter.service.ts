import { Injectable, computed, signal } from '@angular/core';
import {
  CurrencyCode,
  FivemFilterState,
  FivemFramework,
  FivemResource
} from '../interfaces/fivem-resource';

export type FivemDisplayResource = FivemResource & {
  displayPrice: number;
};

@Injectable({
  providedIn: 'root'
})
export class FivemFilterService {
  readonly frameworkOptions: FivemFramework[] = ['ESX', 'ESX Legacy', 'QBCore'];

  private readonly currencySymbols: Record<CurrencyCode, string> = {
    EUR: '€',
    USD: '$',
    HUF: 'Ft',
    GBP: '£'
  };

  private readonly resourcesSignal = signal<FivemResource[]>([
    {
      id: 'heist-manager',
      title: 'Heist Manager Pro',
      description:
        'Összetett rablás menedzsment rendszer több fázissal és dinamikus eseményekkel.',
      descriptionKey: 'fivem.resources.heistManager.description',
      framework: 'ESX',
      category: 'Gazdaság',
      basePrice: 120
    },
    {
      id: 'vehicle-keychain',
      title: 'Vehicle Keychain 2.0',
      description:
        'Fejlett jármű kulcskezelés mobil app integrációval és biztonsági szintekkel.',
      descriptionKey: 'fivem.resources.vehicleKeychain.description',
      framework: 'ESX Legacy',
      category: 'Jármű',
      basePrice: 95
    },
    {
      id: 'qbcore-billing',
      title: 'QBCore Billing Suite',
      description:
        'Moduláris számlázó rendszer több vállalkozás támogatással, kimutatással.',
      descriptionKey: 'fivem.resources.qbcoreBilling.description',
      framework: 'QBCore',
      category: 'Gazdaság',
      basePrice: 80
    },
    {
      id: 'dispatch-ai',
      title: 'Smart Dispatch AI',
      description:
        'Mesterséges intelligenciával támogatott mentésirányítás real-time statisztikákkal.',
      descriptionKey: 'fivem.resources.dispatchAi.description',
      framework: 'ESX',
      category: 'Rendvédelem',
      basePrice: 135
    },
    {
      id: 'legacy-inventory',
      title: 'Legacy Inventory Revamp',
      description:
        'Modern inventory UI ESX Legacy szerverekhez drag & drop támogatással.',
      descriptionKey: 'fivem.resources.legacyInventory.description',
      framework: 'ESX Legacy',
      category: 'UI/UX',
      basePrice: 60
    },
    {
      id: 'qbcore-hud',
      title: 'QBCore Adaptive HUD',
      description:
        'Reszponzív játékos HUD számos moduláris panellel és API integrációval.',
      descriptionKey: 'fivem.resources.qbcoreHud.description',
      framework: 'QBCore',
      category: 'UI/UX',
      basePrice: 72
    },
    {
      id: 'fivem-marketplace',
      title: 'FiveM Marketplace Tools',
      description:
        'Kereskedői és aukciós rendszer dinamikus árazással és készletfigyeléssel.',
      descriptionKey: 'fivem.resources.fivemMarketplace.description',
      framework: 'ESX',
      category: 'Gazdaság',
      basePrice: 110
    },
    {
      id: 'legacy-gangwars',
      title: 'Legacy Gang Wars',
      description:
        'Frakció alapú területfoglaló rendszer részletes statisztikákkal és rangokkal.',
      descriptionKey: 'fivem.resources.legacyGangwars.description',
      framework: 'ESX Legacy',
      category: 'Játékmenet',
      basePrice: 88
    },
    {
      id: 'qbcore-careers',
      title: 'QBCore Career Paths',
      description:
        'Dinamikus karrier rendszer előrehaladási fa támogatással és jutalmakkal.',
      descriptionKey: 'fivem.resources.qbcoreCareers.description',
      framework: 'QBCore',
      category: 'Játékmenet',
      basePrice: 105
    }
  ]);

  private readonly exchangeRatesSignal = signal<Record<CurrencyCode, number>>({
    EUR: 1,
    USD: 1.08,
    HUF: 395,
    GBP: 0.85
  });

  private readonly filterStateSignal = signal<FivemFilterState>({
    currency: 'EUR',
    minPrice: null,
    maxPrice: null,
    searchTerm: '',
    frameworks: [...this.frameworkOptions]
  });

  readonly currencyOptions: CurrencyCode[] = ['EUR', 'USD', 'HUF', 'GBP'];

  readonly resources = computed(() => this.resourcesSignal());

  readonly exchangeRates = computed(() => this.exchangeRatesSignal());

  readonly filterState = computed(() => this.filterStateSignal());

  readonly selectedFrameworks = computed(() => this.filterStateSignal().frameworks);

  readonly filteredResources = computed<FivemDisplayResource[]>(() => {
    const { currency, minPrice, maxPrice, searchTerm, frameworks } = this.filterStateSignal();
    const search = searchTerm.trim().toLowerCase();
    const rates = this.exchangeRatesSignal();
    const activeFrameworks =
      frameworks.length > 0 ? frameworks : [...this.frameworkOptions];

    return this.resourcesSignal()
      .filter((resource) => {
        if (!activeFrameworks.includes(resource.framework)) {
          return false;
        }
        const price = this.calculatePrice(resource, currency, rates);
        if (minPrice !== null && price < minPrice) {
          return false;
        }
        if (maxPrice !== null && price > maxPrice) {
          return false;
        }
        if (!search) {
          return true;
        }
        return (
          resource.title.toLowerCase().includes(search) ||
          resource.description.toLowerCase().includes(search) ||
          resource.category.toLowerCase().includes(search)
        );
      })
      .map((resource) => this.enrichWithDisplayPrice(resource, currency, rates));
  });

  getResourcesByFramework(framework: FivemFramework): FivemDisplayResource[] {
    const state = this.filterStateSignal();
    const rates = this.exchangeRatesSignal();
    const filtered = this.filteredResources();

    const matchesFiltered = filtered.filter((item) => item.framework === framework);

    if (state.minPrice !== null || state.maxPrice !== null || state.searchTerm.trim()) {
      return matchesFiltered;
    }

    // If no additional filter besides currency is active, show every resource of the framework
    return this.resourcesSignal()
      .filter((resource) => resource.framework === framework)
      .map((resource) => this.enrichWithDisplayPrice(resource, state.currency, rates));
  }

  updateFilter(partial: Partial<FivemFilterState>): void {
    this.filterStateSignal.update((previous) => {
      const next = { ...previous, ...partial };
      if (next.minPrice !== null && next.maxPrice !== null && next.minPrice > next.maxPrice) {
        const temp = next.minPrice;
        next.minPrice = next.maxPrice;
        next.maxPrice = temp;
      }
      if (partial.frameworks !== undefined) {
        next.frameworks = this.normaliseFrameworks(partial.frameworks);
      }
      return next;
    });
  }

  updateExchangeRate(currency: CurrencyCode, rate: number): void {
    if (rate <= 0) {
      return;
    }
    this.exchangeRatesSignal.update((current) => ({
      ...current,
      [currency]: rate
    }));
  }

  getDisplayPrice(resource: FivemResource): string {
    const state = this.filterStateSignal();
    const rates = this.exchangeRatesSignal();
    const price = this.calculatePrice(resource, state.currency, rates);
    const symbol = this.currencySymbols[state.currency];

    if (state.currency === 'HUF') {
      return `${Math.round(price).toLocaleString('hu-HU')} ${symbol}`;
    }

    return `${symbol}${price.toFixed(2)}`;
  }

  private calculatePrice(
    resource: FivemResource,
    currency: CurrencyCode,
    rates: Record<CurrencyCode, number>
  ): number {
    const rate = rates[currency] ?? 1;
    return resource.basePrice * rate;
  }

  private enrichWithDisplayPrice(
    resource: FivemResource,
    currency: CurrencyCode,
    rates: Record<CurrencyCode, number>
  ): FivemDisplayResource {
    const price = this.calculatePrice(resource, currency, rates);
    return {
      ...resource,
      displayPrice: currency === 'HUF' ? Math.round(price) : parseFloat(price.toFixed(2))
    };
  }

  setFrameworks(frameworks: FivemFramework[]): void {
    this.filterStateSignal.update((previous) => ({
      ...previous,
      frameworks: this.normaliseFrameworks(frameworks)
    }));
  }

  toggleFramework(framework: FivemFramework): void {
    this.filterStateSignal.update((previous) => {
      const hasValue = previous.frameworks.includes(framework);
      const updated = hasValue
        ? previous.frameworks.filter((item) => item !== framework)
        : [...previous.frameworks, framework];
      return {
        ...previous,
        frameworks: this.normaliseFrameworks(updated)
      };
    });
  }

  selectAllFrameworks(): void {
    this.filterStateSignal.update((previous) => ({
      ...previous,
      frameworks: [...this.frameworkOptions]
    }));
  }

  isFrameworkSelected(framework: FivemFramework): boolean {
    return this.filterStateSignal().frameworks.includes(framework);
  }

  private normaliseFrameworks(frameworks: FivemFramework[]): FivemFramework[] {
    const unique = new Set(frameworks);
    return this.frameworkOptions.filter((option) => unique.has(option));
  }
}

