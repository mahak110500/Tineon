import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventDetailsService } from 'src/app/services/event-details.service';
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'


@Component({
	selector: 'app-create-events',
	templateUrl: './create-events.component.html',
	styleUrls: ['./create-events.component.css']
})
export class CreateEventsComponent implements OnInit, AfterViewInit {
	@ViewChild('calendar', { static: true }) calendar!: ElementRef<any>;

	eventForm: FormGroup | any;
	isSubmitted: boolean = false;
	imageUrl!: string;
	rooms: any = [];
	users: any = [];
	groups: any = [];
	selectedCheckbox: any;
	selectedCollaborator: any;
	showCostsSelected = false;
	showTasksSelected = false;


	visibilityOptions = [
		{ id: 1, name: 'Public' },
		{ id: 2, name: 'Private' },
		{ id: 3, name: 'Group' },
		{ id: 4, name: 'Club' }
	]

	collaboratorOptions = [
		{ id: 1, name: 'Individual' },
		{ id: 2, name: 'Group' },

	]

	constructor(
		private fb: FormBuilder,
		private eventService: EventDetailsService

	) { }

	ngOnInit(): void {
		this.eventForm = this.fb.group({
			title: ['', [Validators.required]],
			visibility: ['', [Validators.required]],
			location: ['', [Validators.required]],
			image: [''],
			type: ['', [Validators.required]],
			startDate: ['', [Validators.required]],
			startTime: ['', [Validators.required]],
			endTime: ['', [Validators.required]],
			room: ['', [Validators.required]],
			description: ['', [Validators.required]],
			file: [''],
			participant: ['', [Validators.required]],
			group: ['', [Validators.required]],
			showOption: [''],
			eventPrice: [''],
			showGuests: [''],
			showCosts: [''],
			showTasks: [''],
			tasksTitle: ['', [Validators.required]],
			tasksDescription: ['', [Validators.required]],
			tasksCollaborators: ['', [Validators.required]],
			tasksEndDate: ['', [Validators.required]],
			allowedPerson: ['', [Validators.required]],


		})

		this.teamGraoupandUsers();

	}

	ngAfterViewInit() {


	}

	onVisibilityChange() {
		this.selectedCheckbox = this.eventForm.get('visibility').value
		if (this.selectedCheckbox) {
			// console.log(this.selectedCheckbox.id);
		}
	}


	get formControls() { return this.eventForm.controls }

