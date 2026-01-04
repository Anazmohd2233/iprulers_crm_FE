import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class MultipleRadialbarChartService {

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
                    series: [44, 55, 67, 83],
                    chart: {
                        height: 325,
                        type: "radialBar"
                    },
                    plotOptions: {
                        radialBar: {
                            dataLabels: {
                                name: {
                                    fontSize: "22px"
                                },
                                value: {
                                    fontSize: "16px"
                                },
                                total: {
                                    show: true,
                                    label: "Total",
                                    formatter: function(w:any) {
                                        return "249";
                                    }
                                }
                            }
                        }
                    },
                    labels: ["Total", "Open", "Ongoing", "Completed"],
                    colors: [
                        "#0f79f3", "#ffb264", "#e74c3c", "#00cae3"
                    ],
                     legend: {
                        show: true,
                        offsetY: 15 ,
                        offsetX: 0,
                        floating: true,
                        position: "bottom",
                        fontSize: "10px",
                        labels: {
                            colors: '#5B5B98'
                        },
                        // formatter: function(seriesName:any, opts:any) {
                        //     return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
                        // }
                    }
                };

                // Initialize and render the chart
                const chart = new ApexCharts(document.querySelector('#multiple_radialbar_chart'), options);
                chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

}