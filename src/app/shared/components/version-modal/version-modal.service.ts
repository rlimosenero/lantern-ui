import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class VersionModalService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getApplicationVersionDetails(appVersionUuid: string) {
    const url = `${this.config.baseUrl}/applications/versions/${appVersionUuid}/details`;
    return this.http.get(url);
  }

  getApiVersionDetails(appVersionUuid: string) {
    const url = `${this.config.baseUrl}/web-services/versions/${appVersionUuid}/details`;
    return this.http.get(url);
  }

  getAudit(appVersionUuid: string, pagenumber?: number) {
    const url = `${this.config.baseUrl}/applications/versions/${appVersionUuid}/audit?size=5&page=${pagenumber}`;
    return this.http.get(url);
  }
}
