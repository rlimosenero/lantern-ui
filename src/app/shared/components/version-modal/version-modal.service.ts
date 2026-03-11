import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class VersionModalService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getVersionDetails(uuid: string){
    const url = `${this.config.baseUrl}/applications/versions/${uuid}/details`;
    return this.http.get(url);
  }
}
