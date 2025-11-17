import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MatDialogModule,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { formatDate, NgFor, NgIf } from '@angular/common';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { PaymentsService } from '../../../services/payments.service';
import {
    MatSlideToggleChange,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpParams } from '@angular/common/http';
import { StudentService } from '../../../services/student.services';
import { CourseService } from '../../../services/course.service';

@Component({
    selector: 'app-invoices',
    standalone: true,
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatDialogModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        FormsModule,
        NgIf,
        NgFor,
        MatSlideToggleModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
    templateUrl: './invoices.component.html',
    styleUrl: './invoices.component.scss',
})
export class InvoicesComponent {
    // Student Form

    @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
    @ViewChild('confirmDialogEdit') confirmDialogEdit!: TemplateRef<any>;
    @ViewChild('confirmDialogBox') confirmDialogBox!: TemplateRef<any>;

    private toggleEvent: any;
    private toggleId!: number;

    dialogRef!: MatDialogRef<any>;

    isSubmitting = false;
    isLoading = false;
    studentId: any;
    editMode: boolean = false;
    paymentForm!: FormGroup;
    editPaymentForm!: FormGroup;

    courses: any;
    page: number = 1;
    pageSize: number = 20;
    totalRecords: number = 0;
    paymentStatus: boolean = false;
    student: any;
    expandedElement: any | null = null;

    filterStatusValue: any;
    filterDueDateValue: any;
    createdDateFilter: Date | null = null;
    dueDateFilter: Date | null = null;

    filterCouseValue: any;
    filterStudentValue: any;
    searchFieldStudent: string = '';

    searchFieldCourse: string = '';

    ELEMENT_DATA: PeriodicElement[] = [];
    displayedColumns: string[] = [
        'student_name',
        'course_name',
        'payment_type',
        'installment_amount',
        'paid_amount',
        'balance',
        'due_date',
        'is_paid',
        'approve',
        'action',
    ];
    dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @ViewChild('installmentDialog') installmentDialog!: TemplateRef<any>;

    selectedPayment: any;
    installmentCount: number = 2;
    installments: { amount: number; date: string }[] = [];
    courseFee: number = 0;
    balanceAmount: number = 0;
    students: any;
    course: any;

    constructor(
        public themeService: CustomizerSettingsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private paymentsService: PaymentsService,
        private formBuilder: FormBuilder,
        private studentService: StudentService,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        // Check if user is authenticated
        this.getPaymentList();
          this.getCourseList();
        this.getStudentList();
        this.initializePyamentForm();
    }

