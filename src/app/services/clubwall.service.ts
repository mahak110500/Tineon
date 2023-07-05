import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ClubwallService implements OnInit {
	public baseUrl = "http://103.127.29.85:9001/";
	token: any


	constructor(private http: HttpClient) { }
	ngOnInit(): void { }


	getCurrentNews(pageIndex: number, pageSize: number) {
		this.token = localStorage.getItem('token');
		const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
		const url = `${this.baseUrl}api/posts/${pageIndex}/${pageSize}`;
		return this.http.get(url, { headers });
	}



	// getCurrentNews() {
	// 	this.token = localStorage.getItem('token');
	// 	const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
	// 	return this.http.get(this.baseUrl + 'api/posts/1/8', { headers });
	// }




}
