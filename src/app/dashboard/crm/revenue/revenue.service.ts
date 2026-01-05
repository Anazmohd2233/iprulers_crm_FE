// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//     providedIn: 'root'
// })
// export class RevenueService {

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
//                         {
//                             name: "Income",
//                             data: [31, 40, 28, 51, 42, 109, 100]
//                         },
//                         {
//                             name: "Expenses",
//                             data: [11, 32, 45, 32, 34, 52, 41]
//                         }
//                     ],
//                     chart: {
//                         height: 360,
//                         type: "area",
//                         toolbar: {
//                             show: false
//                         }
//                     },
//                     dataLabels: {
//                         enabled: false
//                     },
//                     stroke: {
//                         curve: "smooth"
//                     },
//                     colors: [
//                         "#796DF6", "#00CAE3"
//                     ],
//                     legend: {
//                         position: "top",
//                         fontSize: "14px",
//                         labels: {
//                             colors: "#919aa3",
//                         },
//                         itemMargin: {
//                             horizontal: 12,
//                             vertical: 0
//                         }
//                     },
//                     xaxis: {
//                         categories: [
//                             "Sun",
//                             "Mon",
//                             "Tue",
//                             "Wed",
//                             "Thu",
//                             "Fri",
//                             "Sat"
//                         ],
//                         axisBorder: {
//                             show: false,
//                             color: '#e0e0e0'
//                         },
//                         axisTicks: {
//                             show: true,
//                             color: '#e0e0e0'
//                         },
//                         labels: {
//                             style: {
//                                 colors: "#919aa3",
//                                 fontSize: "14px"
//                             }
//                         }
//                     },
//                     yaxis: {
//                         tickAmount: 5,
//                         labels: {
//                             style: {
//                                 colors: "#919aa3",
//                                 fontSize: "14px"
//                             }
//                         }
//                     },
//                     grid: {
//                         strokeDashArray: 5,
//                         borderColor: "#e0e0e0"
//                     },
//                     fill: {
//                         gradient: {
//                             opacityFrom: 0,
//                             opacityTo: 0.4,
//                         }
//                     },
//                     tooltip: {
//                         y: {
//                             formatter: function(val:any) {
//                                 return "$" + val;
//                             }
//                         }
//                     }
//                 };

//                 // Initialize and render the chart
//                 const chart = new ApexCharts(document.querySelector('#ecommerce_revenue_chart'), options);
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
export class RevenueService {

  private isBrowser: boolean;
  private chart: any;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async loadChart(data: any): Promise<void> {
    if (!this.isBrowser) return;

    // 🔒 Guard
    if (!data?.weekly) {
      console.warn('RevenueService: weekly data missing', data);
      return;
    }

    try {
      const ApexCharts = (await import('apexcharts')).default;

      const days = Object.keys(data.weekly);
      const targetAmount = days.map(
        day => data.weekly[day]?.target_amount ?? 0
      );
      const collectedAmount = days.map(
        day => data.weekly[day]?.collected_amount ?? 0
      );

      const options = {
        series: [
          {
            name: 'Target Amount',
            data: targetAmount
          },
          {
            name: 'Collected Amount',
            data: collectedAmount
          }
        ],
        chart: {
          height: 360,
          type: 'area',
          toolbar: { show: false }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        colors: ['#796DF6', '#00CAE3'],
        legend: {
          position: 'top',
          fontSize: '14px',
          labels: {
            colors: '#919aa3'
          },
          itemMargin: {
            horizontal: 12
          }
        },
        xaxis: {
          categories: days.map(d => d.substring(0, 3)), // Mon, Tue...
          axisBorder: { show: false },
          axisTicks: { show: true },
          labels: {
            style: {
              colors: '#919aa3',
              fontSize: '14px'
            }
          }
        },
        yaxis: {
          tickAmount: 5,
          labels: {
            formatter: (val: number) => `₹${val}`,
            style: {
              colors: '#919aa3',
              fontSize: '14px'
            }
          }
        },
        grid: {
          strokeDashArray: 5,
          borderColor: '#e0e0e0'
        },
        fill: {
          gradient: {
            opacityFrom: 0.1,
            opacityTo: 0.4
          }
        },
        tooltip: {
          y: {
            formatter: (val: number) => `₹${val}`
          }
        }
      };

      // Destroy old chart if exists
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new ApexCharts(
        document.querySelector('#ecommerce_revenue_chart'),
        options
      );

      this.chart.render();

    } catch (error) {
      console.error('Revenue chart error:', error);
    }
  }
}
