import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../../interfaces/navItem';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { LanguageOption, TranslationService } from '../../../services/translation.service';
import { NotificationService } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly navItems: NavItem[] = [
    { labelKey: 'navbar.links.home', path: '/' },
    { labelKey: 'navbar.links.services', path: '/services' },
    { labelKey: 'navbar.links.fivem', path: '/fivem' },
    { labelKey: 'navbar.links.portfolio', path: '/portfolio' },
    { labelKey: 'navbar.links.contact', path: '/contact' },
    { labelKey: 'navbar.links.blog', path: '/blog' },
  ];

  readonly languages: LanguageOption[];
  selectedLanguage: LanguageOption;
  isDarkMode = false;
  languageMenuOpen = false;
  private languageSubscription?: Subscription;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly translationService: TranslationService,
    private readonly notificationService: NotificationService
  ) {
    this.languages = this.translationService.languages;
    this.selectedLanguage = this.languages[0];
  }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    this.translationService.initialise();
    this.selectedLanguage = this.getLanguageOption(this.translationService.currentLanguage);
    this.languageSubscription = this.translationService.languageChanges().subscribe((code) => {
      this.selectedLanguage = this.getLanguageOption(code);
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    this.notificationService.info(
      this.isDarkMode ? 'navbar.notifications.theme.dark.title' : 'navbar.notifications.theme.light.title',
      this.isDarkMode
        ? 'navbar.notifications.theme.dark.description'
        : 'navbar.notifications.theme.light.description',
      { duration: 3500 }
    );
  }

  toggleLanguageMenu(): void {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  closeLanguageMenu(): void {
    this.languageMenuOpen = false;
  }

  setLanguage(languageCode: string): void {
    const next = this.languages.find((lang) => lang.code === languageCode);
    if (next) {
      this.selectedLanguage = next;
      this.translationService.setLanguage(languageCode);
      this.closeLanguageMenu();
      this.notificationService.success(
        'navbar.notifications.language.title',
        'navbar.notifications.language.description',
        { duration: 3200 }
      );
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.languageMenuOpen = false;
    }
  }

  private getLanguageOption(code: string): LanguageOption {
    return this.languages.find((lang) => lang.code === code) ?? this.languages[0];
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}
