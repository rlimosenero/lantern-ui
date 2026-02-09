import { Injectable, signal, computed } from '@angular/core';

export interface WebService {
  name: string;
  desc: string;
  version: string;
  status: 'Active' | 'For Deprecation'| 'Deprecated' | 'For Retrirement';
  
}

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  // 1. The private 'Source of Truth'
  private servicesSignal = signal<WebService[]>([
    { name: 'Customer Portal', desc:'Self-service portal for customer account management', version: '3.2.1', status: 'Active' },
    { name: 'Analytics Dashboard', desc:'Real-time business intelligence and reporting platform', version: '2.5.0', status: 'Deprecated' },
    { name: 'Inventory Manager', desc:'Track and manage product inventory across warehouses', version: '4.1.3', status: 'For Deprecation' }
  ]);

  // 2. Public Read-Only version for components
  services = this.servicesSignal.asReadonly();

  // 3. Automated counters using 'computed'
  totalCount = computed(() => this.servicesSignal().length);
  onlineCount = computed(() => this.servicesSignal().filter(s => s.status === 'Active').length);
  alertCount = computed(() => this.servicesSignal().filter(s => s.status === 'Deprecated').length);

  // 4. Action method to update state
  toggleStatus(serviceName: string) {
    this.servicesSignal.update(list => 
      list.map(s => s.name === serviceName 
        ? { ...s, status: s.status === 'Active' ? 'Deprecated' : 'Active' } 
        : s
      )
    );
  }
}