import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { RRule } from 'rrule';
import * as moment from 'moment';
import { CalendarOptions, formatDate } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


interface Event {
	name: string;
	date_from: string;
	start_time: string;
	end_time: string;
	recurrence?: string;
	recurring_dates?: { date_from: string; start_time: string; end_time: string }[];
}


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
	clubNewsData: any = [];
	allowAdvertisment:any;
	bannerData:any= [];
    eventData:any= [];
    courseData:any= [];
	

	eventDates: { name: string; date: string; image: string; id: number }[] = [];

	courseDates: { name: string; date: string; image: string; id: number }[] = [];



	constructor(
		private dashboardService: DashboardService,
		private router: Router,
		private datePipe: DatePipe

	) { }

	ngOnInit(): void {
        this.allowAdvertisment = localStorage.getItem('allowAdvertis')
		console.log(this.allowAdvertisment);
		


		this.allEvents();
		this.allCourses();
		this.currentClubNews();

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

	formatDate(dateString: string): any {
		const date = new Date(dateString); // Convert the string to a Date object
		return this.datePipe.transform(date, 'd. MMMM yyyy');
	}


	currentClubNews() {
		this.dashboardService.getCurrentClubNews().subscribe((res: any) => {
			this.clubNewsData = res;
		})
	}


	allEvents() {
		this.dashboardService.getApprovedEvents().subscribe((res) => {
			this.approvedEvents = res
			// console.log(this.approvedEvents);
			this.processEvents();
			this.combineDates();

		});
	}


	allCourses() {
		let data = '{}';
		this.dashboardService.getAllCources(data).subscribe((res) => {
			if (res?.isError == false) {
				this.allCoursesData = res.result
				// console.log(res);
				// this.processCourses();
				this.filterCourses();
				this.combineDates();
			}
		})
	}

	parseDate(dateString: string): Date {
		const regex = /(\d{4}-\d{2}-\d{2})/; // Regular expression to match "YYYY-MM-DD" format
		const match = dateString.match(regex);

		if (match) {
			return new Date(match[0]);
		} else {
			return new Date(dateString);
		}
	}

	compareDates(date1: Date, date2: Date): number {
		const date1Only = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
		const date2Only = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

		if (date1Only < date2Only) {
			return -1;
		} else if (date1Only > date2Only) {
			return 1;
		} else {
			return 0;
		}
	}

	processEvents(): void {

		const today = new Date();

		this.approvedEvents.forEach((event: any) => {
			if (event.recurrence === null) {
				// Process events with recurring_dates
				const recurringDates = JSON.parse(event.recurring_dates);
				recurringDates.forEach((date: any) => {
					const eventDate = new Date(date.date_from);
					const pictureVideo = JSON.parse(event.picture_video);
					if (eventDate >= today) {
						this.eventDates.push({
							name: event.name,
							date: date.date_from,
							image: pictureVideo[0],
							id: event.id
						});
					}

				});
			} else {
				// Process events with recurrence string
				const rule = RRule.fromString(event.recurrence);
				const recurringDates = rule.all();

				recurringDates.forEach(date => {
					const pictureVideo = JSON.parse(event.picture_video);

					if (date >= today) {
						this.eventDates.push({
							name: event.name,
							date: formatDate(date),
							image: pictureVideo[0],
							id: event.id
						});
					}
				});
			}
		});
		// console.log(this.eventDates);


		this.eventDates.sort((a, b) => {
			const date1 = this.parseDate(a.date);
			const date2 = this.parseDate(b.date);
			return this.compareDates(date1, date2);
		});
	}


	filteredCourses!: any[];
	filterCourses(): void {
		const today = new Date();
		const futureDate = new Date('2050-12-31'); // Adjust this as per your requirement

		this.filteredCourses = this.allCoursesData.filter((course: any) => {
			// Check if the course starts from today or in the future
			const startDate = new Date(course.date_from);
			if (startDate > futureDate) {
				return false;
			}

			if (course.recurrence) {
				// Parse recurrence using RRule library
				const rule = RRule.fromString(course.recurrence);
				const recurringDates = rule.between(today, futureDate);

				recurringDates.forEach(date => {
					const pictureVideo = JSON.parse(course.picture_video);

					if (date >= today) {
						this.courseDates.push({
							name: course.name,
							date: formatDate(date),
							image: pictureVideo[0],
							id: course.id
						});
					}
				});

				return recurringDates.length > 0;
			} else if (course.recurring_dates) {
				// Parse recurring_dates JSON
				const recurringDates = JSON.parse(course.recurring_dates);
				// const courseDates = recurringDates.map((item: any) => new Date(item.date_from));
				recurringDates.forEach((date: any) => {
					const eventDate = new Date(date.date_from);
					const pictureVideo = JSON.parse(course.picture_video);
					if (eventDate >= today) {
						this.courseDates.push({
							name: course.name,
							date: date.date_from,
							image: pictureVideo[0],
							id: course.id
						});
					}
				});

			}

			return false;
		});

		// this.filteredCourses.sort((a, b) => {
		// 	const date1 = this.parseDate(a.date);
		// 	const date2 = this.parseDate(b.date);

		// 	return this.compareDates(date1, date2);
		// });
		console.log(this.filteredCourses);



	}




	// processCourses(): void {
	// 	const today = new Date();
	// 	console.log(this.allCoursesData);


	// 	this.allCoursesData.forEach((course: any) => {
	// 		if (course.recurrence === null) {
	// 			// Process courses with recurring_dates
	// 			const recurringDates = JSON.parse(course.recurring_dates);
	// 			recurringDates.forEach((date: any) => {
	// 				const courseDate = new Date(date.date_from);
	// 				if (courseDate >= today) {
	// 					this.courseDates.push({ name: course.name, date: `${date.date_from} ${date.start_time} - ${date.end_time}` });
	// 				}
	// 			});
	// 		} else {
	// 			// Process courses with recurrence string
	// 			const rule = RRule.fromString(course.recurrence);
	// 			const recurringDates = rule.all();

	// 			recurringDates.forEach(date => {
	// 				if (date >= today) {
	// 					this.courseDates.push({ name: course.name, date: date.toISOString() });
	// 				}
	// 			});
	// 		}
	// 	});

	// 	this.courseDates.sort((a, b) => {
	// 		const date1 = this.parseDate(a.date);
	// 		const date2 = this.parseDate(b.date);

	// 		return this.compareDates(date1, date2);
	// 	});

	// }

	combinedDates: { name: string, date: string }[] = [];

	combineDates(): void {
		this.combinedDates = [...this.eventDates, ...this.courseDates];
		this.combinedDates.sort((a, b) => {
			const date1 = this.parseDate(a.date);
			const date2 = this.parseDate(b.date);

			return this.compareDates(date1, date2);
		});
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
	}

	getCoursesOnSelectedDate() {
		return this.getItemsOnSelectedDate(this.allCoursesData);

	}


	getItemsForNewDate(items: any[]) {
		if (!this.newDate) {
			return [];
		}

		const selectedDate = moment(this.newDate).startOf('day');

		return items.filter((item: any) => {
			// console.log(item);

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
	clubAppointment(items: any[]) {

		const startDate = moment().startOf('day'); // Today's date
		const endDate = moment().add(1, 'year').startOf('day'); // Next year from today

		return items.filter((item: any) => {
			if (item.recurrence) {
				const rrule = RRule.fromString(item.recurrence);
				const recurringDates = rrule.between(startDate.toDate(), endDate.toDate());

				return recurringDates.length > 0;
			} else if (item.recurring_dates) {
				const recurringDates = JSON.parse(item.recurring_dates);
				const itemDates = recurringDates.map((recurringDate: any) => moment(recurringDate.date_from, 'YYYY-MM-DD').startOf('day'));

				return itemDates.some((itemDate: any) => itemDate.isSameOrAfter(startDate, 'day') && itemDate.isSameOrBefore(endDate, 'day'));
			}

			// Check if the item falls within the desired range
			const itemDate = moment(item.date_from, 'YYYY-MM-DD').startOf('day');
			return itemDate.isSameOrAfter(startDate, 'day') && itemDate.isSameOrBefore(endDate, 'day');
		});
	}


	clubEvents() {
		return this.clubAppointment(this.approvedEvents);
	}

	clubCourses() {
		return this.clubAppointment(this.allCoursesData);
	}

	// Helper function to get the display name for a given type
	getDisplayNameForType(type: string): string {
		switch (type) {
			case "1":
				return 'Club Event';
			case "3":
				return 'Official Event';
			case "5":
				return 'Seminar';
			default:
				return 'Course';
		}
	}


	//for navigating to single event details page
	navigateToEventDetails(eventId: any, eventDate: any) {
		const formattedDate: any = this.datePipe.transform(eventDate, 'yyyy-MM-dd');
		const encodedEventId = encodeURIComponent(eventId);
		const encodedEventDate = encodeURIComponent(formattedDate);

		this.router.navigate(['/event-details/', encodedEventId], {
			queryParams: { date: encodedEventDate }
		});
	}



}
