import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RefFilterComponent } from '../ref-filter/ref-filter.component';
import { FivemDisplayResource, FivemFilterService } from '../../../services/fivem-filter.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-ref-qbcore',
  standalone: true,
  imports: [CommonModule, RefFilterComponent, TranslatePipe],
  templateUrl: './ref-qbcore.component.html',
  styleUrl: './ref-qbcore.component.scss'
})
export class RefQbcoreComponent implements OnInit {
  private readonly filterService = inject(FivemFilterService);

  readonly resources = computed<FivemDisplayResource[]>(() => this.filterService.getResourcesByFramework('QBCore'));

  ngOnInit(): void {
    this.filterService.setFrameworks(['QBCore']);
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
