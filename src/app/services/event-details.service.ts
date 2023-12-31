import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EventDetailsService implements OnInit {
	public baseUrl = "http://103.127.29.85:9001/";
	token: any;

	constructor(private http: HttpClient) { }

	ngOnInit(): void {

	}


	// /api/get-club-info/21/141

	getClubInfo() {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		return this.http.get<any>(this.baseUrl + "api/get-club-info/21/141", { headers });
	}


	getUserDetails(id: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		let url = this.baseUrl + "api/usersDetails/user_id/" + id + "/team/141"

		return this.http.get<any>(url, { headers });
	}

	getmemberInfo(memberId: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		let url = this.baseUrl + "api/member-info/21/141/" + memberId

		return this.http.get<any>(url, { headers });
	}

	getprofileInfo(memberId: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		let url = this.baseUrl + "api/profile-info/21/141/" + memberId

		return this.http.get<any>(url, { headers });
	}

	// http://103.127.29.85:9001/api/getTaskCollaborator/task/14
	getTaskCollaborator(id: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		let url = this.baseUrl + "api/getTaskCollaborator/task/" + id

		return this.http.get<any>(url, { headers });
	}

	// http://103.127.29.85:9001/api/teamGroupsAndUsers/141
	getTeamGroupandUsers() {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		let url = this.baseUrl + "api/teamGroupsAndUsers/141"

		return this.http.get<any>(url, { headers });
	}


	getRoomsbyId(id:any){
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		let url = this.baseUrl + "api/getRoomsById/" + id

		return this.http.get<any>(url, { headers });

	}

	// http://103.127.29.85:9001/api/createEvent
	createEvent(data:any){
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

		return this.http.post(this.baseUrl + 'api/createEvent', data, { headers });

	}












}
