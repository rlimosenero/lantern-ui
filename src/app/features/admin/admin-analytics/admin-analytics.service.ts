import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class AdminAnalyticsService {

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private readonly baseUrl =
    `${this.config.baseUrl}/api/v1/analytics/completeness`;

  getCompletenessSummary() {
    const url = `${this.baseUrl}/summary`;

    return this.http.get(url);
  }

  getApplicationCompleteness(page: number = 0, size: number = 10) {
    const url = `${this.baseUrl}/applications?page=${page}&size=${size}`;

    return this.http.get(url);
  }

}