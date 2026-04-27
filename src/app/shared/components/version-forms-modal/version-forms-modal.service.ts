import { HttpClient } from '@angular/common/http';
import { ApplicationRef, createComponent, inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { Subject } from 'rxjs';
import { VersionFormsModalComponent } from './version-forms-modal.component';

@Injectable({
  providedIn: 'root',
})
export class VersionFormsModalService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  private componentRef: any;
  private result$ = new Subject<any>();

  constructor(private appRef: ApplicationRef) { }

  open(data: any) {
    this.componentRef = createComponent(VersionFormsModalComponent, {
      environmentInjector: this.appRef.injector
    });

    this.componentRef.instance.data = data;

    this.componentRef.instance.close.subscribe((res: any) => {
      this.result$.next(res);
      this.close();
    });

    this.appRef.attachView(this.componentRef.hostView);
    document.body.appendChild(this.componentRef.location.nativeElement);

    return this.result$.asObservable();
  }

  close() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  addApplicationVersion(payload: any) {
    const url = `${this.config.baseUrl}/applications/versions/add`;
    return this.http.post(url, payload);
  }

  updateApplicationVersion(payload: any, appVersionUuid: string) {
    const url = `${this.config.baseUrl}/applications/versions/${appVersionUuid}`;
    return this.http.put(url, payload);
  }

}
