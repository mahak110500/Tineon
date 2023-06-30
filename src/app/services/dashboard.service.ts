import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


@Injectable({
	providedIn: 'root'
})
export class DashboardService implements OnInit {
	public baseUrl = "http://103.127.29.85:9001/";


	constructor(private http: HttpClient) { }


	ngOnInit(): void {

	}

	getApprovedEvents() {
		const token = localStorage.getItem('token'); 
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
		return this.http.get(this.baseUrl + 'api/approvedEvents/user/1', { headers });
	}
}
