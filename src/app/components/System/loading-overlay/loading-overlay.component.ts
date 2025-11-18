import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss'
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  readonly isVisible = signal(true);
  private timeoutId?: number;
  private readonly handleLoad = () => this.scheduleHide(1200);

  ngOnInit(): void {
    if (document.readyState === 'complete') {
      this.scheduleHide(1200);
      return;
    }

    window.addEventListener('load', this.handleLoad, { once: true });
    this.scheduleHide(5200);
  }

  ngOnDestroy(): void {
    window.removeEventListener('load', this.handleLoad);
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  private scheduleHide(delay: number): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.hideOverlay(), delay);
  }

  private hideOverlay(): void {
    if (!this.isVisible()) {
      return;
    }
    window.requestAnimationFrame(() => {
      this.isVisible.set(false);
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
      }
    });
  }
}

