import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
	providedIn: 'root'
})
export class AuthService implements OnInit {
	user = new ReplaySubject<Object>(1);
	tokenExpirationTimer: any;
	private isLoading: boolean = false;
	public baseUrl = "http://103.127.29.85:9001/";


	constructor(private http: HttpClient, private router: Router) { }

	ngOnInit(): void {

	}
	
	//used to set the loader
	loader: Boolean = false;
	setLoader(value: Boolean) {
		this.loader = value;
	}

	get showLoader() {
		return this.loader;
	}


	//Top Countries data
	public getLogin(data: any): Observable<any> {
		return this.http.post(this.baseUrl + 'api/login-keycloak', data);
	}

	//for auth-guard
	IsLoggedIn() {
		//it returns a boolean value, if the token exsist then true else vice versa
		// return !!localStorage.getItem('token');
		return !!localStorage.getItem('token');
	}

	//used in auth-guard
	getAuth() {
		if (localStorage.getItem('token')) {
			return true;
		} else {
			return false;
		}
	}


	//to logout the user when clicks on logout button or used at the time of auto logout
	logout() {

		localStorage.clear();
		this.router.navigate(['./login']);

		//for autoLogout
		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
		this.tokenExpirationTimer = null;
	}

	private handleError(error: HttpErrorResponse) {
		let errorMessage = {};
		if (error.status == 401) {
			errorMessage =
			{
				"isError": true,
				"message": "An error occurred :- Unauthorized error please login first"
			}
			this.logout();
		}
		else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong.
			return throwError(error.error);
		}
		// Return an observable with a user-facing error message.
		return throwError(errorMessage);
	}

	//auto logins the user if token has not been expired
	autoLogin() {
		let loggedinUser: any = localStorage.getItem('userData');
		// let loggedinUser: any = localStorage.getItem('userData'); 

		const userData: {
			email: string;
			id: string;
			_token: string;
			_tokenExpirationDate: string;
		} = loggedinUser;

		if (!userData) {
			return;
		}
		const loadedUser = new User(
			userData.email,
			userData.id,
			userData._token,
			new Date(userData._tokenExpirationDate)
		);

		if (loadedUser.token) {
			const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
			this.autoLogout(expirationDuration);
		}

	}

	//auto logouts the user when token expires and the user is inactive
	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.logout();
		}, expirationDuration);
	}


	handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
		const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
		//time after which user has to be auto logged out
		var d = expirationDate.toString();
		var index = d.lastIndexOf(':') + 3;
		var expiringDate = d.substring(0, index);
		const expirationDuration = new Date(expiringDate).getTime() - new Date().getTime();
		const user: any = new User(
			email,
			userId,
			token,
			new Date(expirationDuration)
		);

		this.user.next(user); //storing data in user subject
		localStorage.setItem('userData', JSON.stringify(user));
		this.autoLogout(expirationDuration);
	}





}
