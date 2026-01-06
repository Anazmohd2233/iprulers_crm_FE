import { Component, Input, OnChanges, Output, signal, SimpleChanges, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SplineAreaChartService } from './spline-area-chart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-spline-area-chart',
    imports: [MatCardModule,MatMenuModule, MatButtonModule],
    templateUrl: './spline-area-chart.component.html',
    styleUrl: './spline-area-chart.component.scss'
})
export class SplineAreaChartComponent implements OnChanges {

    @Input() graphData: any;
    @Output() yearChange = new EventEmitter<any>();

    years = signal<number[]>([]);
    selectedYear = signal<number>(new Date().getFullYear());

    constructor(
        private splineAreaChartService: SplineAreaChartService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['graphData']) {
            this.splineAreaChartService.loadChart(this.graphData);
        }
    }

    ngOnInit(): void {
        // this.splineAreaChartService.loadChart();
        this.generateYears(2025);
    }

    private generateYears(startYear: number): void {
        const currentYear = new Date().getFullYear();
        const list: number[] = [];

        for (let year = startYear; year <= currentYear; year++) {
        list.push(year);
        }
        
        this.years.set(list.sort((a,b) => b - a));
        this.selectedYear.set(currentYear); // default → this year
        this.yearChange.emit(this.selectedYear())
    }

    selectYear(year: any) {
        this.selectedYear.set(year);
        this.yearChange.emit(this.selectedYear());

    }

}