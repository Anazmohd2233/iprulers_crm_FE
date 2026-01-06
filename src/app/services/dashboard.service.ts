import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private apiUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}


    getDashboardSummary( params?: HttpParams): Observable<any> {
        const url = `${this.apiUrl}/admin/dashboard/view`;
        return this.http.get<any>(url, { params });
    }

     

     getDashboardReport(page: number, params?: HttpParams): Observable<any> {
        const url = `${this.apiUrl}/admin/dashboard/report/${page}`;
        return this.http.get<any>(url, { params });
    }

    getDashboardDetails(month?: string): Observable<any> {
        let params = new HttpParams();
        if (month) {
             params = params.set('month', String(month));
        }
        return this.http.get<any>(`${this.apiUrl}/admin/dashboard/details`, {params})
    }

    getDashboardPayment(year?: string | number): Observable<any> {
        let params = new HttpParams();
        if (year) {
             params = params.set('year', String(year));
        }
        return this.http.get<any>(`${this.apiUrl}/admin/dashboard/payments`, {params})
    }

}
