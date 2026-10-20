import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the API status', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const request = http.expectOne('/api/health');
    request.flush({
      status: 'ok',
      service: 'stockpilot-api',
      version: '0.1.0',
      checks: { database: true, redis: true },
      timestamp: '2026-10-20T12:00:00+00:00',
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Inventario bajo control');
    expect(compiled.textContent).toContain('API: ok');
  });
});
