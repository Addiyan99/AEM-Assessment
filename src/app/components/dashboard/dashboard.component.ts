import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from '../../utils/services/auth.service';
import { SIGN_IN_ROUTE } from '../../utils/constants/route-constant';

const DASHBOARD_URL = 'http://test-demo.aemenersol.com/api/dashboard';

interface DashboardData {
  chartDonut: Array<{ name: string; value: number }>;
  chartBar: Array<{ name: string; value: number }>;
  tableUsers: Array<{ firstName: string; lastName: string; username: string }>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  loading = true;

  public donutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#4f46e5', '#0f766e', '#0284c7', '#f97316'], hoverOffset: 12 }]
  };

  public donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  public barData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: '#2563eb' }]
  };

  public barOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    }
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<DashboardData>(DASHBOARD_URL).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateCharts(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateCharts(data: DashboardData): void {
    this.donutData = {
      ...this.donutData,
      labels: data.chartDonut.map(item => item.name),
      datasets: [
        {
          ...this.donutData.datasets[0],
          data: data.chartDonut.map(item => item.value)
        }
      ]
    };

    this.barData = {
      ...this.barData,
      labels: data.chartBar.map(item => item.name),
      datasets: [
        {
          ...this.barData.datasets[0],
          data: data.chartBar.map(item => item.value)
        }
      ]
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([SIGN_IN_ROUTE]);
  }
}
