import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { StudentService } from '../../../services/student.services';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../../services/course.service';
import { CountryCode, CountryList, LeadStatus } from '../../../services/enums';

@Component({
    selector: 'app-edit-student',
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
    ],
    templateUrl: './edit-student.component.html',
    styleUrls: ['./edit-student.component.scss'],
})
export class EditStudentComponent implements OnInit {
    studentForm!: FormGroup;
    studentImage: File | null = null;
    idProof: File | null = null;
    certificate: File | null = null;
    isSubmitting = false;

    countryCodes = Object.entries(CountryCode).map(([key, value]) => ({
        name: key.replace(/_/g, ' '), // e.g. UNITED_STATES → "UNITED STATES"
        dial_code: value,
    }));

     countryNames = Object.entries(CountryList).map(([key, value]) => ({
    name: key, // e.g. UNITED_STATES → "UNITED STATES"
    value: value,
  }));

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

    isLoading = false;
    studentId: number | null = null;
    editMode: boolean = false;
    courses: any;
    page: number = 1;
    LeadStatus = LeadStatus; // <-- Make enum accessible in HTML

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
        private formBuilder: FormBuilder,
        private studentService: StudentService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
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

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId) && this.editor) {
            this.editor.destroy();
        }
    }

    private initializeForm(): void {
        this.studentForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            // lastName: ['', Validators.required],
            phone: ['', Validators.required],
            whatsappNumber: ['', Validators.required],
            email: [''],
            gender: ['', Validators.required],
            maritalStatus: [''],
            dob: ['', Validators.required],
            residenceCountry: ['', Validators.required],
            address: [''],
            nationality: ['', Validators.required],
            qualification: [''],
            orgName: ['', Validators.required],
            jobTitle: [''],
            // visaStatus: [''],
            otherStatus: ['', Validators.required],
            // emirates: ['', Validators.required],
            code: ['', Validators.required],
        });
    }

    private loadStudentData(): void {
        if (!this.studentId) return;

        this.isLoading = true;
        this.studentService.getStudentById(this.studentId).subscribe({
            next: (response) => {
                if (response && response.success) {
                    const student = response.customer;

                    // Populate form with student data
                    this.studentForm.patchValue({
                        firstName: student.firstName || '',
                        phone: student.phone || '',
                        whatsappNumber: student.whatsappNumber || '',
                        email: student.email || '',
                        gender: student.gender || '',
                        maritalStatus: student.maritalStatus || '',
                        dob: student.dob || '',
                        residenceCountry: student.residenceCountry || '',
                        address: student.address || '',
                        nationality: student.nationality || '',
                        qualification: student.qualification || '',
                        orgName: student.orgName || '',
                        jobTitle: student.jobTitle || '',
                        visaStatus: student.visaStatus || '',
                        otherStatus: student.otherStatus || '',
                        emirates: student.emirates || '',
                                                code: student.code || '',

                    });

                    // Set editor content
                    this.editorContent = student.notes || '';
                    this.isLoading = false;
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

    onSubmit(): void {
        if (this.studentForm.valid) {
            console.log('✅ Form Submitted:', this.studentForm.value);

            const formData = new FormData();

            Object.keys(this.studentForm.controls).forEach((key) => {
                formData.append(key, this.studentForm.get(key)?.value);
            });

            if (this.studentImage)
                formData.append('studentImage', this.studentImage);

            if (this.idProof) formData.append('idProof', this.idProof);

            if (this.certificate)
                formData.append('certificate', this.certificate);

            if (this.editMode) {
                this.studentService
                    .updateStudent(formData, this.studentId)
                    .subscribe({
                        next: (response) => {
                            if (response && response.success) {
                                this.loadStudentData();

                                this.certificate = null;
                                this.studentImage = null;
                                this.idProof = null;
                                this.toastr.success(
                                    'Updated successfully',
                                    'Success'
                                );
                            } else {
                                this.toastr.error(
                                    this.getApiErrorMessage(
                                        response,
                                        'Failed to Update student'
                                    ),
                                    'Error'
                                );
                            }
                            this.isSubmitting = false;
                        },
                        error: (error) => {
                            console.error('Error Updated student:', error);
                            this.toastr.error(
                                this.getApiErrorMessage(
                                    error,
                                    'Error Update student'
                                ),
                                'Error'
                            );
                            this.isSubmitting = false;
                        },
                    });
            } else {
                this.studentService.createStudent(formData).subscribe({
                    next: (response) => {
                        if (response && response.success) {
                            this.router.navigate(['/student']);

                            this.certificate = null;
                            this.studentImage = null;
                            this.idProof = null;
                            this.toastr.success(
                                'Created successfully',
                                'Success'
                            );
                        } else {
                            this.toastr.error(
                                this.getApiErrorMessage(
                                    response,
                                    'Failed to Create student'
                                ),
                                'Error'
                            );
                        }
                        this.isSubmitting = false;
                    },
                    error: (error) => {
                        console.error('Error Create student:', error);
                        this.toastr.error(
                            this.getApiErrorMessage(
                                error,
                                'Error Create student'
                            ),
                            'Error'
                        );
                        this.isSubmitting = false;
                    },
                });
            }
        } else {
            console.log('❌ Invalid Form');
            this.studentForm.markAllAsTouched();
        }
    }
    onFileSelected(event: any, type: string) {
        console.log('📂 File Upload Event:', event);

        let file: File | null = null;

        if (event instanceof File) {
            file = event; // case: emits single File
        } else if (Array.isArray(event)) {
            file = event[0]; // case: emits array of Files
        } else if (event?.file) {
            file = event.file; // case: emits { file: File, ... }
        } else if (event?.target?.files?.length) {
            file = event.target.files[0]; // fallback: native input
        }

        if (file) {
            if (type === 'studentImage') this.studentImage = file;
            if (type === 'idProof') this.idProof = file;
            if (type === 'certificate') this.certificate = file;
            console.log('✅ File captured:', file.name);
        } else {
            console.warn('⚠️ No file detected from event:', event);
        }
    }

    removeFile(type: string) {
        if (type === 'studentImage') this.studentImage = null;
        if (type === 'idProof') this.idProof = null;
        if (type === 'certificate') this.certificate = null;
    }

    onCancel(): void {
        this.router.navigate(['/students']);
    }

    private markFormGroupTouched(): void {
        Object.keys(this.studentForm.controls).forEach((key) => {
            const control = this.studentForm.get(key);
            control?.markAsTouched();
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

    private getApiErrorMessage(
        responseOrError: any,
        fallbackMessage: string
    ): string {
        return (
            responseOrError?.message ||
            responseOrError?.error?.message ||
            fallbackMessage
        );
    }
}
