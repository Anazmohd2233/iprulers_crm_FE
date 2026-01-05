import { Component } from '@angular/core';
import { StatsComponent } from './stats/stats.component';
import { MostLeadsComponent } from './most-leads/most-leads.component';
import { CountryStatsComponent } from './country-stats/country-stats.component';
import { EarningReportsComponent } from './earning-reports/earning-reports.component';
import { TasksStatsComponent } from './tasks-stats/tasks-stats.component';
import { TopCustomersComponent } from './top-customers/top-customers.component';
import { RecentLeadsComponent } from './recent-leads/recent-leads.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ClientPaymentStatusComponent } from './client-payment-status/client-payment-status.component';
import { TotalLeadsComponent } from './total-leads/total-leads.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NewUsersComponent } from './stats/new-users/new-users.component';
import { ActiveUsersComponent } from './stats/active-users/active-users.component';
import { LeadConversationComponent } from './stats/lead-conversation/lead-conversation.component';
import { RevenueGrowthComponent } from './stats/revenue-growth/revenue-growth.component';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { DashboardService } from '../../services/dashboard.service';
import { HttpParams } from '@angular/common/http';
import { TotalSalesComponent } from './total-sales/total-sales.component';
import { SplineAreaChartComponent } from './spline-area-chart/spline-area-chart.component';
import { PieDonutChartComponent } from './pie-donut-chart/pie-donut-chart.component';
import { RevenueComponent } from './revenue/revenue.component';
import { CustomAngleCircleRadialbarChartComponent } from './custom-angle-circle-radialbar-chart/custom-angle-circle-radialbar-chart.component';
import { MultipleRadialbarChartComponent } from './multiple-radialbar-chart/multiple-radialbar-chart.component';
import { StrockedCircularGaugeRadialbarChartComponent } from './strocked-circular-gauge-radialbar-chart/strocked-circular-gauge-radialbar-chart.component';
import { GradientRadialbarChartComponent } from './gradient-radialbar-chart/gradient-radialbar-chart.component';
import { SemiCircularGaugeRadialbarChartComponent } from './semi-circular-gauge-radialbar-chart/semi-circular-gauge-radialbar-chart.component';
import { NgFor } from '@angular/common';
import { BasicRadialbarChartComponent } from './basic-radialbar-chart/basic-radialbar-chart.component';
import { MultipleRadialbarChartComponent2 } from './multi-radialbar-chart-2/multiple-radialbar-chart.component';
import { BasicPolarChartComponent } from './basic-polar-chart/basic-polar-chart.component';

@Component({
    selector: 'app-crm',
    imports: [
        StatsComponent,
        MostLeadsComponent,
        CountryStatsComponent,
        EarningReportsComponent,
        TasksStatsComponent,
        TopCustomersComponent,
        RecentLeadsComponent,
        ToDoListComponent,
        ClientPaymentStatusComponent,
        TotalLeadsComponent,
        SalesOverviewComponent,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        NewUsersComponent,
        ActiveUsersComponent,
        LeadConversationComponent,
        RevenueGrowthComponent,
        TotalSalesComponent,
        SplineAreaChartComponent,
        BasicRadialbarChartComponent,
        PieDonutChartComponent,
        RevenueComponent,
        CustomAngleCircleRadialbarChartComponent,
        MultipleRadialbarChartComponent,
        MultipleRadialbarChartComponent2,
        StrockedCircularGaugeRadialbarChartComponent,
        GradientRadialbarChartComponent,
        SemiCircularGaugeRadialbarChartComponent,
        BasicPolarChartComponent,
    ],
    templateUrl: './crm.component.html',
    styleUrl: './crm.component.scss',
})
export class CrmComponent {
    dashboardData: any;
    dashboardDetails: any;
    dashboardPayments: any;

    constructor(
        public themeService: CustomizerSettingsService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.getDashboardView();
        this.getDashboardDetails();
        this.getDashboardPayment();
    }

    private getDashboardView(params?:HttpParams): void {
        this.dashboardService.getDashboardSummary(params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.dashboardData = response.data || [];
                    console.log('response.data ',response.data )
                } else {
                    console.error(
                        'Failed to load dashboard',
                        response?.message
                    );
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    onDateRangeChange(range: { start: string; end: string }) {
        console.log("Received date range in CRM:", range);
                let params = new HttpParams();
            if (range.start) params = params.set('start', range.start);
                    if (range.end) params = params.set('end', range.end);

    
        this.getDashboardView(params);
    
    }

    private getDashboardDetails(month?:string): void {
        this.dashboardService.getDashboardDetails(month).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.dashboardDetails = res.data;
                }
            }
        })
    }

    private getDashboardPayment(week?:string | number): void {
        this.dashboardService.getDashboardPayment(week).subscribe({
            next: (res: any) => {
                                    console.log('Res =>> ',res)

                if (res.success) {
                    this.dashboardPayments = res.data;
                }
            }
        })
    }

}
