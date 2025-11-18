import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../interfaces/notification';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TranslatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  readonly notifications$: Observable<Notification[]>;

  constructor(private readonly notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  dismiss(notification: Notification): void {
    this.notificationService.dismiss(notification.id);
  }

  trackById(_: number, notification: Notification): string {
    return notification.id;
  }

  iconFor(notification: Notification): string {
    switch (notification.type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }
}
