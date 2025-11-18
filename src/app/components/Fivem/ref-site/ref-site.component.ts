import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FivemFramework, FivemResource } from '../../../interfaces/fivem-resource';
import { RefFilterComponent } from '../ref-filter/ref-filter.component';
import { FivemDisplayResource, FivemFilterService } from '../../../services/fivem-filter.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-ref-site',
  standalone: true,
  imports: [CommonModule, RefFilterComponent, TranslatePipe],
  templateUrl: './ref-site.component.html',
  styleUrl: './ref-site.component.scss'
})
export class RefSiteComponent implements OnInit {
  private readonly filterService = inject(FivemFilterService);

  readonly filterOpen = signal(false);
  readonly currency = computed(() => this.filterService.filterState().currency);
  readonly frameworks = this.filterService.frameworkOptions;
  readonly filteredResources = this.filterService.filteredResources;
  readonly selectedFrameworks = this.filterService.selectedFrameworks;
  readonly exchangeRateEntries = computed(() => Object.entries(this.filterService.exchangeRates()));
  readonly totalResults = computed(() => this.filteredResources().length);

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 992px)').matches) {
      this.filterOpen.set(true);
    }
  }

  toggleFilter(): void {
    this.filterOpen.update((value) => !value);
  }

  toggleFramework(framework: FivemFramework): void {
    this.filterService.toggleFramework(framework);
  }

  showAllFrameworks(): void {
    this.filterService.selectAllFrameworks();
  }

  isFrameworkSelected(framework: FivemFramework): boolean {
    return this.filterService.isFrameworkSelected(framework);
  }

  trackByResourceId(_index: number, resource: FivemDisplayResource): string {
    return resource.id;
  }

  getPrice(resource: FivemResource): string {
    return this.filterService.getDisplayPrice(resource);
  }
}
