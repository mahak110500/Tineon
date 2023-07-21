import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	timeoutId: any;

	constructor(
		public authService: AuthService,
		private cdref: ChangeDetectorRef

	) { }

	ngOnInit(): void {
		this.authService.autoLogin();

	}

	checkTimeOut() {
		this.timeoutId = setTimeout(() => {
			if (this.authService.IsLoggedIn() || this.authService.getAuth()) {
				this.authService.logout();
			}
		}, 30 * 60 * 1000);
	}

	checkUserActivity() {
		clearTimeout(this.timeoutId);
		this.checkTimeOut();
	}

	ngAfterContentChecked() {
		this.cdref.detectChanges();
	}
}

