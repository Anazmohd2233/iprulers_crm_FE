// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//     providedIn: 'root'
// })
// export class PieDonutChartService {

//     private isBrowser: boolean;

//     constructor(@Inject(PLATFORM_ID) private platformId: any) {
//         this.isBrowser = isPlatformBrowser(this.platformId);
//     }

//     async loadChart(data: any): Promise<void> {
//         if (this.isBrowser) {
//             try {
//                 // Dynamically import ApexCharts
//                 const ApexCharts = (await import('apexcharts')).default;

//                 // Define chart options
//                 const options = {
//                     // series: [44, 55, 13, 43, 22, 30, 10],
//                     series: 
//                         Object.values(data)
//                     ,
//                     chart: {
//                         height: 328,
//                         type: "donut"
//                     },
//                     // labels: ['Social Media', 'Old Student', 'Website', 'Referrel', 'Cold Call', 'Email Campaign', 'Online Store'],
//                     labels: 
//                         Object.keys(data)
//                     ,
//                     legend: {
//                         offsetY: 0,
//                         fontSize: "14px",
//                         position: "bottom",
//                         horizontalAlign: "center",
//                         labels: {
//                             colors: "#919aa3",
//                         },
//                         itemMargin: {
//                             horizontal: 12,
//                             vertical: 12
//                         }
//                     },
//                     dataLabels: {
//                         enabled: true,
//                         style: {
//                             fontSize: '14px'
//                         },
//                         dropShadow: {
//                             enabled: false
//                         }
//                     },
//                     stroke: {
//                         width: 0,
//                         show: true
//                     },
//                     // colors: [
//                     //     "#0f79f3", "#796df6", "#e74c3c", "#00cae3", "#ffb264"
//                     // ],
//                     tooltip: {
//                         y: {
//                             formatter: function(val:any) {
//                                 return val + "%";
//                             }
//                         }
//                     }
//                 };

//                 // Initialize and render the chart
//                 const chart = new ApexCharts(document.querySelector('#pie_donut_chart'), options);
//                 chart.render();
//             } catch (error) {
//                 console.error('Error loading ApexCharts:', error);
//             }
//         }
//     }

//     // private isBrowser: boolean;

//     // constructor(@Inject(PLATFORM_ID) private platformId: any) {
//     //     this.isBrowser = isPlatformBrowser(this.platformId);
//     // }

//     // async loadChart(): Promise<void> {
//     //     if (this.isBrowser) {
//     //         try {
//     //             // Dynamically import ApexCharts
//     //             const ApexCharts = (await import('apexcharts')).default;

//     //             // Define chart options
//     //             const options = {
//     //                 series: [44, 55, 13, 43, 22],
//     //                 chart: {
//     //                     type: "donut"
//     //                 },
//     //                 labels: ["Facebook", "Instagram", "Referral", "Website", "Direct Enquiry"],
//     //                 responsive: [
//     //                     {
//     //                         breakpoint: 480,
//     //                         options: {
//     //                             chart: {
//     //                                 width: 200
//     //                             },
//     //                             legend: {
//     //                                 position: "bottom"
//     //                             }
//     //                         }
//     //                     }
//     //                 ],
//     //                 legend: {
//     //                     offsetY: 0,
//     //                     fontSize: "14px",
//     //                     labels: {
//     //                         colors: '#919aa3'
//     //                     },
//     //                     itemMargin: {
//     //                         horizontal: 0,
//     //                         vertical: 5
//     //                     }
//     //                 },
//     //                 stroke: {
//     //                     width: 0,
//     //                     show: true
//     //                 },
//     //                 colors: [
//     //                     // "#0f79f3", "#796df6", "#e74c3c", "#00cae3", "#ffb264"
//     //                 ],
//     //                 dataLabels: {
//     //                     enabled: true,
//     //                     style: {
//     //                         fontSize: '14px',
//     //                     },
//     //                     dropShadow: {
//     //                         enabled: false
//     //                     }
//     //                 },
//     //                 tooltip: {
//     //                     y: {
//     //                         formatter: function(val:any) {
//     //                             return val + "%";
//     //                         }
//     //                     }
//     //                 }
//     //             };

//     //             // Initialize and render the chart
//     //             const chart = new ApexCharts(document.querySelector('#pie_donut_chart'), options);
//     //             chart.render();
//     //         } catch (error) {
//     //             console.error('Error loading ApexCharts:', error);
//     //         }
//     //     }
//     // }

// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PieDonutChartService {

  private isBrowser: boolean;
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

 async loadChart(data: any): Promise<void> {
  if (!this.isBrowser) return;

  if (!data || typeof data !== 'object') {
    console.warn('PieDonutChartService: invalid data', data);
    return;
  }

  try {
    const ApexCharts = (await import('apexcharts')).default;

    const labels = Object.keys(data).map(key =>
      key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    );

    const series = Object.values(data) as number[];

    // Extra safety
    if (!labels.length || !series.length) {
      console.warn('PieDonutChartService: empty chart data');
      return;
    }

    const options = {
      series,
      chart: {
        height: 328,
        type: 'donut'
      },
      labels,

      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${Math.round(val)}%`
      },

      tooltip: {
        y: {
          formatter: (_: number, opts: any) => {
            const value = opts.w.globals.series[opts.seriesIndex];
            const percent = opts.w.globals.seriesPercent[opts.seriesIndex];
            return `${value} (${percent.toFixed(1)}%)`;
          }
        }
      },

      legend: {
        position: 'bottom',
        formatter: (seriesName: string, opts: any) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}`;
        }
      },

      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: (w: any) =>
                  w.globals.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  )
              }
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new ApexCharts(
      document.querySelector('#pie_donut_chart'),
      options
    );

    this.chart.render();

  } catch (error) {
    console.error('Error loading ApexCharts:', error);
  }
}

}
