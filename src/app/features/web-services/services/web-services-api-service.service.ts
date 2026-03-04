import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { webServicesData, webServicesListTable } from '../../../core/models/static';

@Injectable({
  providedIn: 'root',
})
export class WebServicesApiServiceService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  
    getWebServicesList() :any {
      return webServicesListTable;
    }
  
    getWebServicesDetails(uuid: string): any {
      return webServicesData.find(app => app.uuid === uuid);
    }
  
}
