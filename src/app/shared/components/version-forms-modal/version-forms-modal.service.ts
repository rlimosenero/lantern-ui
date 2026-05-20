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

  updateApplicationVersion(payload: any, uuid: string) {
    return this.http.put(
      `${this.config.baseUrl}/applications/versions/${uuid}`,
      payload
    );
  }

  addApiVersion(payload: any) {
    return this.http.post(
      `${this.config.baseUrl}/web-services/versions/add`,
      payload
    );
  }

  updateApiVersion(payload: any, uuid: string) {
    return this.http.put(
      `${this.config.baseUrl}/web-services/versions/${uuid}`,
      payload
    );
  }
}