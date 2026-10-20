import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthResponse, HealthService } from './core/health/health.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly healthService = inject(HealthService);

  protected readonly title = signal('StockPilot');
  protected readonly health = signal<HealthResponse | null>(null);
  protected readonly healthError = signal(false);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.healthService.check().subscribe({
      next: (health) => {
        this.health.set(health);
        this.healthError.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.healthError.set(true);
        this.loading.set(false);
      },
    });
  }
}
