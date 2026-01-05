import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MultipleRadialbarChartService {

  private isBrowser: boolean;
  private chart: any;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async loadChart(data: any = {open: 0,ongoing: 0,completed:0}): Promise<void> {
    if (!this.isBrowser) return;

    // 🔒 Guard
    if (!data) {
      console.warn('MultipleRadialbarChartService: invalid data', data);
      return;
    }

    try {
      const ApexCharts = (await import('apexcharts')).default;

      const series = [
        data.open ?? 0,
        data.ongoing ?? 0,
        data.completed ?? 0
      ];

      const options = {
        series,
        chart: {
          height: 325,
          type: 'radialBar'
        },

        labels: ['Open', 'Ongoing', 'Completed'],

        colors: ['#0f79f3', '#ffb264', '#e74c3c'],

        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px'
              },
              value: {
                fontSize: '16px',
                formatter: (_val: number, opts: any) => {
                  const actual = opts.w.globals?.series[opts.seriesIndex];
                  const percent = opts.w.globals?.seriesPercent[opts.seriesIndex];
                  return `${actual} (${percent.toFixed(1)}%)`;
                }
              },
              total: {
                show: true,
                label: 'Total',
                formatter: (w: any) =>
                  w.globals?.seriesTotals.reduce(
                    (a: number, b: number) => a + b,
                    0
                  )
              }
            }
          }
        },

        tooltip: {
          y: {
            formatter: (_val: number, opts: any) => {
              const actual = opts.w.globals?.series[opts.seriesIndex];
              const percent = opts.w.globals?.seriesPercent[opts.seriesIndex];
              return `${actual} (${percent.toFixed(1)}%)`;
            }
          }
        },

        legend: {
          show: true,
          floating: true,
          position: 'bottom',
          fontSize: '12px',
          labels: {
            colors: '#5B5B98'
          },
          formatter: (name: string, opts: any) =>
            `${name}: ${opts.w.globals?.series[opts.seriesIndex]}`
        }
      };

      const el = document.querySelector('#multiple_radialbar_chart');
      if (!el) {
        console.warn('MultipleRadialbarChartService: container not found');
        return;
      }

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new ApexCharts(el, options);
      this.chart.render();

    } catch (error) {
      console.error('MultipleRadialbarChartService error:', error);
    }
  }

  updateFromObject(data: any): void {
    if (!this.chart) return;

    this.chart.updateSeries([
      data.open ?? 0,
      data.ongoing ?? 0,
      data.completed ?? 0
    ]);
  }
}
