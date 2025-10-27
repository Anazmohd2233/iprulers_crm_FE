import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    PLATFORM_ID,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {
    Router,
    ActivatedRoute,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
} from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { StudentService } from '../../../services/student.services';
import { ToastrService } from 'ngx-toastr';
import { RecentActivityComponent } from '../../../pages/profile-page/user-profile/recent-activity/recent-activity.component';
import { AllProjectsComponent } from '../../../pages/profile-page/user-profile/all-projects/all-projects.component';
import { PaymentsService } from '../../../services/payments.service';
import { CourseService } from '../../../services/course.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogModule,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-profile02-student',
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FileUploadModule,
        NgxEditorModule,
        CommonModule,
        RouterLinkActive,
        RouterOutlet,
        AllProjectsComponent,
        RecentActivityComponent,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        NgIf,
        MatTooltipModule,
        MatDialogModule,
        MatSlideToggleModule,
    ],

    templateUrl: './profile-student.component.html',
    styleUrls: ['./profile-student.component.scss'],
})
export class ProfileStudentComponent implements OnInit {
    // Text Editor
    editor!: Editor;
    editorContent: string = '';
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    // File Uploader
    public multiple: boolean = false;

    // Student Form
    isSubmitting = false;
    isLoading = false;
    studentId: any;
    editMode: boolean = false;
    paymentForm!: FormGroup;
    paymentSubmitForm!: FormGroup;
    expandedElement: any | null = null;
    pdfHead: boolean = false;
    editPaymentForm!: FormGroup;
    courses: any;
    page: number = 1;
    pageSize: number = 20;
    totalRecords: number = 0;
    paymentStatus: boolean = false;
    student: any;

    ELEMENT_DATA: PeriodicElement[] = [];
    isModalOpen: boolean = false;
    dialogRef!: MatDialogRef<any>; // store reference

    @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
    @ViewChild('confirmDialogEdit') confirmDialogEdit!: TemplateRef<any>;

    private toggleEvent: any;
    private toggleId!: number;

    animal: string = '';

    displayedColumns: string[] = [
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
    @ViewChild('taskDialog') taskDialog!: TemplateRef<any>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @ViewChild('installmentDialog') installmentDialog!: TemplateRef<any>;

    @ViewChild('confirmDialogBox') confirmDialogBox!: TemplateRef<any>;

    // Options for dropdowns
    leadSources = [
        'Website',
        'Social Media',
        'Referral',
        'Advertisement',
        'Other',
    ];
    courseOptions = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'UI/UX Design',
        'Digital Marketing',
    ];
    statuses = ['Active', 'Inactive', 'Pending', 'Completed'];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private studentService: StudentService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private paymentsService: PaymentsService,
        private courseService: CourseService,
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // Check if user is authenticated
        this.getCourseList();

        if (isPlatformBrowser(this.platformId)) {
            this.editor = new Editor();
        }

