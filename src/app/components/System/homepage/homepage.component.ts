import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  readonly hero = {
    badgeKey: 'homepage.hero.badge',
    titleKey: 'homepage.hero.title',
    subtitleKey: 'homepage.hero.subtitle',
    primaryCta: { labelKey: 'homepage.hero.primaryCta', path: '/contact' },
    secondaryCta: { labelKey: 'homepage.hero.secondaryCta', path: '/portfolio' }
  };

  readonly highlights = [
    {
      titleKey: 'homepage.highlights.strategy.title',
      descriptionKey: 'homepage.highlights.strategy.description',
      icon: 'bi-diagram-3'
    },
    {
      titleKey: 'homepage.highlights.agile.title',
      descriptionKey: 'homepage.highlights.agile.description',
      icon: 'bi-lightning-charge'
    },
    {
      titleKey: 'homepage.highlights.operations.title',
      descriptionKey: 'homepage.highlights.operations.description',
      icon: 'bi-cloud-check'
    }
  ];

  readonly services = [
    {
      titleKey: 'homepage.services.items.webdev.title',
      tags: [
        'homepage.services.items.webdev.tags.angular',
        'homepage.services.items.webdev.tags.nestjs',
        'homepage.services.items.webdev.tags.node',
        'homepage.services.items.webdev.tags.rest',
        'homepage.services.items.webdev.tags.graphql'
      ]
    },
    {
      titleKey: 'homepage.services.items.uxui.title',
      tags: [
        'homepage.services.items.uxui.tags.designSystem',
        'homepage.services.items.uxui.tags.wireframe',
        'homepage.services.items.uxui.tags.prototype',
        'homepage.services.items.uxui.tags.figma'
      ]
    },
    {
      titleKey: 'homepage.services.items.integrations.title',
      tags: [
        'homepage.services.items.integrations.tags.erp',
        'homepage.services.items.integrations.tags.crm',
        'homepage.services.items.integrations.tags.thirdPartyApi',
        'homepage.services.items.integrations.tags.workflow'
      ]
    }
  ];

  readonly testimonials = [
    {
      quoteKey: 'homepage.testimonials.items.first.quote',
      authorKey: 'homepage.testimonials.items.first.author',
      roleKey: 'homepage.testimonials.items.first.role'
    },
    {
      quoteKey: 'homepage.testimonials.items.second.quote',
      authorKey: 'homepage.testimonials.items.second.author',
      roleKey: 'homepage.testimonials.items.second.role'
    }
  ];

  readonly stats = [
    { value: '30+', labelKey: 'homepage.stats.projects' },
    { value: '15+', labelKey: 'homepage.stats.experience' },
    { value: '98%', labelKey: 'homepage.stats.satisfaction' }
  ];
}
