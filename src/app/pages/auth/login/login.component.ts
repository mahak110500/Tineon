import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	isUserLoggedIn = new BehaviorSubject<boolean>(false);


	loginForm: any;
	isSubmitted: boolean = false;

	constructor(
		private formBuilder: UntypedFormBuilder,
		private router: Router,
		public authService: AuthService
	) { }

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			username: ['', [Validators.required]],
			password: ['', [Validators.required]],
			remember: [''],
			isMobile: false
		});
	}


	get formControls() { return this.loginForm.controls }


	onSubmit() {
		this.authService.setLoader(true);
		this.isSubmitted = true;

		if (this.loginForm.invalid) {
			return;
		}

		this.authService.getLogin(this.loginForm.value).subscribe((res: any) => {
			this.authService.setLoader(false);

			if (res) {
				this.authService.handleAuthentication(
					res.email,
					res.id,
					res.access_token,
					+res.expires_in)
				localStorage.setItem('token', res.access_token);
				// localStorage.setItem('userLoginDetails', JSON.stringify(res.user));
				this.isUserLoggedIn.next(true);
				this.router.navigate(['./dashboard'])
			}
		})
	}

}
