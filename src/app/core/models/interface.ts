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
  role: 'ADMIN' | 'USER';
  token: string;
}