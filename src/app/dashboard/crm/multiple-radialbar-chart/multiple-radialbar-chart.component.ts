import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MultipleRadialbarChartService } from './multiple-radialbar-chart.service';

@Component({
    selector: 'app-multiple-radialbar-chart',
    imports: [MatCardModule],
    templateUrl: './multiple-radialbar-chart.component.html',
    styleUrl: './multiple-radialbar-chart.component.scss'
})
export class MultipleRadialbarChartComponent implements OnChanges, AfterViewInit{
    @Input() chartData: any;
    private viewReady = false;

    constructor(
        private multipleRadialbarChartService: MultipleRadialbarChartService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData']) {
            this.multipleRadialbarChartService.updateFromObject(this.chartData);
        }

    }

    ngOnInit(): void {
        this.multipleRadialbarChartService.loadChart(this.chartData);
    }

    ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.chartData) {
      this.multipleRadialbarChartService.loadChart(this.chartData);
    }
  }

}