import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { LocalFileContentResponse, LocalFileResponse, SearchResponse } from '../../../core/models/interface';
import { Observable } from 'rxjs';

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

  deleteApiDetails(apiUuid: string) {
    const url = `${this.config.baseUrl}/web-services/${apiUuid}`;
    return this.http.delete(url);
  }

  getValidationProperties() {
    const url = `${this.config.baseUrl}/validation/record/application-api-record/form/applicationApi`;
    return this.http.get(url);
  }

  getLocalFileLocation(fileLoc: string) {
    const params = new HttpParams().set('sourceFolderUrl', fileLoc);

    return this.http.get(
      `${this.config.baseUrl}/local-files`,
      { params }
    );
  }

  getLocalFileContent(appApiUuid: string,file: LocalFileResponse){
    const params = new HttpParams()
      .set('path', file.relativePath)
      .set('appApiUuid', appApiUuid);

    return this.http.get<LocalFileContentResponse>(
      `${this.config.baseUrl}/local-files/content`,
      { params }
    );
  }

}
