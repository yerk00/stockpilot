import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  checks: {
    database: boolean;
    redis: boolean;
  };
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  check(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>('/api/health');
  }
}
