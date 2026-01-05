import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CustomAngleCircleRadialbarChartService {

    private isBrowser: boolean;
    private chart: any;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    async loadChart(data: any): Promise<void> {
        if (this.isBrowser) {
            try {
                // Dynamically import ApexCharts
                const ApexCharts = (await import('apexcharts')).default;

                // Define chart options
                const options = {
                    // series: [100, 90, 80],
                    series: [
                        data?.contacts ?? 0,
                        data?.leads ?? 0,
                        data?.customer ?? 0
                    ],
                    chart: {
                        height: 325,
                        type: "radialBar"
                    },
                    plotOptions: {
                        radialBar: {
                            offsetY: 0,
                            startAngle: 0,
                            endAngle: 270,
                            hollow: {
                                margin: 10,
                                size: "30%",
                                image: undefined,
                                background: "transparent"
                            },
                            dataLabels: {
                                name: {
                                    show: false
                                },
                                value: {
                                    show: false,
                                                                        formatter: (val: number) => val.toString() // NO %

                                }
                            }
                        }
                    },
                    colors: [
                        "#757FEF", "#9EA5F4",  "#C8CCF9" //"#F1F2FD",
                    ],
                    labels: [
                        "Contact", "Lead", "Student"
                    ],
                    legend: {
                        show: true,
                        offsetY: 0,
                        offsetX: -20,
                        floating: true,
                        position: "left",
                        fontSize: "14px",
                        labels: {
                            colors: '#5B5B98'
                        },
                        formatter: function(seriesName:any, opts:any) {
                            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
                        }
                    }
                };

                // Initialize and render the chart
                // const chart = new ApexCharts(document.querySelector('#custom_angle_circle_radialbar_chart'), options);
                // chart.render();
                this.chart = new ApexCharts(document.querySelector('#custom_angle_circle_radialbar_chart'), options);
                this.chart.render();
            } catch (error) {
                console.error('Error loading ApexCharts:', error);
            }
        }
    }

    updateSeries(series: number[]): void {
        if (this.chart) {
        this.chart.updateSeries(series);
        }
    }

    updateFromObject(data: any): void {
        if (!this.chart) return;

        this.chart.updateSeries([
            data?.contacts ?? 0,
            data?.leads ?? 0,
            data?.customer ?? 0
        ]);
    }

}