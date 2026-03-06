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

  getAppList(pageNumber: number) {
    const url = `${this.config.baseUrl}/applications?page=${pageNumber}`;
    return this.http.get<SearchResponse>(url);
  }

  // getAppDetails(uuid: string): Application | undefined {
  //   return applicationData.find(app => app.uuid === uuid);
  // }

  getAppDetails(uuid: string) {
    const url = `${this.config.baseUrl}/applications/${uuid}`;
    return this.http.get(url);
  }

  getFilterOptions() {
    return filterData;
  }

  getWebServicesList(uuid: string, pagenumber?: number) {
    const url = `${this.config.baseUrl}/applications/web-services/${uuid}?size=5&page=${pagenumber}`;
    return this.http.get(url);
  }
}
