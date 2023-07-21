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
	tokenn:any;

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

		// this.authService.getLogin(this.loginForm.value).subscribe((res: any) => {
		// 	this.authService.setLoader(false);

		// 	if (res) {
		// 		this.authService.handleAuthentication(
		// 			res.email,
		// 			res.id,
		// 			res.access_token,
		// 			+res.expires_in)
		// 		localStorage.setItem('token', res.access_token);
		// 		// localStorage.setItem('userLoginDetails', JSON.stringify(res.user));
		// 		this.isUserLoggedIn.next(true);
		// 		this.router.navigate(['./dashboard'])
		// 	}
		// })


		this.authService.getLogin(this.loginForm.value).subscribe(
			(respData: any) => {
				var club_id = respData.team_id;
				if (respData['access_token']) { 
					this.tokenn = respData['access_token'];
					sessionStorage.setItem('token', respData['access_token']);
					sessionStorage.setItem('refresh_token', respData['refresh_token']);
					localStorage.setItem('token', respData['access_token']);
					localStorage.setItem('refresh_token', respData['refresh_token']);
					localStorage.setItem('user-id', respData['userId']);
					localStorage.setItem('allowAdvertis', respData['allowAdvertis']);
					localStorage.setItem('headlineOption', respData['headlineOption']);
				
					localStorage.setItem('user-data', JSON.stringify(respData));
					var status = '1';
					localStorage.setItem('loginStatus', status);
					
					const url: string[] = ["/dashboard"];
					this.router.navigate(url);
					this.authService.setLoader(false);
				}
				else if (respData['code'] == 400) {
					this.authService.setLoader(false);
				}
			}
		);
	}

}
