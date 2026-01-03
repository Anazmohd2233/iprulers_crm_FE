import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MultipleRadialbarChartService } from './multiple-radialbar-chart.service';

@Component({
    selector: 'app-multiple-radialbar-chart-2',
    imports: [MatCardModule],
    templateUrl: './multiple-radialbar-chart.component.html',
    styleUrl: './multiple-radialbar-chart.component.scss'
})
export class MultipleRadialbarChartComponent2 {

    constructor(
        private multipleRadialbarChartService: MultipleRadialbarChartService
    ) {}

    ngOnInit(): void {
        this.multipleRadialbarChartService.loadChart();
    }

}