	onImageChange(event: any) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.imageUrl = reader.result as string;
			};
		}
	}

	onSubmit() {
		this.isSubmitted = true;
		console.log(this.eventForm.value);

		const formData = new FormData();

		const data = {
			name: 'AIUG - All India Union Group',
			place: 'Pune',
			type: '2',
			date_from: '2023-07-10 01:00',
			date_to: '2023-07-10 06:30',
			date_repeat: '2023-07-10 06:30',
			start_time: '01:00',
			end_time: '06:30',
			allowed_persons: '',
			room: 'null',
			visibility: '1',
			recurrence: 'RRULE:FREQ=WEEKLY;UNTIL=20230710T000000Z;DTSTART=20230710T000000Z',
			'participant[0]': '9',
			'participant[1]': '8',
			'participant[2]': '7',
			show_guest_list: 'true',
			price_per_participant: '',
			description: '<span>Lorem ipsum dolor sit amet. Et explicabo galisum ea nesciunt corrupti est laborum quam quo debitis fugiat. Quo fugiat soluta ea minus autem ea aspernatur explicabo aut temporibus magni eum nisi saepe non quam asperiores.</span>',
			users: JSON.stringify([{ user_id: 1, approved_status: 1 }, { user_id: 9, approved_status: 0 }, { user_id: 8, approved_status: 0 }, { user_id: 7, approved_status: 0 }]),
			author: '1',
			approved_status: '0',
			participants: 'participants',
			group_ida: '',
			file: '', // Replace fileData with the actual binary data of the file
			isTask: '',
			eventDate: JSON.stringify([{ date_from: '2023-07-10', start_time: '01:00', end_time: '06:30' }]),
			task: '[]',
			roomBookingDates: ''
		};

		Object.entries(data).forEach(([key, value]) => {
			formData.append(key, value);
		});

		this.eventService.createEvent(formData).subscribe((res:any)=>{
			console.log(res);
			
		})

		// Now you can make the HTTP POST request and send the formData object as the payload


	}

	teamGraoupandUsers() {
		this.eventService.getTeamGroupandUsers().subscribe((res: any) => {
			this.rooms = res.result.rooms
			this.users = res.result.users
			this.groups = res.result.groups
		})
	}


	uploadedFileName!: string;
	errorMessage!: string;
	onFileChange(event: any) {
		const file = event.target.files[0];

		if (file) {
			// Check if the file type is allowed
			const fileType = file.type;
			if (fileType === 'application/pdf' || fileType === 'application/zip') {
				this.errorMessage = '';
				this.uploadedFileName = file.name;
				this.eventForm.patchValue({ file });
			} else {
				this.errorMessage = 'This type is not allowed';
				this.uploadedFileName = '';
			}
		} else {
			this.errorMessage = '';
			this.uploadedFileName = '';
		}
	}


	updateShowOptions() {
		const showCosts = this.eventForm.get('showCosts').value;
		this.showCostsSelected = showCosts;

		const showTasks = this.eventForm.get('showTasks').value;
		this.showTasksSelected = showTasks;
	}


	onCollaboratorsChange() {
		this.selectedCollaborator = this.eventForm.get('tasksCollaborators').value
		if (this.selectedCollaborator) {
			// console.log(this.selectedCollaborator.id);
		}
	}

	roomDetails: any = [];
	onRoomSelected(event: any) {
		const selectedRoomId = event.id

		this.eventService.getRoomsbyId(selectedRoomId).subscribe((res: any) => {
			if (res.isError === false) {
				this.roomDetails = res.result

				if (this.roomDetails) {
					this.displayCalender();
				}
			}

		})
	}


	generateEvents() {
		console.log(this.roomDetails);

		const roomBookings = this.roomDetails.roomBooking;
		const roomAvailabilities = this.roomDetails.room_availablity;
		const events: any = [];

		// Add events for roomBooking
		roomBookings.forEach((booking: any) => {
			const startTime = `${booking.start_time}`; // Convert to ISO 8601 format
			const endTime = `${booking.end_time}`; // Convert to ISO 8601 format

			const event = {
				title: booking.course.name,
				start: booking.date_from + 'T' + startTime,
				end: booking.date_from + 'T' + endTime,
				backgroundColor: 'red', // Set the background color for roomBooking events
			};

			// console.log('Event:', event);
			events.push(event);
		});

		// Add events for room_availablity
		roomAvailabilities.forEach((availability: any) => {
			const startTime = `${availability.time_from}`; // Convert to ISO 8601 format
			const endTime = `${availability.time_to}`; // Convert to ISO 8601 format

			const weekday = availability.weekday === '0' ? '7' : availability.weekday; // Adjust weekday numbering if needed

			const event = {
				title: 'Available', // Set a common title for room_availablity events
				start: `2023-07-0${weekday}T${startTime}`, // Set a dummy date with the weekday and start time
				end: `2023-07-0${weekday}T${endTime}`, // Set a dummy date with the weekday and end time
				backgroundColor: 'green', // Set the background color for room_availablity events
			};

			// console.log('Event:', event);
			events.push(event);
		});

		// console.log('Generated events:', events);
		return events;
	}



	displayCalender() {
		var calendarEl = this.calendar.nativeElement
		var calendar = new Calendar(calendarEl, {
			initialView: 'timeGridWeek',
			initialDate: '2023-06-07',
			slotLabelFormat:
			{
				hour: 'numeric',
				minute: '2-digit',
				omitZeroMinute: false,
				hour12: false
			},
			// eventTimeFormat: 'HH:mm',
			defaultRangeSeparator: '-', // does not help
			plugins: [
				dayGridPlugin,
				timeGridPlugin,
				momentPlugin,
			],
			headerToolbar: {
				left: 'prev,next',
				center: 'title',
				right: ''
			},
			allDaySlot: false,
			events: this.generateEvents()

		});

		calendar.render();
	}



}
