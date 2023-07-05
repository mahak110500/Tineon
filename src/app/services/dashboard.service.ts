import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class DashboardService implements OnInit {
	public baseUrl = "http://103.127.29.85:9001/";
	token: any


	constructor(private http: HttpClient) { }


	ngOnInit(): void {

	}

	getApprovedEvents() {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.get(this.baseUrl + 'api/approvedEvents/user/1', { headers });
	}


	getAllCources(token: string): Observable<any> {
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.post(this.baseUrl + 'api/allCourses', null, { headers });
	}

	getCurrentClubNews() {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.get(this.baseUrl + 'api/topNews/user/1', { headers });
	}

	getEventDetails(id: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.get<any>(this.baseUrl + "api/get-event-by-id/" + id, { headers });
	}

	getApprovedParticipants(id: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.get<any>(this.baseUrl + "api/approvedParticipants/event/" + id, { headers });
	}

	getUnapprovedParticipants(id: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.get<any>(this.baseUrl + "api/unapprovedParticipants/event/" + id, { headers });
	}

}
