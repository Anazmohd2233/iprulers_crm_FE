// import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
// import { MatMenuModule } from '@angular/material/menu';
// import {
//     Component,
//     HostListener,
//     Inject,
//     PLATFORM_ID,
//     ViewChild,
// } from '@angular/core';
// import { ToggleService } from '../sidebar/toggle.service';
// import { MatButtonModule } from '@angular/material/button';
// import { Router, RouterLink } from '@angular/router';
// import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
// import { UsersService } from '../../services/users.service';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import {
//     MatSlideToggleChange,
//     MatSlideToggleModule,
// } from '@angular/material/slide-toggle';
// // import { SocketService } from '../../services/socket.service';

// import { AuthService } from '../../services/auth.service';

// @Component({
//     selector: 'app-header',
//     imports: [
//         NgClass,
//         MatMenuModule,
//         MatButtonModule,
//         RouterLink,
//         NgIf,
//         MatFormFieldModule,
//         MatSlideToggleModule,
//     ],
//     templateUrl: './header.component.html',
//     styleUrl: './header.component.scss',
// })
// export class HeaderComponent {
//     // isSidebarToggled
//     isSidebarToggled = false;
//     users: any;
//     user_type: any;

//     // isToggled
//     isToggled = false;

//     constructor(
//         private toggleService: ToggleService,
//         public themeService: CustomizerSettingsService,
//         private usersService: UsersService,
//         private router: Router,
//         @Inject(PLATFORM_ID) private platformId: Object,
//         private authService: AuthService
//     ) {
//         console.log('🟢 Header constructor');

//         this.toggleService.isSidebarToggled$.subscribe((isSidebarToggled) => {
//             this.isSidebarToggled = isSidebarToggled;
//         });
//         this.themeService.isToggled$.subscribe((isToggled) => {
//             this.isToggled = isToggled;
//         });
//     }

//     ngOnInit(): void {
//         console.log('************Header loaded*************');
//         if (isPlatformBrowser(this.platformId)) {
//             this.user_type = localStorage.getItem('user_type');
//         }
//         this.getProfile(); // call once on app load

//         this.authService.loginSuccess$.subscribe(() => {
//             console.log('🔔🔔🔔🔔🔔🔔 Login detected in header  🔔🔔🔔🔔🔔');
//             this.getProfile(); // call your important API
//         });
//     }

//     ngAfterViewInit(): void {
//         console.log('🟢 Header ngAfterViewInit');
//     }

//     // Burger Menu Toggle
//     toggle() {
//         this.toggleService.toggle();
//     }

//     // Header Sticky
//     isSticky: boolean = false;
//     @HostListener('window:scroll', ['$event'])
//     checkScroll() {
//         const scrollPosition =
//             window.scrollY ||
//             document.documentElement.scrollTop ||
//             document.body.scrollTop ||
//             0;
//         if (scrollPosition >= 50) {
//             this.isSticky = true;
//         } else {
//             this.isSticky = false;
//         }
//     }

//     // Dark Mode
//     toggleTheme() {
//         this.themeService.toggleTheme();
//     }

//     private getProfile(): void {
//         this.usersService.getProfile().subscribe({
//             next: (response) => {
//                 if (response && response.success) {
//                     this.users = response.data || [];
//                 } else {
//                     // this.toastr.error('Failed to load users', 'Failed');
//                     console.error('Failed to load profile:', response?.message);
//                 }
//             },
//             error: (error) => {
//                 console.error('API error:', error);
//             },
//         });
//     }

//     onLogout() {
//         // 🟢 Example: Clear local storage/session
//         localStorage.removeItem('token');
//         localStorage.removeItem('user_type');

//         localStorage.removeItem('super_admin');

//         sessionStorage.clear();

//         // 🟢 (Optional) Call API to invalidate session
//         // this.authService.logout().subscribe(() => {
//         //   this.router.navigate(['/authentication/logout']);
//         // });

