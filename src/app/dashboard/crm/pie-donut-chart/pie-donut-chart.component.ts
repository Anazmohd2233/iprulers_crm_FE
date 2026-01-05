import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PieDonutChartService } from './pie-donut-chart.service';

@Component({
    selector: 'app-pie-donut-chart',
    imports: [MatCardModule],
    templateUrl: './pie-donut-chart.component.html',
    styleUrl: './pie-donut-chart.component.scss'
})
export class PieDonutChartComponent implements OnChanges {

    @Input() chartData: any;

    constructor(
        private pieDonutChartService: PieDonutChartService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData']) {
            // this.pieDonutChartService.updateFromObject(this.chartData);
                    this.pieDonutChartService.loadChart(this.chartData);

        }

    }

    ngOnInit(): void {
        // this.pieDonutChartService.loadChart(this.chartData);
    }

}