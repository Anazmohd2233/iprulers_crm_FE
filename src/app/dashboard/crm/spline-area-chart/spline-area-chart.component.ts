import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SplineAreaChartService } from './spline-area-chart.service';

@Component({
    selector: 'app-spline-area-chart',
    imports: [MatCardModule],
    templateUrl: './spline-area-chart.component.html',
    styleUrl: './spline-area-chart.component.scss'
})
export class SplineAreaChartComponent implements OnChanges {

    @Input() graphData: any;

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
    }

}