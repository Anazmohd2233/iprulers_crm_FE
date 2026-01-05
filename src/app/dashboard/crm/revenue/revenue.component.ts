import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RevenueService } from './revenue.service';

@Component({
    selector: 'app-revenue',
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './revenue.component.html',
    styleUrl: './revenue.component.scss'
})
export class RevenueComponent implements OnChanges, AfterViewInit {

    @Input() graphData: any;
    private viewReady = false;
    
    constructor(private revenueService: RevenueService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['graphData']) {
          this.revenueService.loadChart(this.graphData);
        }
    }

    ngOnInit(): void {
        // this.revenueService.loadChart();
    }

    ngAfterViewInit(): void {
    this.viewReady = true;

    if (this.graphData) {
      this.revenueService.loadChart(this.graphData);
    }
  }

}