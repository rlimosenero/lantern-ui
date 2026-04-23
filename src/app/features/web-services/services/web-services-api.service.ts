import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { webServicesData, webServicesListTable } from '../../../core/models/static';
import { SearchResponse } from '../../../core/models/interface';

@Injectable({
  providedIn: 'root',
})
export class WebServicesApiService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getWebServicesList(pageNumber: number, requestFilters: any = { search: '', filters: [] }) {
    const url = `${this.config.baseUrl}/web-services?page=${pageNumber}`;
    return this.http.post<SearchResponse>(url, requestFilters);
  }

  getWebServicesDetails(uuid: string): any {
    const url = `${this.config.baseUrl}/web-services/${uuid}`;
    return this.http.get(url);
  }

  getFilterOptions() {
    const url = `${this.config.baseUrl}/web-services/filters`;
    return this.http.get(url);
  }

  getVersionHistoryList(uuid: string, pagenumber?: number) {
    const url = `${this.config.baseUrl}/web-services/${uuid}/versions?size=5&page=${pagenumber}`;
    return this.http.get(url);
  }

  addApiDetails(payload: any) {
    const url = `${this.config.baseUrl}/web-services/add`;
    return this.http.post(url, payload);
  }

  updateApiDetails(payload: any, apiUuid: string) {
    const url = `${this.config.baseUrl}/web-services/${apiUuid}`;
    return this.http.put(url, payload);
  }

}
