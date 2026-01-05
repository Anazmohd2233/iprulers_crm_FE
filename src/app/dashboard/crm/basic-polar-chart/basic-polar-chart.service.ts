// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//     providedIn: 'root'
// })
// export class BasicPolarChartService {

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
//                     series: [
//                         14, 23, 21, 17, 15, 10, 12
//                     ],
//                     chart: {
//                         height: 325,
//                         type: "polarArea"
//                     },
//                     stroke: {
//                         colors: ["#ffffff"]
//                     },
//                     fill: {
//                         opacity: 0.8
//                     },
//                     responsive: [
//                         {
//                             breakpoint: 480,
//                             options: {
//                                 chart: {
//                                     width: 325
//                                 },
//                                 legend: {
//                                     position: "bottom"
//                                 }
//                             }
//                         }
//                     ],
//                     labels: [
//                         'Social Media', 'Old Student', 'Website', 'Referrel', 'Cold Call', 'Email Campaign', 'Online Store'
//                     ],
//                     grid: {
//                         show: true,
//                         strokeDashArray: 5,
//                         borderColor: "#e0e0e0"
//                     },
//                     legend: {
//                         show: false,
//                         offsetY: 0,
//                         fontSize: "14px",
//                         labels: {
//                             colors: '#919aa3'
//                         },
//                         itemMargin: {
//                             horizontal: 0,
//                             vertical: 5
//                         }
//                     }
//                 };

//                 // Initialize and render the chart
//                 const chart = new ApexCharts(document.querySelector('#basic_polar_chart'), options);
//                 chart.render();
//             } catch (error) {
//                 console.error('Error loading ApexCharts:', error);
//             }
//         }
//     }

// }

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BasicPolarChartService {

  private isBrowser: boolean;
  private chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async loadChart(data: any): Promise<void> {
    if (!this.isBrowser) return;

    // 🔒 Guard – VERY IMPORTANT
    if (!data || typeof data !== 'object') {
      console.warn('BasicPolarChartService: invalid data', data);
      return;
    }

    try {
      const ApexCharts = (await import('apexcharts')).default;

      // Convert API response → labels & series
      const labels = Object.keys(data).map(key =>
        key === 'UNKNOWN'
          ? 'Unknown'
          : key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      );

      const series = Object.values(data) as number[];

      if (!labels.length || !series.length) return;

      const options = {
        series,
        chart: {
          height: 325,
          type: 'polarArea'
        },

        labels,

        stroke: {
          colors: ['#ffffff']
        },

        fill: {
          opacity: 0.85
        },

        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: '#e0e0e0'
        },

        tooltip: {
          y: {
            formatter: (val: number) => val.toString() // show actual value
          }
        },

        legend: {
          position: 'bottom',
          fontSize: '14px',
          labels: {
            colors: '#919aa3'
          },
          formatter: (seriesName: string, opts: any) => {
            const value = opts.w.globals.series[opts.seriesIndex];
            return `${seriesName}: ${value}`;
          },
          itemMargin: {
            horizontal: 12,
            vertical: 8
          }
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 325
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      };

      // Destroy previous chart (important for updates)
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new ApexCharts(
        document.querySelector('#basic_polar_chart'),
        options
      );

      this.chart.render();

    } catch (error) {
      console.error('Error loading ApexCharts:', error);
    }
  }
}
