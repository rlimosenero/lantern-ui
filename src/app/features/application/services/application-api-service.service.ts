import { inject, Injectable } from '@angular/core';
import { Application, CatalogListItem } from '../../../core/models/interface';
import { applicationData, appListTable } from '../../../core/models/static';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../../core/models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationApiService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getAppList() {
    return appListTable;
  }

  getAppDetails(appID: string): Application | undefined {
    return applicationData.find(obj => obj['applicationId'] === appID)
  }

}
