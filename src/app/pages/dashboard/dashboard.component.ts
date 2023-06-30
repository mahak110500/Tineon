import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RRule } from 'rrule';
import * as moment from 'moment';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	selected = new Date();
	approvedEvents: any = [];

	constructor(
		private dashboardService: DashboardService
	) { }

	ngOnInit(): void {
		this.dashboardService.getApprovedEvents().subscribe((res) => {
			this.approvedEvents = res
			console.log(this.approvedEvents);
		})

	}

	onDateChange(event: any) {
		if (event && event instanceof Date) {
			const selectedDate = new Date(event.getFullYear(), event.getMonth(), event.getDate());
			this.selected = selectedDate;

		}
	}

	// getEventsOnSelectedDate() {
	// 	if (!this.selected) {
	// 		return [];
	// 	}

	// 	const selectedDate = moment(this.selected).startOf('day');

	// 	return this.approvedEvents.filter((event:any) => {
	// 		const recurringDates = JSON.parse(event.recurring_dates);
	// 		return recurringDates.some((recurringDate:any) => {
	// 			const eventDate = moment(recurringDate.date_from, 'YYYY-MM-DD');
	// 			return eventDate.isSame(selectedDate, 'day');
	// 		});
	// 	});
	// }


	getEventsOnSelectedDate() {
		
		if (!this.selected) {
			return [];
		}

		const selectedDate = moment(this.selected).startOf('day');

		return this.approvedEvents.filter((event:any) => {
			if (event.recurrence) {
				const rrule = RRule.fromString(event.recurrence);
				const recurringDates = rrule.all();
				
				return recurringDates.some(date => moment(date).isSame(selectedDate, 'day'));
			} else if (event.recurring_dates) {

				const recurringDates = JSON.parse(event.recurring_dates);

				return recurringDates.some((recurringDate:any) => {
					const eventDate = moment(recurringDate.date_from, 'YYYY-MM-DD');
					return eventDate.isSame(selectedDate, 'day');
				});
			}

			return false;
		});
	}


	// getEventsOnSelectedDate() {
	// 	if (!this.selected) {
	// 		return [];
	// 	}

	// 	const selectedDateISOString = this.selected.toISOString().split('T')[0];
	// 	const selectedDate = selectedDateISOString + 'T00:00:00.000Z';
	// 	console.log(selectedDate);

	// 	return this.approvedEvents.filter((event: any) => {
	// 		const eventDate = event.date_from.split('T')[0] + 'T00:00:00.000Z';
	// 		return eventDate === selectedDate;
	// 	});
	// }





}
