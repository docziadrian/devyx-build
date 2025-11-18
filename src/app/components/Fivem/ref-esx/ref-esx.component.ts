import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RefFilterComponent } from '../ref-filter/ref-filter.component';
import { FivemDisplayResource, FivemFilterService } from '../../../services/fivem-filter.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-ref-esx',
  standalone: true,
  imports: [CommonModule, RefFilterComponent, TranslatePipe],
  templateUrl: './ref-esx.component.html',
  styleUrl: './ref-esx.component.scss'
})
export class RefEsxComponent implements OnInit {
  private readonly filterService = inject(FivemFilterService);

  readonly resources = computed<FivemDisplayResource[]>(() => this.filterService.getResourcesByFramework('ESX'));

  ngOnInit(): void {
    this.filterService.setFrameworks(['ESX']);
  }

  formatPrice(resource: FivemDisplayResource): string {
    const currency = this.filterService.filterState().currency;
    if (currency === 'HUF') {
      return `${resource.displayPrice.toLocaleString('hu-HU')} Ft`;
    }
    const symbol = { EUR: '€', USD: '$', GBP: '£', HUF: 'Ft' }[currency];
    return `${symbol}${resource.displayPrice.toFixed(2)}`;
  }
}
