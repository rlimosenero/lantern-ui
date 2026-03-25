import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getMasterExcel() {
    const url = `${this.config.baseUrl}/generate-master-excel`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }

  importExcel(file: File): Observable<any> {
    const url = `${this.config.baseUrl}/excel/import`;
    
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(url, formData);
  }

}
