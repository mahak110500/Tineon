import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RRule } from 'rrule';
import * as moment from 'moment';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';



@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	calendarOptions: CalendarOptions = {
		plugins: [timeGridPlugin, interactionPlugin],
		initialView: 'timeGridDay', // Set initial view to timeGridDay
		headerToolbar: {
			left: 'prev',
			center: 'title',
			right: 'next', // Remove dayGridMonth from right section
		},
		weekends: true,
		editable: true,
		selectable: true,
		selectMirror: true,
		dayMaxEvents: true,
	};

	selected = new Date();
	newDate = new Date();
	approvedEvents: any = [];
	allCoursesData: any = [];



	constructor(
		private dashboardService: DashboardService
	) { }

	ngOnInit(): void {
		this.allEvents();
		this.allCourses();



		setTimeout(() => {
			this.calendarOptions = {
				initialView: 'timeGridDay',
				events: this.approvedEvents,
				// dateClick: this.onDateClick.bind(this),
			};
		}, 2500);

	}

	goToPreviousDay() {
		this.newDate = new Date(this.newDate.getTime() - 24 * 60 * 60 * 1000);
	}

	goToNextDay() {
		this.newDate = new Date(this.newDate.getTime() + 24 * 60 * 60 * 1000);

	}




	allEvents() {
		this.dashboardService.getApprovedEvents().subscribe((res) => {
			this.approvedEvents = res
			console.log(this.approvedEvents);
		});
	}


	allCourses() {
		let data = '{}';
		this.dashboardService.getAllCources(data).subscribe((res) => {
			if (res?.isError == false) {
				this.allCoursesData = res.result
				console.log(res);
			}
		})

	}

	onDateChange(event: any) {
		if (event && event instanceof Date) {
			const selectedDate = new Date(event.getFullYear(), event.getMonth(), event.getDate());
			this.selected = selectedDate;

		}
	}


	getItemsOnSelectedDate(items: any[]) {
		if (!this.selected) {
			return [];
		}

		const selectedDate = moment(this.selected).startOf('day');

		return items.filter((item: any) => {
			if (item.recurrence) {
				const rrule = RRule.fromString(item.recurrence);
				const recurringDates = rrule.all();

				return recurringDates.some(date => moment(date).isSame(selectedDate, 'day'));
			} else if (item.recurring_dates) {
				const recurringDates = JSON.parse(item.recurring_dates);

				return recurringDates.some((recurringDate: any) => {
					const itemDate = moment(recurringDate.date_from, 'YYYY-MM-DD');
					return itemDate.isSame(selectedDate, 'day');
				});
			}

			return false;
		});
	}

	getEventsOnSelectedDate() {
		return this.getItemsOnSelectedDate(this.approvedEvents);

		// if (!this.selected) {
		// 	return [];
		// }

		// const selectedDate = moment(this.selected).startOf('day');

		// return this.approvedEvents.filter((event: any) => {
		// 	if (event.recurrence) {
		// 		const rrule = RRule.fromString(event.recurrence);
		// 		const recurringDates = rrule.all();

		// 		return recurringDates.some(date => moment(date).isSame(selectedDate, 'day'));
		// 	} else if (event.recurring_dates) {

		// 		const recurringDates = JSON.parse(event.recurring_dates);

		// 		return recurringDates.some((recurringDate: any) => {
		// 			const eventDate = moment(recurringDate.date_from, 'YYYY-MM-DD');
		// 			return eventDate.isSame(selectedDate, 'day');
		// 		});
		// 	}

		// 	return false;
		// });
	}

	getCoursesOnSelectedDate() {
		return this.getItemsOnSelectedDate(this.allCoursesData);

		// if (!this.selected) {
		// 	return [];
		// }
		// const selectedDate = moment(this.selected).startOf('day');

		// return this.allCoursesData.filter((course: any) => {
		// 	if (course.recurrence) {
		// 		const rrule = RRule.fromString(course.recurrence);
		// 		const recurringDates = rrule.all();

		// 		return recurringDates.some(date => moment(date).isSame(selectedDate, 'day'));
		// 	} else if (course.recurring_dates) {

		// 		const recurringDates = JSON.parse(course.recurring_dates);

		// 		return recurringDates.some((recurringDate: any) => {
		// 			const eventDate = moment(recurringDate.date_from, 'YYYY-MM-DD');
		// 			return eventDate.isSame(selectedDate, 'day');
		// 		});
		// 	}

		// 	return false;
		// });

	}


	getItemsForNewDate(items: any[]) {
		if (!this.newDate) {
			return [];
		}

		const selectedDate = moment(this.newDate).startOf('day');

		return items.filter((item: any) => {
			if (item.recurrence) {
				const rrule = RRule.fromString(item.recurrence);
				const recurringDates = rrule.all();

				return recurringDates.some(date => moment(date).isSame(selectedDate, 'day'));
			} else if (item.recurring_dates) {
				const recurringDates = JSON.parse(item.recurring_dates);

				return recurringDates.some((recurringDate: any) => {
					const itemDate = moment(recurringDate.date_from, 'YYYY-MM-DD');
					return itemDate.isSame(selectedDate, 'day');
				});
			}

			return false;
		});


	}

	getEventsOnNewDate() {
		return this.getItemsForNewDate(this.approvedEvents);
	}

	getCoursesOnNewDate() {
		return this.getItemsForNewDate(this.allCoursesData);
	}


	// to get all events from current date
	getItemsFromTodayToNextYear(items: any[]) {
		const today = moment().startOf('day');
		const nextYear = moment().add(1, 'year').startOf('day');

		return items.filter((item: any) => {
			console.log(item);

			if (item.recurrence) {
				const rrule = RRule.fromString(item.recurrence);
				const recurringDates = rrule.between(today.toDate(), nextYear.toDate());
				return recurringDates.length > 0;
			} else if (item.recurring_dates) {
				const recurringDates = JSON.parse(item.recurring_dates);
				return recurringDates.some((recurringDate: any) => {
					const itemDate = moment(recurringDate.date_from, 'YYYY-MM-DD').startOf('day');
					return itemDate.isBetween(today, nextYear, 'day', '[]');
				});
			}

			return false;
		});
	}


	// clubAppointment(items: any[]) {
	// 	if (!this.selected) {
	// 		return [];
	// 	}

	// 	const selectedDate = moment(this.selected).startOf('day');
	// 	const today = moment().startOf('day');

	// 	return items.filter((item: any) => {
	// 		if (item.recurrence) {
	// 			const rrule = RRule.fromString(item.recurrence);
	// 			const recurringDates = rrule.all();

	// 			return recurringDates.some(date => moment(date).isSameOrAfter(today, 'day') && moment(date).isSame(selectedDate, 'day'));
	// 		} else if (item.recurring_dates) {
	// 			const recurringDates = JSON.parse(item.recurring_dates);

	// 			return recurringDates.some((recurringDate: any) => {
	// 				const itemDate = moment(recurringDate.date_from, 'YYYY-MM-DD').startOf('day');
	// 				return itemDate.isSameOrAfter(today, 'day') && itemDate.isSame(selectedDate, 'day');
	// 			});
	// 		}

	// 		return false;
	// 	});
	// }

	clubAppointment(items: any[]) {
		if (!this.selected) {
			return [];
		}

		const selectedDate = moment(this.selected).startOf('day');
		const endDate = moment().add(1, 'year').startOf('day'); // Next year from today

		return items.filter((item: any) => {
			if (item.recurrence) {
				const rrule = RRule.fromString(item.recurrence);
				const recurringDates = rrule.between(selectedDate.toDate(), endDate.toDate());

				return recurringDates.length > 0;
			} else if (item.recurring_dates) {
				const recurringDates = JSON.parse(item.recurring_dates);
				const itemDates = recurringDates.map((recurringDate: any) => moment(recurringDate.date_from, 'YYYY-MM-DD').startOf('day'));

				return itemDates.some((itemDate: any) => itemDate.isSameOrAfter(selectedDate, 'day') && itemDate.isSameOrBefore(endDate, 'day'));
			}

			return false;
		});
	}


	clubEvents() {
		return this.getItemsForNewDate(this.approvedEvents);

	}

	clubCourses() {
		return this.getItemsForNewDate(this.allCoursesData);

	}




}
