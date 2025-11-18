import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey?: string;
  private lastValue = '';
  private subscription: Subscription;

  constructor(
    private readonly translationService: TranslationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.translationService.initialise();
    this.subscription = this.translationService.languageChanges().subscribe(() => {
      this.lastKey = undefined;
      this.changeDetectorRef.markForCheck();
    });
  }

  transform(key: string | null | undefined): string {
    if (!key) {
      return '';
    }

    if (this.lastKey === key) {
      return this.lastValue;
    }

    this.lastKey = key;
    this.lastValue = this.translationService.translate(key);
    return this.lastValue;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } 
}

