import { inject, Injectable } from '@angular/core';
import { Application, SearchResponse } from '../../../core/models/interface';
import { applicationData, filterData } from '../../../core/models/static';
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

  getVersionHistoryList(uuid: string, pagenumber?: number) {
    const url = `${this.config.baseUrl}/applications/${uuid}/versions?size=5&page=${pagenumber}`;
    return this.http.get(url);
  }

}
