import { Component, Input, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CustomAngleCircleRadialbarChartService } from './custom-angle-circle-radialbar-chart.service';

@Component({
    selector: 'app-custom-angle-circle-radialbar-chart',
    imports: [MatCardModule],
    templateUrl: './custom-angle-circle-radialbar-chart.component.html',
    styleUrl: './custom-angle-circle-radialbar-chart.component.scss'
})
export class CustomAngleCircleRadialbarChartComponent {

    @Input() chartData: any;

    constructor(
        private customAngleCircleRadialbarChartService: CustomAngleCircleRadialbarChartService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData']) {
            this.customAngleCircleRadialbarChartService.loadChart(this.chartData);
        }
    }

    ngOnInit(): void {
        // this.customAngleCircleRadialbarChartService.loadChart(this.chartData);
    }

}