        // Get student ID from route parameters
        // ✅ Get ID from query params
        this.route.queryParams.subscribe((params) => {
            this.studentId = params['student_id'] || null;

            console.log('📌 Received student ID:', this.studentId);

            if (this.studentId) {
                this.editMode = true;
                this.loadStudentData();
            }
        });
        this.initializeForm();
    }

    ngAfterViewInit() {
        // listen to paginator changes
        console.log('**********page changed**********');
        this.paginator.page.subscribe((event) => {
            this.page = event.pageIndex + 1; // MatPaginator is 0-based, API is 1-based
            this.pageSize = event.pageSize;
            this.loadStudentData();
        });
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId) && this.editor) {
            this.editor.destroy();
        }
    }

    private initializeForm(): void {
        this.paymentForm = this.fb.group({
            course_id: ['', Validators.required],
            payment_type: ['', Validators.required],
            emi_months: [''],
            discount: [''],
            advance: [''],

            start_date: ['', Validators.required],
        });

        this.paymentSubmitForm = this.fb.group({
            payment_date: ['', Validators.required],
            mode_of_payment: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(1)]],
        });

        this.editPaymentForm = this.fb.group({
            change_amount: [''],
            change_due_date: [''],
        });

        // Optional: reset emi_months if payment_type is FULL
    }

    onSubmitPaymentConfirmation(id: any) {
        if (this.paymentSubmitForm.valid) {
            const formData = new FormData();
            Object.keys(this.paymentSubmitForm.controls).forEach((key) => {
                formData.append(key, this.paymentSubmitForm.get(key)?.value);
            });

            this.paymentsService.updatePayment(formData, id).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.paymentSubmitForm.reset();

                        this.isSubmitting = false;
                        this.toastr.success(
                            'Payment Updated successfully',
                            'Success'
                        );
                        this.loadStudentData();

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

    onCancel(): void {
        this.paymentSubmitForm.reset(); // clear the form
        this.dialogRef.close(false); // close dialog
        this.editPaymentForm.reset();
    }

    toggleExpand(element: any) {
        this.expandedElement =
            this.expandedElement === element ? null : element;
    }

    private loadStudentData(): void {
        if (!this.studentId) return;

        this.isLoading = true;
        this.studentService.getStudentById(this.studentId).subscribe({
            next: (response) => {
                if (response && response.success) {
                    const studentData = response.customer;
                    this.student = response.customer;

                    this.editorContent = studentData.notes || '';
                    this.isLoading = false;

                    this.ELEMENT_DATA = studentData.payments.map((u: any) => ({
                        id: u.id,
                        course_name: u.course.service_name || 'N/A',

                        payment_type: u.payment_type || 'N/A',
                        installment_amount: u.installment_amount || 0,
                        balance: u.balance_amount || 0,
                        paid_amount: u.paid_amount || 0,
                        due_date: u.due_date || 'N/A',
                        history: u?.history || [],

                        is_paid: u.is_paid,

                        action: '',
                    }));

                    this.dataSource.data = this.ELEMENT_DATA;
                } else {
                    // this.toastr.error('Failed to load student data', 'Error');
                    this.isLoading = false;
                }
            },
            error: (error) => {
                console.error('Error loading student:', error);
                // this.toastr.error('Error loading student data', 'Error');
                this.isLoading = false;
            },
        });
    }

    onSubmitPayment(): void {
        Object.keys(this.paymentForm.controls).forEach((key) => {
            console.log(key, this.paymentForm.get(key)?.value);
        });
        if (this.paymentForm.invalid) {
            console.log('********payment form not vlaid*******');

            this.paymentForm.markAllAsTouched();
            return;
        }
        this.isSubmitting = true;

        const formData = new FormData();
        Object.keys(this.paymentForm.controls).forEach((key) => {
            formData.append(key, this.paymentForm.get(key)?.value);
        });

        formData.append('student_id', this.studentId);

        this.paymentsService.createPayment(formData).subscribe({
            next: (response) => {
                if (response.success) {
                    this.loadStudentData();
                    this.isSubmitting = false;
                    this.paymentForm.reset();
                    this.toastr.success(
                        'Payment Added successfully',
                        'Success'
                    );
                    console.log('✅ Payment Added successfully');
                } else {
                    this.isSubmitting = false;

                    this.toastr.error(
                        response.message || 'Failed to Add Payment.',
                        'Error'
                    );
                    console.error('❌ add failed:', response.message);
                }
            },
            error: (error) => {
                this.isSubmitting = false;

                this.toastr.error('Something went wrong.', 'Error');

                console.error('❌ API error:', error);
            },
        });
    }
    private getCourseList(): void {
        // let params = new HttpParams();

        // params = params.set('user_type', 'USER');

        this.courseService.getCourse(this.page).subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.courses = response.data?.services || [];
                } else {
                    // this.toastr.error('Failed to load users', 'Failed');
                    console.error('Failed to load courses:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    openDialog() {
        this.dialogRef = this.dialog.open(this.taskDialog, {
            width: '85%',
            maxWidth: '100vw', // prevents overflow
        });
    }

    onToggle(event: any, id: number) {
        this.toggleEvent = event;
        this.toggleId = id;

        this.dialog.open(this.confirmDialog, {
            width: '350px',
            data: { isChecked: event.checked },
        });
    }

    confirmAction() {
        const isChecked = this.toggleEvent.checked;
        console.log('Confirmed for id:', this.toggleId, '->', isChecked);

        if (isChecked) {
            this.updatePayment('true');
        } else {
            this.updatePayment('false');
        }

        this.dialog.closeAll();
    }

    cancelAction() {
        this.toggleEvent.source.checked = !this.toggleEvent.checked;
        this.dialog.closeAll();
    }

    updatePayment(status: any) {
        const formData = new FormData();
        formData.append('is_paid', status);

        this.paymentsService.updatePayment(formData, this.toggleId).subscribe({
            next: (response) => {
                if (response.success) {
                    this.isSubmitting = false;
                    this.toastr.success(
                        'Payment Updated successfully',
                        'Success'
                    );
                    this.loadStudentData();

                    console.log('✅ Payment Updated successfully');
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

                this.toastr.error('Something went wrong.', 'Error');

                console.error('❌ API error:', error);
            },
        });
    }

    openConfirmDialog(id: any) {
        this.dialogRef = this.dialog.open(this.confirmDialog, {
            width: '800',
            data: { id: id },
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // if (title === 'Check In') {
                //     this.checkIn();
                // } else if (title === 'Check Out') {
                //     this.checkOut();
                // }
            }
        });
    }

    downloadPdf() {
        this.pdfHead = true;

        // Wait for Angular to apply *ngIf
        this.cdr.detectChanges();

        setTimeout(() => {
            const element = document.getElementById('captureSection');
            if (!element) return;

            this.isLoading = true;

            const images = Array.from(element.querySelectorAll('img'));
            const allImagesLoaded = Promise.all(
                images.map((img) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.onload = img.onerror = resolve;
                    });
                })
            );

            allImagesLoaded.then(() => {
                html2canvas(element, {
                    scrollY: -window.scrollY,
                    useCORS: true,
                    scale: 2,
                })
                    .then((canvas) => {
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight =
                            (canvas.height * pdfWidth) / canvas.width;

                        if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                            let heightLeft = pdfHeight;
                            let position = 0;

                            pdf.addImage(
                                imgData,
                                'PNG',
                                0,
                                position,
                                pdfWidth,
                                pdfHeight
                            );
                            heightLeft -= pdf.internal.pageSize.getHeight();

                            while (heightLeft > 0) {
                                position = heightLeft - pdfHeight;
                                pdf.addPage();
                                pdf.addImage(
                                    imgData,
                                    'PNG',
                                    0,
                                    position,
                                    pdfWidth,
                                    pdfHeight
                                );
                                heightLeft -= pdf.internal.pageSize.getHeight();
                            }
                        } else {
                            pdf.addImage(
                                imgData,
                                'PNG',
                                0,
                                0,
                                pdfWidth,
                                pdfHeight
                            );
                        }

                        pdf.save(`${this.student.firstName || 'student'}.pdf`);
                        this.isLoading = false;
                        this.pdfHead = false;
                    })
                    .catch(() => {
                        this.isLoading = false;
                        this.pdfHead = false;
                    });
            });
        }, 100); // Wait 100ms for DOM update (can adjust if needed)
    }

    onEditInstallment(element: any) {
        console.log('Editing installment:', element);
        this.dialogRef = this.dialog.open(this.confirmDialogEdit, {
            width: '800',
            data: { id: element.id },
        });
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
                        this.loadStudentData();

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
                        this.loadStudentData();

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
                        this.loadStudentData();

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
}

export interface PeriodicElement {
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
