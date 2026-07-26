import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from '../../utils/services/auth.service';
import { PouchDbService } from '../../utils/services/pouchdb.service';
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
    datasets: [{
      data: [],
      backgroundColor: ['#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
      hoverOffset: 0,
      hoverBackgroundColor: ['#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'],
      borderWidth: 0
    }]
  };

  public donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  public barData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: '#6b7280',
      hoverBackgroundColor: '#6b7280',
      borderWidth: 0
    }]
  };

  public barOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { grid: { display: false }, ticks: { display: false } },
      y: { display: true, beginAtZero: true, grid: { display: false }, ticks: { display: false } }
    },
    plugins: {
      legend: { display: false }
    }
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private pouchDbService: PouchDbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<DashboardData>(DASHBOARD_URL).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateCharts(data);
        this.pouchDbService.saveDashboardData(data as any);
        this.loading = false;
      },
      error: async () => {
        const cachedData = await this.pouchDbService.getDashboardData();
        if (cachedData) {
          this.dashboardData = cachedData as DashboardData;
          this.updateCharts(this.dashboardData);
        }
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
}
