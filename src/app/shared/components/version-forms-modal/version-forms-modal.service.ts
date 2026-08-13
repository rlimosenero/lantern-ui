import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root'
})
export class VersionFormsModalService {

  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private state$ = new BehaviorSubject<any>(null);
  private result$ = new Subject<any>();

  open(config: any): Observable<any> {
    this.state$.next(config);
    return this.result$.asObservable();
  }

  close(result?: any) {
    this.state$.next(null);
    this.result$.next(result);
  }

  getState() {
    return this.state$.asObservable();
  }

  addApplicationVersion(payload: any) {
    return this.http.post(
      `${this.config.baseUrl}/applications/versions/add`,
      payload
    );
  }

  updateApplicationVersion(payload: any, appVersionUuid: string) {
    return this.http.put(
      `${this.config.baseUrl}/applications/versions/${appVersionUuid}`,
      payload
    );
  }

  deleteApplicationVersion(appVersionUuid: string) {
    return this.http.delete(
      `${this.config.baseUrl}/applications/versions/${appVersionUuid}`
    );
  }

  addApiVersion(payload: any) {
    return this.http.post(
      `${this.config.baseUrl}/web-services/versions/add`,
      payload
    );
  }

  updateApiVersion(payload: any, apiVersionUuid: string) {
    return this.http.put(
      `${this.config.baseUrl}/web-services/versions/${apiVersionUuid}`,
      payload
    );
  }

  deleteApiVersion(apiVersionUuid: string) {
    return this.http.delete(
      `${this.config.baseUrl}/web-services/versions/${apiVersionUuid}`
    );
  }

  getApplicationVersionValidationProperties() {
    const url = `${this.config.baseUrl}/validation/record/application-version-record/form/applicationVersion`;
    return this.http.get(url);
  }

  getApplicationApiVersionValidationProperties() {
    const url = `${this.config.baseUrl}/validation/record/application-api-version-record/form/applicationApiVersion`;
    return this.http.get(url);
  }
}