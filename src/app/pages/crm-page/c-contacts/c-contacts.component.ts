import { NgFor, NgIf } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { ContactService } from '../../../services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { CourseService } from '../../../services/course.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-c-contacts',
    imports: [
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        MatPaginatorModule,
        NgIf,
        MatCheckboxModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,

        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,

        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        NgIf,
        MatTooltipModule,
        MatProgressBarModule,
        MatIcon,
        FormsModule, // ✅ needed for [(ngModel)]
        NgFor,
    ],
    templateUrl: './c-contacts.component.html',
    styleUrl: './c-contacts.component.scss',
})
export class CContactsComponent {
    ELEMENT_DATA: PeriodicElement[] = [];

    page: number = 1;
    pageSize: number = 20;
    totalRecords: number = 0;
    contacts: any;
    searchField: string = ''; // Initialize the property
    searchFieldUser: string = '';
    users: any;
    user_type: any;
    searchFieldCourse: string = '';
    courses: any;

    displayedColumns: string[] = [
        // 'select',
        // 'contactID',
        'name',
        'email',
        'phone',
        'courses',
        'owner',
        'lead_source',
        'status',
        'lead_status',
        'action',
    ];

    dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;
    selectedId: any;

    constructor(
        public themeService: CustomizerSettingsService,
        private contactService: ContactService,
        private toastr: ToastrService,
        private usersService: UsersService,
        private courseService: CourseService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        //   this.user_type =  localStorage.getItem('user_type');
        this.getContactList();
        this.getUserList();
        this.getCourseList();
    }

    ngAfterViewInit() {
        // listen to paginator changes
        console.log('**********page changed**********');
        this.paginator.page.subscribe((event) => {
            this.page = event.pageIndex + 1; // MatPaginator is 0-based, API is 1-based
            this.pageSize = event.pageSize;
            this.getContactList();
        });
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }
    filterUser(event: any) {
        console.log('***event***', event.value);

        let params = new HttpParams();

        params = params.set('userId', event.value);
        this.getContactList(params);
    }
    clearSearchUser() {
        this.searchFieldUser = ''; // Clear the input by setting the property to an empty string
        this.getUserList();
    }
    searchUser() {
        console.log('user search keyword', this.searchFieldUser);
        this.getUserList(this.searchFieldUser);
    }
    filterCreatedDate(event: any) {
        // this.createdDateFilter = event.value;
        this.applyAllFilters();
    }

    filterDueDate(event: any) {
        // this.dueDateFilter = event.value;
        this.applyAllFilters();
    }

    filterPriority(event: any) {
        // this.priorityFilter = event.value;
        this.applyAllFilters();
    }

    applyAllFilters() {
        this.dataSource.filter = '' + Math.random(); // Trigger table refresh
    }

    filterStatus(event: any) {
        // this.statusFilter = event.value;
        this.applyAllFilters();
    }

    filterCourse(event: any) {
        console.log('***event***', event.value);

        let params = new HttpParams();

        params = params.set('schoolId', event.value);
        this.getCourseList(params);
    }
    searchCourse() {
        console.log('course search keyword', this.searchFieldCourse);
        this.getCourseList(this.searchFieldCourse);
    }
    clearSearchCourse() {
        this.searchFieldCourse = ''; // Clear the input by setting the property to an empty string
        this.getCourseList();
    }

    private getCourseList(search?: any): void {
        let params = new HttpParams().set('status', true);

        if (search) {
            params = params.set('search', search);
        }

        this.courseService.getCourse(this.page, params).subscribe({
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

    resetFilters() {
        // this.createdDateFilter = null;
        // this.dueDateFilter = null;
        // this.priorityFilter = '';
        // this.statusFilter = '';
        this.applyAllFilters();
    }

    // applyFilter(event: Event) {
    //     const filterValue = (event.target as HTMLInputElement).value;
    //     console.log('filterValue => ???? ',filterValue.trim().toLowerCase())
    //     this.dataSource.filter = filterValue.trim().toLowerCase();
    // }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.name + 1
        }`;
    }

    applyFilter() {
        // const filterValue = (event.target as HTMLInputElement).value;
        // this.dataSource.filter = filterValue.trim().toLowerCase();

        let params = new HttpParams().set('search', this.searchField);
        this.getContactList(params);
    }

    clearSearch() {
        this.getContactList();

        this.searchField = ''; // Clear the input by setting the property to an empty string
    }
    private getUserList(search?: any): void {
        let params = new HttpParams().set('user_type', 'USER');

        if (search) {
            params = params.set('search', search);
        }

        this.usersService.getUsers(this.page, params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.users = response.data?.users || [];
                } else {
                    // this.toastr.error('Failed to load users', 'Failed');
                    console.error('Failed to load users:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    private getContactList(params?: any): void {
        this.contactService.getContact(this.page, params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    const contacts = response.data?.contacts || [];
                    this.totalRecords = response.data?.total || contacts.length;

                    this.ELEMENT_DATA = contacts.map((u: any) => ({
                        id: u.id,
                        contactID: u.school || 'N/A',
                        owner: u?.contact_owner || 'N/A',

                        name: u.contact_name || 'N/A',
                        email: u.email || 'N/A',
                        lead_source: u.lead_source || 'N/A',
                        lead_status: u.lead_status || 'OTHER',
                        phone: u.phone
                            ? u.code === 'OTHER'
                                ? u.phone
                                : `${u.code} ${u.phone}`
                            : '-',
                        courses: u?.courses,

                        status: u.status,
                        action: '', // we will handle icons directly in template
                    }));

                    this.dataSource.data = this.ELEMENT_DATA;
                } else {
                    // this.toastr.error('Failed to load Contact', 'Failed');
                    console.error('Failed to load contact:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    openConfirmDialog(id: any) {
        this.selectedId = id;
        this.dialogRef = this.dialog.open(this.confirmDialog);
    }

    deleteContact() {
        this.contactService.deleteContact(this.selectedId).subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.selectedId = null;
                    this.dialogRef.close();
                    this.getContactList();

                    if (this.dialogRef) {
                        this.dialogRef.close();
                    }
                    this.toastr.success(
                       response.message,
                        'Success'
                    );
                } else {
                    this.toastr.error(response.message, 'Error');
                }
            },
            error: (error) => {
                console.error('Error Delete contact:', error);
                this.toastr.error('Error Delete contact', 'Error');
            },
        });
    }
}

export interface PeriodicElement {
    id: any;
    contactID: string;
    name: any;
    email: string;

    phone: string;
    courses: string;
    owner: string;
    lead_source: string;
    status: any;
    lead_status: any;
    action: any;
}
