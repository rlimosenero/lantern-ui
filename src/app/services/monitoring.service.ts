import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private services = new BehaviorSubject([
    { name: 'User-Auth-Service', status: 'Online', lastDeployment: '2026-02-01' },
    { name: 'Payment-Gateway', status: 'Offline', lastDeployment: '2026-01-28' },
    { name: 'Inventory-Worker', status: 'Online', lastDeployment: '2026-02-05' }
  ]);

  services$ = this.services.asObservable();

  getStats() {
    const current = this.services.value;
    return {
      total: current.length,
      online: current.filter(s => s.status === 'Online').length,
      alerts: current.filter(s => s.status === 'Offline').length
    };
  }
}