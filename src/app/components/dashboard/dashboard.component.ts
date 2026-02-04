import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  DoughnutController, 
  LineController, 
  BarController,
  Legend, 
  Tooltip, 
  Filler 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  DoughnutController,
  LineController,
  BarController,
  Legend,
  Tooltip,
  Filler
);

interface Metric {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    BaseChartDirective,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  metrics: Metric[] = [
    {
      title: 'Total Users',
      value: 2547,
      icon: '👥',
      color: '#3498db',
      trend: '+12% from last month'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      icon: '💰',
      color: '#2ecc71',
      trend: '+8% from last month'
    },
    {
      title: 'Orders',
      value: 1823,
      icon: '📦',
      color: '#f39c12',
      trend: '+5% from last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      icon: '📊',
      color: '#e74c3c',
      trend: '+0.5% from last month'
    }
  ];

  constructor() {
    console.log('Dashboard component initialized');
    console.log('Metrics:', this.metrics);
  }

  // Line Chart - Revenue Trend
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + value
        }
      }
    }
  };

  // Bar Chart - Orders by Category
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'],
    datasets: [
      {
        label: 'Orders',
        data: [350, 280, 450, 220, 310, 280],
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#f39c12',
          '#e74c3c',
          '#9b59b6',
          '#1abc9c'
        ],
        borderRadius: 5,
        borderWidth: 0
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Pie Chart - Market Share
  pieChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#3498db', '#2ecc71', '#f39c12'],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 15
        }
      }
    }
  };

  // Table Data - Recent Orders
  orders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      product: 'Laptop Computer',
      amount: 1299,
      status: 'completed',
      date: '2024-02-01'
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      product: 'Wireless Mouse',
      amount: 49,
      status: 'completed',
      date: '2024-02-02'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Chen',
      product: 'USB-C Cable',
      amount: 15,
      status: 'pending',
      date: '2024-02-03'
    },
    {
      id: 'ORD-004',
      customer: 'Emily Davis',
      product: 'Mechanical Keyboard',
      amount: 159,
      status: 'completed',
      date: '2024-02-03'
    },
    {
      id: 'ORD-005',
      customer: 'Alex Brown',
      product: 'Monitor Stand',
      amount: 79,
      status: 'cancelled',
      date: '2024-02-04'
    },
    {
      id: 'ORD-006',
      customer: 'Jessica White',
      product: 'Desk Lamp',
      amount: 45,
      status: 'pending',
      date: '2024-02-04'
    }
  ];

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Filter and search
  searchTerm: string = '';
  statusFilter: string = '';

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
  }

  // Table columns to display
  displayedColumns: string[] = ['id', 'customer', 'product', 'amount', 'status', 'date'];
}
