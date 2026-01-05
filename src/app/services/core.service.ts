import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private selectedMonthSubject = new BehaviorSubject<string>(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  selectedMonth$ = this.selectedMonthSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  private activeRequests = 0;

  setSelectedMonth(month: string): void {
    this.selectedMonthSubject.next(month);
  }
  
  getCurrentMonth(): string {
    return this.selectedMonthSubject.value;
  }

  showLoader() {
    this.activeRequests++;
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.loadingSubject.next(false);
    }
  }
}
