import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BasicPolarChartService } from './basic-polar-chart.service';

@Component({
    selector: 'app-basic-polar-chart',
    imports: [MatCardModule],
    templateUrl: './basic-polar-chart.component.html',
    styleUrl: './basic-polar-chart.component.scss'
})
export class BasicPolarChartComponent implements OnChanges {
    
    @Input() chartData: any;

    constructor(
        private basicPolarChartService: BasicPolarChartService
    ) {}

     ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData']) {
            // this.pieDonutChartService.updateFromObject(this.chartData);
            this.basicPolarChartService.loadChart(this.chartData);

        }

    }

    ngOnInit(): void {
        // this.basicPolarChartService.loadChart();
    }

}