    initializePyamentForm() {
        this.paymentForm = this.formBuilder.group({
            payment_date: ['', Validators.required],
            mode_of_payment: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(1)]],
        });

        this.editPaymentForm = this.formBuilder.group({
            change_amount: [''],
            change_due_date: [''],
        });
    }

    ngAfterViewInit() {
        // listen to paginator changes
        console.log('**********page changed**********');
        this.paginator.page.subscribe((event) => {
            this.page = event.pageIndex + 1; // MatPaginator is 0-based, API is 1-based
            this.pageSize = event.pageSize;
            this.getPaymentList();
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openInstallmentDialog(element: any): void {
        this.selectedPayment = element;
        this.courseFee = parseFloat(element.courseFee.replace(/[$,]/g, ''));
        this.installmentCount = 2;
        this.installments = [];
        this.dialog.open(this.installmentDialog, {
            width: '90vw',
            maxWidth: '900px',
        });
    }

    generateInstallments(): void {
        const baseAmount = +(this.courseFee / this.installmentCount).toFixed(2);
        const today = new Date();
        this.installments = [];

        for (let i = 0; i < this.installmentCount; i++) {
            const installmentDate = new Date(today);
            installmentDate.setMonth(today.getMonth() + i + 1);
            const formattedDate = installmentDate.toISOString().split('T')[0];

            this.installments.push({
                amount: baseAmount,
                date: formattedDate,
            });
        }

        // Fix last installment for rounding difference
        const totalAssigned = baseAmount * this.installmentCount;
        const diff = +(this.courseFee - totalAssigned).toFixed(2);
        if (diff !== 0) {
            this.installments[this.installmentCount - 1].amount += diff;
        }
    }

    onAmountChange(index: number): void {
        // Calculate sum of all previous installments
        const sumBefore = this.installments
            .slice(0, index)
            .reduce((sum, inst) => sum + inst.amount, 0);

        // Calculate max allowed for this installment
        let maxAllowed = this.courseFee - sumBefore;

        // Prevent negative
        if (this.installments[index].amount < 0) {
            this.installments[index].amount = 0;
        }

        // Restrict to max allowed
        if (this.installments[index].amount > maxAllowed) {
            this.installments[index].amount = maxAllowed;
        }

        // Recalculate sum so far including this installment
        const totalSoFar = sumBefore + this.installments[index].amount;

        // If current installment filled the entire course fee
        if (totalSoFar >= this.courseFee) {
            // Remove remaining installments
            this.installments = this.installments.slice(0, index + 1);
            this.installmentCount = this.installments.length;
        }
    }

    updateAllDates(event: Event): void {
        const newDate = (event.target as HTMLInputElement).value;
        this.installments.forEach((inst) => (inst.date = newDate));
    }

    saveInstallments() {
        console.log('Installments saved:', this.installments);
        this.dialog.closeAll();
    }

    closeModal(): void {
        this.dialog.closeAll();
    }

    clearInstallments(): void {
        this.installments = [];
        this.installmentCount = 1;
    }

    private getPaymentList(): void {
        let params = new HttpParams();

        if (this.filterCouseValue)
            params = params.set('course', this.filterCouseValue);

        if (this.filterDueDateValue)
            params = params.set('dueDate', this.filterDueDateValue);

        if (this.filterStudentValue)
            params = params.set('student', this.filterStudentValue);

        if (this.filterStatusValue)
            params = params.set('status', this.filterStatusValue);

        this.paymentsService.getPayment(this.page, params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    const payments = response.data?.payment || [];
                    this.paymentStatus = payments.is_paid;
                    this.totalRecords = response.data?.total;

                    this.ELEMENT_DATA = payments.map((u: any) => ({
                        id: u.id,
                        student_id: u.student.id,
                        student_name: u.student.firstName || 'N/A',
                        course_name: u?.course?.service_name || 'N/A',

                        payment_type: u.payment_type || 'N/A',
                        installment_amount: u.installment_amount || 0,
                        balance: u.balance_amount || 0,
                        paid_amount: u.paid_amount || 0,
                        due_date: u.due_date || 'N/A',
                        history: u?.history || [],
                        is_paid: u.is_paid,
                        approve: '',
                        action: '',
                    }));

                    this.dataSource.data = this.ELEMENT_DATA;
                } else {
                    // this.toastr.error('Failed to load Contact', 'Failed');
                    console.error('Failed to load Payment:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    onToggle(event: any, id: number) {
        this.toggleEvent = event;
        this.toggleId = id;

        this.dialog.open(this.confirmDialog, {
            width: '350px',
            // data: { isChecked: event.checked },
        });
    }

    openConfirmDialog(id: any) {
        this.dialogRef = this.dialog.open(this.confirmDialog, {
            width: '800',
            data: { id: id },
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    onCancel(): void {
        this.paymentForm.reset();
        this.editPaymentForm.reset();
        this.dialogRef.close(false); // close dialog
    }

    // confirmAction() {
    //     const isChecked = this.toggleEvent.checked;
    //     console.log('Confirmed for id:', this.toggleId, '->', isChecked);

    //     if (isChecked) {
    //         this.updatePayment('true');
    //     } else {
    //         this.updatePayment('false');
    //     }

    //     this.dialog.closeAll();
    // }

    cancelAction() {
        this.toggleEvent.source.checked = !this.toggleEvent.checked;
        this.dialog.closeAll();
    }

    onSubmitPayment(id: any) {
        if (this.paymentForm.valid) {
            const formData = new FormData();
            Object.keys(this.paymentForm.controls).forEach((key) => {
                formData.append(key, this.paymentForm.get(key)?.value);
            });

            this.paymentsService.updatePayment(formData, id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.paymentForm.reset();

                        this.isSubmitting = false;
                        this.toastr.success(
                            'Payment Updated successfully',
                            'Success'
                        );
                        this.getPaymentList();

                        this.dialog.closeAll();
                    } else {
                        this.isSubmitting = false;

                        this.toastr.error(
                            response.message || 'Failed to Update Payment.',
                            'Error'
                        );
                        console.error('❌ add failed:', response.message);
                    }
                },
                error: (error) => {
                    this.isSubmitting = false;

                    const errMsg =
                        error?.error?.message || 'Something went wrong.';

                    this.toastr.error(errMsg, 'Error');

                    console.error('❌ API error:', error);
                },
            });
        } else {
            this.toastr.error('Please fill all required fields.', 'Error');
        }
    }

    toggleExpand(element: any) {
        this.expandedElement =
            this.expandedElement === element ? null : element;
    }

    onEditInstallment(element: any) {
        console.log('Editing installment:', element);
        this.dialogRef = this.dialog.open(this.confirmDialogEdit, {
            width: '800',
            data: { id: element.id },
        });
    }

    openConfirmBox(id: any, type: any) {
        console.log('delete history:', id);
        this.dialogRef = this.dialog.open(this.confirmDialogBox, {
            width: '800',
            data: { id: id, type: type },
        });
    }

    confirmDelete(id: any, type: any) {
        console.log('delete id:', id);

        if (type === 'HISTORY') {
            this.paymentsService.deleteHistory(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.isSubmitting = false;
                        this.toastr.success(
                            'History deleted successfully',
                            'Success'
                        );
                        this.getPaymentList();

                        this.dialog.closeAll();
                    } else {
                        this.isSubmitting = false;

                        this.toastr.error(
                            response.message || 'Failed to Delete history.',
                            'Error'
                        );
                        console.error('❌ delete failed:', response.message);
                    }
                },
                error: (error) => {
                    this.isSubmitting = false;

                    const errMsg =
                        error?.error?.message || 'Something went wrong.';

                    this.toastr.error(errMsg, 'Error');

                    console.error('❌ API error:', error);
                },
            });
        } else if (type === 'PAYMENT') {
            this.paymentsService.deletePayment(id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.isSubmitting = false;
                        this.toastr.success(
                            'Payment deleted successfully',
                            'Success'
                        );
                        this.getPaymentList();

                        this.dialog.closeAll();
                    } else {
                        this.isSubmitting = false;

                        this.toastr.error(response.message, 'Error');
                        console.error('❌ delete failed:', response.message);
                    }
                },
                error: (error) => {
                    this.isSubmitting = false;

                    const errMsg =
                        error?.error?.message || 'Something went wrong.';

                    this.toastr.error(errMsg, 'Error');

                    console.error('❌ API error:', error);
                },
            });
        }
    }

    onSubmitEditPayment(id: any) {
        if (this.editPaymentForm.valid) {
            const formData = new FormData();
            Object.keys(this.editPaymentForm.controls).forEach((key) => {
                formData.append(key, this.editPaymentForm.get(key)?.value);
            });

            this.paymentsService.updatePayment(formData, id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.editPaymentForm.reset();

                        this.isSubmitting = false;
                        this.toastr.success(
                            'Payment Updated successfully',
                            'Success'
                        );
                        this.getPaymentList();

                        this.dialog.closeAll();
                    } else {
                        this.isSubmitting = false;

                        this.toastr.error(
                            response.message || 'Failed to Update Payment.',
                            'Error'
                        );
                        console.error('❌ add failed:', response.message);
                    }
                },
                error: (error) => {
                    this.isSubmitting = false;

                    const errMsg =
                        error?.error?.message || 'Something went wrong.';

                    this.toastr.error(errMsg, 'Error');

                    console.error('❌ API error:', error);
                },
            });
        } else {
            this.toastr.error('Please fill all required fields.', 'Error');
        }
    }

    filterStatus(event: any) {
        this.filterStatusValue = event.value;
        this.getPaymentList();
    }

    resetFilters() {
        this.createdDateFilter = null;
        this.dueDateFilter = null;

        this.filterDueDateValue = null;

        this.getPaymentList();
    }

    filterCourse(event: any) {
        this.filterCouseValue = event.value;
        this.getPaymentList();
    }

    filterStudent(event: any) {
        this.filterStudentValue = event.value;
        this.getPaymentList();
    }

    searchStudent() {
        console.log('student search keyword', this.searchFieldStudent);
        this.getStudentList(this.searchFieldStudent);
    }
    clearSearchStudent() {
        this.searchFieldStudent = ''; // Clear the input by setting the property to an empty string
         this.getStudentList();
        this.getPaymentList();
       
    }

    searchCourse() {
        console.log('course search keyword', this.searchFieldCourse);
        this.getCourseList(this.searchFieldCourse);
    }
    clearSearchCourse() {
        this.searchFieldCourse = ''; // Clear the input by setting the property to an empty string
                this.getCourseList();

        this.getPaymentList();
    }

    private getStudentList(search?: any): void {
        let params = new HttpParams();

        if (search) {
            params = params.set('search', search);
        }

        this.studentService.getStudent(this.page, params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.students = response.data?.customer || [];
                } else {
                    // this.toastr.error('Failed to load users', 'Failed');
                    console.error('Failed to load student:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    private getCourseList(search?: any): void {
        let params = new HttpParams();

        if (search) {
            params = params.set('search', search);
        }
        this.courseService.getCourse(this.page, params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.course = response.data?.services || [];
                } else {
                    // this.toastr.error('Failed to load Contact', 'Failed');
                    console.error('Failed to load courses:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

       filterDueDate(event: any) {
        if (event.value) {
            this.filterDueDateValue = formatDate(
                event.value,
                'yyyy-MM-dd',
                'en-US'
            );
        this.getPaymentList();
        }
    }
}

export interface PeriodicElement {
    student_name: any;
    course_name: any;
    payment_type: any;
    installment_amount: any;

    balance: any;

    paid_amount: any;

    due_date: any;
    is_paid: any;
    approve: any;
    history: any;
    action: any;
}
