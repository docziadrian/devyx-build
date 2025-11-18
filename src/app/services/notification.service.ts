import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from '../interfaces/notification';

interface NotificationConfig {
  duration?: number;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultDuration = 5000;
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private readonly timeoutMap = new Map<string, number>();

  readonly notifications$ = this.notificationsSubject.asObservable();

  push(
    type: NotificationType,
    titleKey: string,
    descriptionKey?: string,
    config: NotificationConfig = {}
  ): string {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      titleKey,
      descriptionKey,
      duration: config.duration ?? this.defaultDuration,
      autoClose: config.autoClose ?? true,
      createdAt: Date.now()
    };

    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...notifications]);

    if (notification.autoClose && typeof window !== 'undefined') {
      const timeoutId = window.setTimeout(() => this.dismiss(id), notification.duration);
      this.timeoutMap.set(id, timeoutId);
    }

    return id;
  }

  success(titleKey: string, descriptionKey?: string, config: NotificationConfig = {}): string {
    return this.push('success', titleKey, descriptionKey, config);
  }

  info(titleKey: string, descriptionKey?: string, config: NotificationConfig = {}): string {
    return this.push('info', titleKey, descriptionKey, config);
  }

  warning(titleKey: string, descriptionKey?: string, config: NotificationConfig = {}): string {
    return this.push('warning', titleKey, descriptionKey, config);
  }

  error(titleKey: string, descriptionKey?: string, config: NotificationConfig = {}): string {
    return this.push('error', titleKey, descriptionKey, config);
  }

  dismiss(id: string): void {
    const notifications = this.notificationsSubject.value.filter((item) => item.id !== id);
    this.notificationsSubject.next(notifications);

    const timeoutId = this.timeoutMap.get(id);
    if (timeoutId && typeof window !== 'undefined') {
      clearTimeout(timeoutId);
      this.timeoutMap.delete(id);
    }
  }

  clear(): void {
    this.notificationsSubject.next([]);
    this.timeoutMap.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeoutMap.clear();
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return Math.random().toString(36).slice(2, 11);
  }
}

