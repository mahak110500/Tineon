import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserInfoComponent } from './user-info/user-info.component';
import { EventDetailsService } from 'src/app/services/event-details.service';
import { takeWhile } from 'rxjs';

@Component({
	selector: 'app-event-details',
	templateUrl: './event-details.component.html',
	styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
	eventId: any;
	eventInfo: any
	eventImg: any;
	eventDate: any;
	eventDay: any;
	eventTimes: any;
	approvedUsers: any;
	unapprovedUsers: any;
	memberId: any;

	constructor(
		private dashboardService: DashboardService,
		private eventSrvice: EventDetailsService,
		private activeRoute: ActivatedRoute,
		public dialog: MatDialog
	) { }

	ngOnInit(): void {
		//to fetch product id from the route
		this.eventId = this.activeRoute.snapshot.paramMap.get('id');

		this.activeRoute.queryParams.subscribe((params: any) => {
			if (params.date) {
				const date = new Date(params.date);
				this.eventDate = formatDate(date, 'd MMMM yyyy', 'en-US');
				this.eventDay = date.toLocaleDateString('en-US', { weekday: 'long' });
			}
		});


		this.eventId && this.dashboardService.getEventDetails(this.eventId).subscribe((res: any) => {
			if (res?.isError == false) {
				this.eventInfo = res?.result[0]
				this.eventImg = JSON.parse(res?.result[0].picture_video);

				if (this.eventInfo.recurring_dates) {
					const recurringDates = JSON.parse(this.eventInfo.recurring_dates);
					if (Array.isArray(recurringDates) && recurringDates.length > 0) {
						const startTime = recurringDates[0].start_time;
						const endTime = recurringDates[0].end_time;
						this.eventTimes = `${startTime} - ${endTime} O'clock`;
					}
				}

			}
		})

		this.approvedParticipants();
		this.unapprovedParticipants();
	}

	openPopup(id:any) {
		// Open the popup using Bootstrap's modal method
		// $('#myModal').modal('show');
	  }


	opeDialog(id: any) {
		this.clubInfo();
		this.getUserDetails(id);

		this.dialog.open(UserInfoComponent);
	}

	getUserDetails(id: number) {
		this.eventSrvice.getUserDetails(id).subscribe((res: any) => {
			console.log(res);
			this.memberId = res[0]?.member_id;
			// console.log(this.memberId );

			this.memberInfo();
			this.profileInfo();

		})

	}

	clubInfo() {
		this.eventSrvice.getClubInfo().subscribe((res: any) => {
			// console.log(res);

		})
	}

	memberInfo() {
		const member_id = this.memberId;

		this.eventSrvice.getmemberInfo(member_id).subscribe((res: any) => {
			console.log(res);
		})

	}

	profileInfo(){
		const member_id = this.memberId;
		console.log(this.memberId);

		this.eventSrvice.getprofileInfo(member_id).subscribe((res: any) => {
			console.log(res);
		})

	}



	approvedParticipants() {
		this.dashboardService.getApprovedParticipants(this.eventId).subscribe((res: any) => {
			// console.log(res);
			this.approvedUsers = res[0].users
		})
	}

	unapprovedParticipants() {
		this.dashboardService.getUnapprovedParticipants(this.eventId).subscribe((res: any) => {
			this.unapprovedUsers = res;

		})
	}


}
