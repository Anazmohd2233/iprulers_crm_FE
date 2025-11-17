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
    ],
    templateUrl: './crm.component.html',
    styleUrl: './crm.component.scss',
})
export class CrmComponent {
    dashboardData: any;

    constructor(
        public themeService: CustomizerSettingsService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.getDashboardView();
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

}
