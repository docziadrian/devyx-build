import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../../interfaces/navItem';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  readonly navItems: NavItem[] = [
    { labelKey: 'navbar.links.home', path: '/' },
    { labelKey: 'navbar.links.services', path: '/services' },
    { labelKey: 'navbar.links.portfolio', path: '/portfolio' },
    { labelKey: 'navbar.links.contact', path: '/contact' }
  ];

  readonly contactEmail = 'hello@novyxdev.hu';
  readonly contactPhoneDisplay = '+36 30 123 4567';
  readonly contactPhoneHref = '+36301234567';

  readonly socialLinks: { label: string; url: string; icon: string }[] = [
    { label: 'Facebook', url: 'https://facebook.com/novyxdev', icon: 'bi-facebook' },
    { label: 'LinkedIn', url: 'https://linkedin.com/company/novyxdev', icon: 'bi-linkedin' },
    { label: 'GitHub', url: 'https://github.com/novyxdev', icon: 'bi-github' }
  ];
}
