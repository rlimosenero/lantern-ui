import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../core/models/app.config.model';
import { SearchResponse } from '../../../core/models/interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
    private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getSearchList(keyword: string, category: string, page?: number){
    const url = `${this.config.baseUrl}/catalog/search?keyword=${keyword}&categories=${category}&page=${page}&size=10`;
    return this.http.get<SearchResponse>(url);
  }
}
