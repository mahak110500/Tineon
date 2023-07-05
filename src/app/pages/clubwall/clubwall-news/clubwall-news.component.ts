import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ClubwallService } from 'src/app/services/clubwall.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
	selector: 'app-clubwall-news',
	templateUrl: './clubwall-news.component.html',
	styleUrls: ['./clubwall-news.component.css']
})
export class ClubwallNewsComponent implements OnInit {
	totalRows: number = 0;
	pageSize: number = 8;
	currentPage: any = 0;
	pageSizeOptions: number[] = [10, 25, 50, 100];
	pageNo: number = 1;
	newsData:any = [];

	constructor(
		private clubwallService: ClubwallService

	) { }

	ngOnInit() {
		this.currentClubNews();

	}

	//for pagination
	pageChanged(event: PageEvent) {
		this.pageSize = event.pageSize;  //no. of items per page
		this.currentPage = event.pageIndex; //current page
		this.currentClubNews();
	}


	currentClubNews() {
		this.clubwallService.getCurrentNews(this.currentPage + 1, this.pageSize).subscribe((res: any) => {
			this.newsData = res?.news;
			console.log(this.newsData);
			this.totalRows = res?.pagination?.rowCount

		})
	}





}
