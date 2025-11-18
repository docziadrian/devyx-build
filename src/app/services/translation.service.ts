import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import hu from '../languages/hu.json';
import en from '../languages/en.json';
import de from '../languages/de.json';

export interface LanguageOption {
  code: string;
  label: string;
}

type TranslationDictionary = Record<string, unknown>;

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly defaultLanguage = 'hu';
  private readonly dictionaries: Record<string, TranslationDictionary> = {
    hu,
    en,
    de
  };

  private readonly languageSubject = new BehaviorSubject<string>(this.defaultLanguage);
  private initialised = false;

  readonly languages: LanguageOption[] = [
    { code: 'hu', label: 'Magyar' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' }
  ];

  get currentLanguage(): string {
    return this.languageSubject.value;
  }

  languageChanges() {
    return this.languageSubject.asObservable();
  }

  setLanguage(code: string): void {
    if (code === this.languageSubject.value) {
      return;
    }

    const normalized = code.toLowerCase();
    if (!this.dictionaries[normalized]) {
      console.warn(`Missing translations for language "${normalized}".`);
      return;
    }

    this.languageSubject.next(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('novyxdev-lang', normalized);
    }
  }

  initialise(): void {
    if (this.initialised) {
      return;
    }

    this.initialised = true;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('novyxdev-lang');
      if (stored && this.dictionaries[stored]) {
        this.languageSubject.next(stored);
      }
    }
  }

  translate(key: string | null | undefined): string {
    if (!key) {
      return '';
    }

    const dictionary = this.dictionaries[this.languageSubject.value];
    const fallbackDictionary = this.dictionaries[this.defaultLanguage];

    return (
      this.resolveKey(dictionary, key) ??
      this.resolveKey(fallbackDictionary, key) ??
      key
    );
  }

  private resolveKey(dictionary: TranslationDictionary, key: string): string | undefined {
    return key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, dictionary) as string | undefined;
  }
}

