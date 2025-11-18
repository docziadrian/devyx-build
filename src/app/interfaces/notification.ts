export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  titleKey: string;
  descriptionKey?: string;
  duration?: number;
  autoClose?: boolean;
  createdAt: number;
}

