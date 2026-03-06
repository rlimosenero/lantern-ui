import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { webServicesData, webServicesListTable } from '../../../core/models/static';
import { SearchResponse } from '../../../core/models/interface';

@Injectable({
  providedIn: 'root',
})
export class WebServicesApiServiceService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getWebServicesList(pageNumber: number): any {
    const url = `${this.config.baseUrl}/web-services?page=${pageNumber}`;
    return this.http.get<SearchResponse>(url);
  }

  getWebServicesDetails(uuid: string): any {
    const url = `${this.config.baseUrl}/web-services/${uuid}`;
    return this.http.get(url);
  }

  getFilterOptions() {
    const url = `${this.config.baseUrl}/web-services/filters`;
    return this.http.get(url);
  }

}
