import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class DataFieldsModalService {
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

  addNewDataFields(payload: any, appApiUuid: string) {
    const url = `${this.config.baseUrl}/data-fields/${appApiUuid}/add`;
    return this.http.post(url, payload);
  }

  updateDataFields(payload: any, appApiUuid: string){
    const url = `${this.config.baseUrl}/data-fields/${appApiUuid}`;
    return this.http.put(url, payload);
  }

}

