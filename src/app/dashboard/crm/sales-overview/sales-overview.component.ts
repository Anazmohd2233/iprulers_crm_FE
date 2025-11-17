import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
    selector: 'app-sales-overview',
    imports: [
        MatCardModule,
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './sales-overview.component.html',
    styleUrl: './sales-overview.component.scss',
})
export class SalesOverviewComponent implements OnInit {
    dateForm!: FormGroup;
    @Input() data: any;
    @Output() dateRangeChange = new EventEmitter<{
        start: string;
        end: string;
    }>();

    filterCreatedDateValue: any;
    filterDueDateValue: any;

    createdDateFilter: Date | null = null;
    dueDateFilter: Date | null = null;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        this.dateForm = this.fb.group({
            start: [firstDay],
            end: [lastDay],
        });

      
      
    }

    total_amount: any;
    total_balance: any;
    total_paid: any;
    payment_progress: number = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data) {
            console.log('data received:', this.data);

            this.total_amount = this.data?.payments?.total_amount;
            this.total_paid = this.data?.payments?.total_paid;
            this.total_balance = this.data?.payments?.total_balance;
            this.payment_progress = this.data?.payments?.payment_progress;
        }
    }
    filterCreatedDate(event: any) {
        if (event.value) {
            this.filterCreatedDateValue = formatDate(
                event.value,
                'yyyy-MM-dd',
                'en-US'
            );
        }
         this.dateRangeChange.emit({
                start: this.filterCreatedDateValue ,
                end: this.filterDueDateValue,
            });
    }

    filterDueDate(event: any) {
        if (event.value) {
            this.filterDueDateValue = formatDate(
                event.value,
                'yyyy-MM-dd',
                'en-US'
            );
        }
         this.dateRangeChange.emit({
                start: this.filterCreatedDateValue ,
                end: this.filterDueDateValue,
            });
    }
}
