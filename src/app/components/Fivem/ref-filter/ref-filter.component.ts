import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CurrencyCode } from '../../../interfaces/fivem-resource';
import { FivemFilterService } from '../../../services/fivem-filter.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

type FilterFormGroup = {
  currency: FormControl<CurrencyCode>;
  minPrice: FormControl<number | null>;
  maxPrice: FormControl<number | null>;
  searchTerm: FormControl<string>;
};

@Component({
  selector: 'app-ref-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './ref-filter.component.html',
  styleUrl: './ref-filter.component.scss'
})
export class RefFilterComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly filterService = inject(FivemFilterService);
  private readonly subscriptions = new Subscription();

  readonly filterState = this.filterService.filterState;
  readonly exchangeRates = this.filterService.exchangeRates;
  readonly currencyOptions = this.filterService.currencyOptions;
  readonly filteredResources = this.filterService.filteredResources;
  readonly totalMatches = computed(() => this.filteredResources().length);
  readonly filteredCounts = computed(() => {
    const summary = new Map<string, number>();
    for (const resource of this.filteredResources()) {
      summary.set(resource.framework, (summary.get(resource.framework) ?? 0) + 1);
    }
    return Array.from(summary.entries());
  });

  readonly filterForm = this.fb.group<FilterFormGroup>({
    currency: this.fb.control<CurrencyCode>(this.filterState().currency, {
      nonNullable: true
    }),
    minPrice: this.fb.control<number | null>(this.filterState().minPrice),
    maxPrice: this.fb.control<number | null>(this.filterState().maxPrice),
    searchTerm: this.fb.control<string>(this.filterState().searchTerm, { nonNullable: true })
  });

  private readonly syncEffect = effect(() => {
    const state = this.filterService.filterState();
    this.filterForm.patchValue(
      {
        currency: state.currency,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        searchTerm: state.searchTerm
      },
      { emitEvent: false }
    );
  });

  ngOnInit(): void {
    const subscription = this.filterForm.valueChanges.subscribe((value) => {
      this.filterService.updateFilter({
        currency: (value.currency as CurrencyCode) ?? this.filterState().currency,
        minPrice: this.toNullableNumber(value.minPrice),
        maxPrice: this.toNullableNumber(value.maxPrice),
        searchTerm: value.searchTerm?.trim() ?? ''
      });
    });

    this.subscriptions.add(subscription);
  }

  setCurrency(currency: CurrencyCode): void {
    this.filterForm.patchValue({ currency });
  }

  onExchangeRateChange(currency: CurrencyCode, rawValue: string): void {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    this.filterService.updateExchangeRate(currency, parsed);
  }

  clearPriceRange(): void {
    this.filterForm.patchValue({
      minPrice: null,
      maxPrice: null
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.syncEffect.destroy();
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
