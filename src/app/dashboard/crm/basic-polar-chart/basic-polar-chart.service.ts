import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class BasicPolarChartService {

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(): Promise<void> {
        if (this.isBrowser) {
            try {
                // Dynamically import ApexCharts
                const ApexCharts = (await import('apexcharts')).default;

                // Define chart options
                const options = {
                    series: [
                        14, 23, 21, 17, 15, 10, 12
                    ],
                    chart: {
                        height: 325,
                        type: "polarArea"
                    },
                    stroke: {
                        colors: ["#ffffff"]
                    },
                    fill: {
                        opacity: 0.8
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 325
                                },
                                legend: {
                                    position: "bottom"
                                }
                            }
                        }
                    ],
                    labels: [
                        'Social Media', 'Old Student', 'Website', 'Referrel', 'Cold Call', 'Email Campaign', 'Online Store'
                    ],
                    grid: {
                        show: true,
                        strokeDashArray: 5,
                        borderColor: "#e0e0e0"
                    },
                    legend: {
                        show: false,
                        offsetY: 0,
                        fontSize: "14px",
                        labels: {
                            colors: '#919aa3'
                        },
                        itemMargin: {
                            horizontal: 0,
                            vertical: 5
                        }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#basic_polar_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}