//         // 🟢 Redirect after logout
//         this.router.navigate(['/authentication/logout']);
//     }
// }

import { CommonModule, isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import {
    Component,
    HostListener,
    Inject,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import { ToggleService } from '../sidebar/toggle.service';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { UsersService } from '../../services/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    MatSlideToggleChange,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
// import { SocketService } from '../../services/socket.service';

import { AuthService } from '../../services/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from '../../services/core.service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-header',
    imports: [
        NgClass,
        MatMenuModule,
        MatButtonModule,
        RouterLink,
        NgIf,
        NgFor,
        CommonModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatSelectModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    // isSidebarToggled
    isSidebarToggled = false;
    users: any;
    user_type: any;

    // isToggled
    isToggled = false;

    // Month Dropdown
    showMonthDropdown: boolean = false;
    months: { label: string; value: string }[] = [];
    selectedMonth: string = '';
    private routerSubscription: any;

    constructor(
        private toggleService: ToggleService,
        public themeService: CustomizerSettingsService,
        private usersService: UsersService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthService,
        private coreService: CoreService
    ) {
        console.log('🟢 Header constructor');

        this.toggleService.isSidebarToggled$.subscribe((isSidebarToggled) => {
            this.isSidebarToggled = isSidebarToggled;
        });
        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    ngOnInit(): void {
        console.log('************Header loaded*************');
        if (isPlatformBrowser(this.platformId)) {
            this.user_type = localStorage.getItem('user_type');
        }
        this.getProfile(); // call once on app load

        this.authService.loginSuccess$.subscribe(() => {
            console.log('🔔🔔🔔🔔🔔🔔 Login detected in header  🔔🔔🔔🔔🔔');
            this.getProfile(); // call your important API
        });

        // Check for /crm route and initialize month dropdown
        this.checkIfOnCrmRoute(this.router.url);

    // Listen to ALL future route changes
    this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
            this.checkIfOnCrmRoute(event.urlAfterRedirects);
        });
    }

    private checkIfOnCrmRoute(url: string): void {
    if (url === '/crm' || url.startsWith('/crm?') || url.startsWith('/crm#')) {
        if (!this.showMonthDropdown) {
            this.showMonthDropdown = true;
            this.generateMonths();
        }
        // Restore the last selected month (or default to current)
        if (!this.selectedMonth) {
            this.selectedMonth = this.coreService.getCurrentMonth();
        }
        // Optional: ensure service has the value
        this.coreService.setSelectedMonth(this.selectedMonth);
    } else {
        this.showMonthDropdown = false;
    }
}



    ngAfterViewInit(): void {
        console.log('🟢 Header ngAfterViewInit');
    }

    // Burger Menu Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // Header Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    private getProfile(): void {
        this.usersService.getProfile().subscribe({
            next: (response) => {
                if (response && response.success) {
                    this.users = response.data || [];
                } else {
                    // this.toastr.error('Failed to load users', 'Failed');
                    console.error('Failed to load profile:', response?.message);
                }
            },
            error: (error) => {
                console.error('API error:', error);
            },
        });
    }

    onLogout() {
        // 🟢 Example: Clear local storage/session
        localStorage.removeItem('token');
        localStorage.removeItem('user_type');

        localStorage.removeItem('super_admin');

        sessionStorage.clear();

        // 🟢 (Optional) Call API to invalidate session
        // this.authService.logout().subscribe(() => {
        //   this.router.navigate(['/authentication/logout']);
        // });

        // 🟢 Redirect after logout
        this.router.navigate(['/authentication/logout']);
    }

    private generateMonths(): void {
        const now = new Date(); // Use current date; adjust to January 05, 2026 if needed: new Date(2026, 0, 5)
        this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        for (let i = 0; i < 12; i++) { // Last 12 months including current
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            this.months.push({ label, value });
        }
    }

    onMonthChange(value: string): void {
        this.coreService.setSelectedMonth(value);
    }
}