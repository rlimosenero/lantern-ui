import { AppStatus } from "./enum";

export interface BasicInfo {
  name: string;
  description: string;
  version: string;
  status: AppStatus;
  ownerName: string;
  ownerDept: string;
  bauSuppDept: string;
  bauSuppName: string;
}

export interface LinkAndResources {
  gitRepoLink: string;
  swaggerLink: string;
  sharepointLink: string;
}

export interface TechStack {
  platform: string[] | [];
  appTech: string[] | [];
  storageAndData: string[] | [];
  security: string[] | [];
}

export interface Application {
  applicationId: string;
  uuid:string,
  basicInfo: BasicInfo[];
  linkAndResources: LinkAndResources[];
  techStack: TechStack[];
}

// from sir ed
export interface TableItem {
  id: number;
  appUuid: string;
  name: string;
  description: string;
  status: string;
  stableVersion: string;
  betaVersion: string;
}

interface CatalogData {
  hasNextPage: boolean;
  totalElements: number;
  results: TableItem[];
  currentPage: number;
  pageSize: number;
}

export interface CatalogListItem {
  data: CatalogData;
  flag: string;
  message: string;
  tranRefNo: string;
}

export interface User {
  id: string;
  name: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER';
  token: string;
}

// start of backend interface
export interface SearchResponse {
  [x: string]: any;
  data: any;
  flag: string;
  message: string;
  tranRefNo: string;
}

export interface PaginatedData {
  hasNextPage: boolean;
  totalElements: number;
  results: ApplicationSummary[];
  currentPage: number;
  pageSize: number;
}

export interface ApplicationSummary {
  id: number;
  appUuid: string;
  appName: string;
  appDesc: string;
  lifecycleStatus: string; 
  stableProdVersion: string | null;
  betaUatVersion: string | null;
}

export interface FilterOption {
  label: string;
  key: string;
  options: string[];
  isOpen?: boolean;
}

export interface ApiFilterRequest {
  search: string;
  filters: Array<{ key: string; value: string }>;
}