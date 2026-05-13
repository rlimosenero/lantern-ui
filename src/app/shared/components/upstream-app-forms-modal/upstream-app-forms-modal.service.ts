import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class UpstreamAppFormsModalService {

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

  addUpstreamApplication(payload: any) {
    const url = `${this.config.baseUrl}/upstream-applications/add`;
    return this.http.post(url, payload);
  }

  updateUpstreamApplication(payload: any, uuid: string) {
    const url = `${this.config.baseUrl}/upstream-applications/${uuid}`;
    return this.http.put(url, payload);
  }
}