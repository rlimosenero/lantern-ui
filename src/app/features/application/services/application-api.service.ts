import { inject, Injectable } from '@angular/core';
import { SearchResponse } from '../../../core/models/interface';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationApiService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getAppList(pageNumber: number, requestFilters: any = { search: '', filters: [] }) {
    const url = `${this.config.baseUrl}/applications?page=${pageNumber}`;

    return this.http.post<SearchResponse>(url, requestFilters);
  }

  getAppDetails(uuid: string) {
    const url = `${this.config.baseUrl}/applications/${uuid}`;
    return this.http.get(url);
  }

  getFilterOptions() {
    const url = `${this.config.baseUrl}/applications/filters`;
    return this.http.get(url);
  }

  getWebServicesList(uuid: string, pagenumber?: number) {
    const url = `${this.config.baseUrl}/applications/web-services/${uuid}?size=5&page=${pagenumber}`;
    return this.http.get(url);
  }

  getVersionHistoryList(uuid: string, pagenumber?: number, pageSize?: number) {
    const size = pageSize || 5;
    
    const url = `${this.config.baseUrl}/applications/${uuid}/versions?size=${size}&page=${pagenumber}`;
    return this.http.get(url);
  }

  updateAppDetails(uuid: string, payload: any) {
    const url = `${this.config.baseUrl}/applications/${uuid}`;
    return this.http.put(url, payload);
  }

  addAppDetails(payload: any) {
    const url = `${this.config.baseUrl}/applications/add`;
    return this.http.post(url, payload);
  }

  deleteAppDetails(uuid: string) {
    const url = `${this.config.baseUrl}/applications/${uuid}`;
    return this.http.delete(url);
  }

  getDropdownOptions(groupName: string) {
    const url = `${this.config.baseUrl}/reference-data/group/${groupName}`;
    return this.http.get(url);
  }

}
