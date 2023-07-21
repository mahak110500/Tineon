import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { EventDetailsService } from 'src/app/services/event-details.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-event-details',
	templateUrl: './event-details.component.html',
	styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
	modalRef!: BsModalRef;

	eventId: any;
	eventInfo: any
	eventImg: any;
	eventDate: any;
	eventDay: any;
	eventTimes: any;
	approvedUsers: any;
	unapprovedUsers: any;
	memberId: any;
	userDetails: any;
	profileInfoData: any;
	hasEventTaskData: boolean = false;

	constructor(
		private dashboardService: DashboardService,
		private eventSrvice: EventDetailsService,
		private activeRoute: ActivatedRoute,
		private modalService: BsModalService,
		private authService: AuthService
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


		// get event details
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

				if (Object.keys(this.eventInfo.eventTask).length !== 0) {
					this.hasEventTaskData = true;

					let taskId = this.eventInfo?.eventTask?.id
					this.taskCollaborators(taskId);
				}



			}
		})

		this.approvedParticipants();
		this.unapprovedParticipants();
	}

	openModal(template: TemplateRef<any>, id: any) {
		this.modalRef = this.modalService.show(template);

		this.clubInfo();
		this.getUserDetails(id);
	}


	getUserDetails(id: number) {
		this.authService.setLoader(true);

		this.eventSrvice.getUserDetails(id).subscribe((res: any) => {
			this.authService.setLoader(false);

			this.memberId = res[0]?.member_id;
			this.userDetails = res[0];

			this.memberInfo();
			this.profileInfo();

		})

	}

	clubInfo() {
		this.authService.setLoader(true);

		this.eventSrvice.getClubInfo().subscribe((res: any) => {
			this.authService.setLoader(false);

		})
	}

	memberInfo() {
		this.authService.setLoader(true);
		const member_id = this.memberId;

		this.eventSrvice.getmemberInfo(member_id).subscribe((res: any) => {
			this.authService.setLoader(false);
			console.log(res);
		})

	}

	profileInfo() {
		this.authService.setLoader(true);

		const member_id = this.memberId;
		this.eventSrvice.getprofileInfo(member_id).subscribe((res: any) => {
			this.authService.setLoader(false);
			this.profileInfoData = res;
		})
	}

	taskCollaborators(taskId: any) {
		this.eventSrvice.getTaskCollaborator(taskId).subscribe((res: any) => {
			console.log(res);

		})
	}


	approvedParticipants() {
		this.authService.setLoader(true);

		this.dashboardService.getApprovedParticipants(this.eventId).subscribe((res: any) => {
			this.authService.setLoader(false);
			this.approvedUsers = res[0].users
		})
	}

	unapprovedParticipants() {
		this.authService.setLoader(true);

		this.dashboardService.getUnapprovedParticipants(this.eventId).subscribe((res: any) => {
			this.authService.setLoader(false);
			this.unapprovedUsers = res;

		})
	}


}
