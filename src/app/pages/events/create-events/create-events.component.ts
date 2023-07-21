import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EventDetailsService } from 'src/app/services/event-details.service';
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'
import { RRule } from 'rrule';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctionService } from 'src/app/services/common-function.service';
import * as $ from 'jquery';




@Component({
	selector: 'app-create-events',
	templateUrl: './create-events.component.html',
	styleUrls: ['./create-events.component.css']
})
export class CreateEventsComponent implements OnInit {
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
	recurrenceDropdownField: boolean = false;
	recurrenceDropdownList: { item_id: number, item_text: string }[] = [];
	customRecurrenceDropdownList: { item_id: number, item_text: string }[] = [];
	weekDayDropdownList: { item_id: number, description: string }[] = [];
	recurrenceString: string = '';
	eventSubmitted: boolean = false;
	recurrenceSelected: any = 0;
	weekDaysArr: { item_id: number, description: string }[] = [];
	todayName: any;
	isCustom: boolean = false;
	endDateRepeat: boolean = false;
	event_allDates: any[] = [];
	customRecurrenceTypeSelected: any;
	naturalNumber: boolean = true;
	weekDayTypeSelected: number[] = [];
	finalCustomRecurrence: any;



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

	eventTypeOptions = [
		{ id: 1, name: 'club event' },
		{ id: 2, name: 'group event' },
		{ id: 3, name: 'official event' },
		{ id: 4, name: 'course' },
		{ id: 5, name: 'seminar' },
	]





	constructor(
		private fb: FormBuilder,
		private eventService: EventDetailsService,
		public formBuilder: UntypedFormBuilder,
		private authService: AuthService,
		private commonFunctionService: CommonFunctionService
	) { }

	ngOnInit(): void {
		this.teamGraoupandUsers();


		this.eventForm = new UntypedFormGroup({
			'name': new UntypedFormControl('', [Validators.required]),
			'place': new UntypedFormControl('', [Validators.required]),
			'type': new UntypedFormControl('', Validators.required),
			'date_from': new UntypedFormControl('', Validators.required),
			'date_to': new UntypedFormControl('', Validators.required),
			'date_repeat': new UntypedFormControl(''),
			'start_time': new UntypedFormControl('', Validators.required),
			'end_time': new UntypedFormControl('', Validators.required),
			'allowed_persons': new UntypedFormControl('', [Validators.pattern('^[0-9]*$'),]),
			'room': new UntypedFormControl('',),
			'visibility': new UntypedFormControl('', Validators.required),
			'recurrence': new UntypedFormControl(''),
			'customRecurrence': new UntypedFormControl(''),
			'participant': new UntypedFormControl(''),
			'show_guest_list': new UntypedFormControl(''),
			'chargeable': new UntypedFormControl(''),
			'price_per_participant': new UntypedFormControl('', Validators.pattern("^[0-9]*$")),
			'description': new UntypedFormControl('', Validators.required),
			'users': new UntypedFormControl(''),
			// 'author': new UntypedFormControl(userId),
			'approved_status': new UntypedFormControl(0),
			'participants': new UntypedFormControl('participants'),
			'group_ida': new UntypedFormControl(''),
			'add_image': new UntypedFormControl('', Validators.required),
			'add_docfile': new UntypedFormControl('',),
			'isTask': new UntypedFormControl('',),
			eventDate: this.formBuilder.array([
				this.formBuilder.group({
					date_from: ['', Validators.required],
					start_time: ['', Validators.required],
					end_time: ['', Validators.required],
				}),
			]),
			task: this.formBuilder.array([]),
			roomBookingDates: new UntypedFormControl(''),
		});

		this.weekDaysArr = [
			{ item_id: 0, description: "SU" },
			{ item_id: 1, description: "MO" },
			{ item_id: 2, description: "TU" },
			{ item_id: 3, description: "WE" },
			{ item_id: 4, description: "TH" },
			{ item_id: 5, description: "FR" },
			{ item_id: 6, description: "SA" }
		];


		this.recurrenceDropdownList = [
			{ item_id: 0, item_text: 'Does not repeat' },
			{ item_id: 1, item_text: 'Every day' },
			{ item_id: 2, item_text: 'Every weak' },
			{ item_id: 3, item_text: 'Every month' },
			{ item_id: 4, item_text: 'Every year' },
			{ item_id: 5, item_text: 'Custom' }
		];

		this.customRecurrenceDropdownList = [
			{ item_id: 1, item_text: 'Repeat Daily' },
			{ item_id: 2, item_text: 'Repeat Weakly' },
			{ item_id: 3, item_text: 'Repeat Monthly' },
			{ item_id: 4, item_text: 'Repeat Yearly' }
		];

		this.weekDayDropdownList = [
			{ item_id: 0, description: 'Sunday' },
			{ item_id: 1, description: 'Monday' },
			{ item_id: 2, description: 'Tuesday' },
			{ item_id: 3, description: 'Wednesday' },
			{ item_id: 4, description: 'Thursday' },
			{ item_id: 5, description: 'Friday' },
			{ item_id: 6, description: 'Saturday' }
		];

		// this.eventForm = this.fb.group({
		// 	title: ['', [Validators.required]],
		// 	visibility: ['', [Validators.required]],
		// 	location: ['', [Validators.required]],
		// 	image: [''],
		// 	type: ['', [Validators.required]],
		// 	startDate: ['', [Validators.required]],
		// 	startTime: ['', [Validators.required]],
		// 	endTime: ['', [Validators.required]],
		// 	room: ['', [Validators.required]],
		// 	description: ['', [Validators.required]],
		// 	file: [''],
		// 	participant: ['', [Validators.required]],
		// 	group: ['', [Validators.required]],
		// 	showOption: [''],
		// 	eventPrice: [''],
		// 	showGuests: [''],
		// 	showCosts: [''],
		// 	showTasks: [''],
		// 	tasksTitle: ['', [Validators.required]],
		// 	tasksDescription: ['', [Validators.required]],
		// 	tasksCollaborators: ['', [Validators.required]],
		// 	tasksEndDate: ['', [Validators.required]],
		// 	allowedPerson: ['', [Validators.required]],


		// })


	}
	checkOnlyNaturalNumber(event: any) {
		let n = event.target.value;
		var result = (n - Math.floor(n)) !== 0;
		if (n == null || n == '') {
			this.naturalNumber = true;
		} else {
			if (result) {
				this.naturalNumber = true;
			}
			else if (n && n <= 0) {
				this.naturalNumber = true;
			} else if (n && n > 99) {
				this.naturalNumber = true;
			} else {
				this.naturalNumber = false;
			}
		}
	}


	onVisibilityChange() {
		this.selectedCheckbox = this.eventForm.get('visibility').value
		if (this.selectedCheckbox) {
			// console.log(this.selectedCheckbox.id);
		}
	}


	get formControls() { return this.eventForm.controls }

	get eventDate() {
		return this.eventForm.get('eventDate') as UntypedFormArray;
	}

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

	getToday(): string {
		return new Date().toISOString().split('T')[0]
	}

	getEndDate() {
		this.eventForm.controls["date_from"].setValue('');
		this.eventForm.controls["start_time"].setValue('');
		this.eventForm.controls["date_from"].setValue('');
		this.eventForm.controls["date_from"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].date_from);
		this.eventForm.controls["start_time"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].start_time);
		this.eventForm.controls["end_time"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].end_time);
		return this.eventForm.controls.date_from.value
	}

	dateSubmit() {
		if ((this.eventForm.controls['eventDate'].value[0] && this.eventForm.controls['eventDate'].value[0]?.start_time != '')) {
			if (this.eventForm.controls['eventDate'].value.length == 1) {
				this.recurrenceDropdownField = true;
			}
		} else {
			this.recurrenceDropdownField = false;
		}
	}

	errorTime: { isError: boolean; errorMessage: string; index: any } = { isError: false, errorMessage: '', index: -1 };
	compareTwoTimes(i: any) {
		if ((this.eventForm.controls?.['eventDate']?.value[i]?.start_time != '') && (this.eventForm.controls?.['eventDate']?.value[i]?.end_time != '')) {
			if ((this.eventForm.controls['eventDate'].value[i]?.start_time >= this.eventForm.controls['eventDate'].value[i]?.end_time)) {
				this.errorTime = { isError: true, errorMessage: 'This is invalid', index: i };
			} else {
				this.errorTime = { isError: false, errorMessage: '', index: -1 };
			}
		}
	}

	onSubmit() {
		this.eventSubmitted = true;
		this.isSubmitted = true;
		console.log(this.eventForm.value);

		const formData = new FormData();

		const data = {
			name: this.eventForm.value.title,
			place: this.eventForm.value.location,
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
			participants: this.eventForm.valueparticipant,
			group_ida: '',
			file: '', // Replace fileData with the actual binary data of the file
			isTask: '',
			eventDate: JSON.stringify([{ date_from: '2023-07-10', start_time: '01:00', end_time: '06:30' }]),
			task: '[]',
			roomBookingDates: ''
		};

		// const data = {
		// 	name: 'AIUG - All India Union Group',
		// 	place: 'Pune',
		// 	type: '2',
		// 	date_from: '2023-07-10 01:00',
		// 	date_to: '2023-07-10 06:30',
		// 	date_repeat: '2023-07-10 06:30',
		// 	start_time: '01:00',
		// 	end_time: '06:30',
		// 	allowed_persons: '',
		// 	room: 'null',
		// 	visibility: '1',
		// 	recurrence: 'RRULE:FREQ=WEEKLY;UNTIL=20230710T000000Z;DTSTART=20230710T000000Z',
		// 	'participant[0]': '9',
		// 	'participant[1]': '8',
		// 	'participant[2]': '7',
		// 	show_guest_list: 'true',
		// 	price_per_participant: '',
		// 	description: '<span>Lorem ipsum dolor sit amet. Et explicabo galisum ea nesciunt corrupti est laborum quam quo debitis fugiat. Quo fugiat soluta ea minus autem ea aspernatur explicabo aut temporibus magni eum nisi saepe non quam asperiores.</span>',
		// 	users: JSON.stringify([{ user_id: 1, approved_status: 1 }, { user_id: 9, approved_status: 0 }, { user_id: 8, approved_status: 0 }, { user_id: 7, approved_status: 0 }]),
		// 	author: '1',
		// 	approved_status: '0',
		// 	participants: 'participants',
		// 	group_ida: '',
		// 	file: '', // Replace fileData with the actual binary data of the file
		// 	isTask: '',
		// 	eventDate: JSON.stringify([{ date_from: '2023-07-10', start_time: '01:00', end_time: '06:30' }]),
		// 	task: '[]',
		// 	roomBookingDates: ''
		// };

		Object.entries(data).forEach(([key, value]) => {
			formData.append(key, value);
		});

		this.eventService.createEvent(formData).subscribe((res: any) => {
			console.log(res);

		})

	}

	onRecurrenceSelect(item: any) {

		this.recurrenceSelected = item.item_id;
		var today: number = (new Date()).getDay();
		var self = this;
		if (this.weekDaysArr && this.weekDaysArr.length > 0) {
			this.weekDaysArr.forEach(function (vals, keys) {
				if (vals.item_id == today) {
					self.todayName = vals.description;
				}
			});
		}
		if (item.item_id == 5) {
			this.isCustom = true;
			setTimeout(() => {
				$('#showPopup').trigger('click');
			}, 300);
		} else {
			this.isCustom = false;
		}
	}

	onRecurrenceDeSelect(item: any) { this.recurrenceSelected = null; }

	endRepeat() {
		this.eventForm.controls["date_from"].setValue('');
		this.eventForm.controls["start_time"].setValue('');
		this.eventForm.controls["date_from"].setValue('');
		this.eventForm.controls["date_from"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].date_from);
		this.eventForm.controls["start_time"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].start_time);
		this.eventForm.controls["end_time"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].end_time);

		if (this.eventForm.controls.recurrence?.value != '' && this.eventForm.controls.recurrence?.value[0]?.item_id != 0) {
			this.endDateRepeat = true;
			this.eventForm.controls["date_repeat"].setValue(this.eventForm.controls["date_to"].value);
			this.onRecurrence();
		} else {
			this.eventForm.controls["date_repeat"].setValue(this.eventForm.controls["date_to"].value);
			this.endDateRepeat = false;
			this.getEventsAllDates();
		}
	}

	/**function to create recurrence */
	onRecurrence() {

		if (this.recurrenceSelected != 5) {
			this.eventForm.controls["date_repeat"].setValue(this.eventForm.controls["date_to"].value);
			let monthDates: any = []
			if (this.eventForm.controls['eventDate'] && this.eventForm.controls['eventDate'].value.length > 0) {
				this.eventForm.controls['eventDate'].value.sort().forEach((element: any) => {
					monthDates.push(new Date(element.date_from).getDate())
				});
			}

			if (this.eventForm.controls.recurrence && this.eventForm.controls.recurrence.value != "" && this.eventForm.controls.recurrence.value != null
				&& this.eventForm.controls.recurrence.value != 0 && this.eventForm.controls.recurrence.value != 5
				&& this.eventForm.controls.recurrence.value != 1 && this.eventForm.controls.date_repeat.value != '') {

				if (this.eventForm.controls.recurrence.value.item_id == 1) {
					let rule = new RRule({
						"freq": RRule.DAILY,
						'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
						'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
					});
					let recc: string = rule.toString()
					let re: string = recc.slice(0, 25).replace(":", "=");
					let reccu: string = recc.slice(25);
					this.recurrenceString = reccu + ';' + re;
					console.log(this.recurrenceString);

					this.event_allDates = RRule.fromString(this.recurrenceString).all()
				} else if (this.eventForm.controls.recurrence.value.item_id == 2) {
					let rule = new RRule({
						"freq": RRule.WEEKLY,
						'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
						'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
					});
					let recc: string = rule.toString()
					let re: string = recc.slice(0, 25).replace(":", "=");
					let reccu: string = recc.slice(25);
					this.recurrenceString = reccu + ';' + re;
					console.log(this.recurrenceString);

					this.event_allDates = RRule.fromString(this.recurrenceString).all()
				} else if (this.eventForm.controls.recurrence.value.item_id == 3) {
					let rule = new RRule({
						"freq": RRule.MONTHLY,
						'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
						'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
						'bymonthday': monthDates
					});
					let recc: string = rule.toString()
					let re: string = recc.slice(0, 25).replace(":", "=");
					let reccu: string = recc.slice(25);
					this.recurrenceString = reccu + ';' + re;
					console.log(this.recurrenceString);

					this.event_allDates = RRule.fromString(this.recurrenceString).all()
				} else if (this.eventForm.controls.recurrence.value.item_id == 4) {
					let rule = new RRule({
						"freq": RRule.YEARLY,
						'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
						'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
						// 'bymonthday': monthDates
					});
					let recc: string = rule.toString()
					let re: string = recc.slice(0, 25).replace(":", "=");
					let reccu: string = recc.slice(25);
					this.recurrenceString = reccu + ';' + re;
					console.log(this.recurrenceString);

					this.event_allDates = RRule.fromString(this.recurrenceString).all()
				} else {
					this.recurrenceString = '';
					this.getEventsAllDates();
				}


			} else {
				this.recurrenceString = '';
				this.getEventsAllDates();
			}
		} else {
			this.setCustomRecurrence();
		}
	}

	getEventsAllDates() {
		var alldates: any[] = [];
		this.event_allDates = [];
		if (this.eventForm.controls.eventDate.value.length > 1) {
			var cour_dates: any[] = [];
			alldates = this.eventForm.controls.eventDate.value;
			alldates.forEach(element => {
				cour_dates.push(new Date(element.date_from));
			});
			this.event_allDates = this.authService.uniqueData(cour_dates); //when multiple dates are selected

		} else {
			this.eventForm.controls["date_repeat"].setValue(this.eventForm.controls["date_to"].value);
			alldates = this.commonFunctionService.getDates(new Date(this.eventForm.controls.date_from.value), new Date(this.eventForm.controls.date_to.value))
			this.event_allDates = alldates; //when recurrence is selected

		}
	}

	/*** Function is used to select the Recurrence
	* @author  MangoIt Solutions
	*/
	onCustomRecurrenceSelect(item: any) {
		this.customRecurrenceTypeSelected = item['item_id'];
		console.log(this.customRecurrenceTypeSelected);
		this.naturalNumber = true;
		if (item['item_id'] == 2) {
			this.eventForm.addControl('recc_week', this.formBuilder.control(''));
		} else {
			if (this.eventForm.contains('recc_week')) {
				this.eventForm.removeControl('recc_week');
			}
		}
	}

	/**
	  * Function to set custom Reccurence
	  * @author  MangoIt Solutions
	 * @param   {}
	 * @return {}
	 */
	setCustomRecurrence() {
		console.log(this.customRecurrenceTypeSelected);

		if (this.recurrenceSelected == 5 && this.customRecurrenceTypeSelected) {
			this.eventForm.controls["date_from"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].date_from);
			this.eventForm.controls["start_time"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].start_time);
			this.eventForm.controls["end_time"].setValue(this.eventForm.controls['eventDate'].value.sort((a: any, b: any) => new Date(a.date_from).valueOf() - new Date(b.date_from).valueOf())[0].end_time);
			let monthDates: any = []
			if (this.eventForm.controls['eventDate'] && this.eventForm.controls['eventDate'].value.length > 0) {
				this.eventForm.controls['eventDate'].value.sort().forEach((element: any) => {
					monthDates.push(new Date(element.date_from).getDate())
				});
			}
			let recurrenceData: string = '';
			this.recurrenceString = '';
			this.event_allDates = [];
			if (this.customRecurrenceTypeSelected == 1) {
				recurrenceData = '';
				let numberWeek: any = $('.custom_recurrence_daily').val();
				let r_rule: any = {
					"freq": RRule.DAILY,
					'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
					'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
				};
				if (numberWeek > 0 && this.naturalNumber == false) {
					r_rule["interval"] = numberWeek;
				}
				let rule = new RRule(r_rule);
				let recc: string = rule.toString();
				let re: string = recc.slice(0, 25).replace(":", "=");
				let reccu: string = recc.slice(25);
				recurrenceData = reccu + ';' + re;
				console.log(recurrenceData);
				
				this.event_allDates = RRule.fromString(recurrenceData).all()
			}
			if (this.customRecurrenceTypeSelected == 2) {
				var self = this;
				recurrenceData = '';
				let numberWeek: any = $('.custom_recurrence_weekly').val();
				//interval
				let byDay: any[] = [];
				if (self.weekDaysArr && self.weekDaysArr.length > 0) {
					self.weekDaysArr.forEach(function (weekName, weekIndex) {
						self.weekDayTypeSelected.forEach(function (weekSelected, key) {
							if (weekName.item_id == weekSelected) {
								byDay.push(weekName.description);
							}
						});
					});
				}
				//byWeekDay
				let r_rule: any = {
					"freq": RRule.WEEKLY,
					'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
					'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0))
				};
				if (numberWeek > 0) {
					r_rule["interval"] = numberWeek;
				}

				let rule = new RRule(r_rule);
				var recc: string = rule.toString();

				if (byDay.length > 0) {
					let recc_str: string;
					recc_str = rule.toString().concat(';BYDAY=');
					if (byDay && byDay.length > 0) {
						byDay.forEach((val, key) => {
							recc_str = recc_str.concat(val + ',')
							if (key == byDay.length - 1) {
								recc_str = recc_str.concat(val)
							}
						});
					}
					recc = recc_str;
				}
				let re: string = recc.slice(0, 25).replace(":", "=");
				let reccu: string = recc.slice(25);
				recurrenceData = reccu + ';' + re;
				console.log(recurrenceData);

				this.event_allDates = RRule.fromString(recurrenceData).all()
			}
			if (this.customRecurrenceTypeSelected == 3) {
				recurrenceData = '';
				let numberWeek: any = $('.custom_recurrence_monthly').val();
				let r_rule: any = {
					"freq": RRule.MONTHLY,
					'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
					'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
					'bymonthday': monthDates
				};
				if (numberWeek > 0) {
					r_rule["interval"] = numberWeek;
				}
				let rule = new RRule(r_rule);
				let recc: string = rule.toString();
				let re: string = recc.slice(0, 25).replace(":", "=");
				let reccu: string = recc.slice(25);
				recurrenceData = reccu + ';' + re;
				this.event_allDates = RRule.fromString(recurrenceData).all()
			} else if (this.customRecurrenceTypeSelected == 4) {
				recurrenceData = '';
				let numberWeek: any = $('.custom_recurrence_yearly').val();
				let r_rule: any = {
					"freq": RRule.YEARLY,
					'dtstart': new Date(Date.UTC(new Date(this.eventForm.controls.date_from.value).getFullYear(), new Date(this.eventForm.controls.date_from.value).getMonth(), new Date(this.eventForm.controls.date_from.value).getDate(), 0o0, 0o0, 0o0)),
					'until': new Date(Date.UTC(new Date(this.eventForm.controls.date_repeat.value).getFullYear(), new Date(this.eventForm.controls.date_repeat.value).getMonth(), new Date(this.eventForm.controls.date_repeat.value).getDate(), 0o0, 0o0, 0o0)),
					// 'bymonthday': monthDates
				};
				if (numberWeek > 0) {
					r_rule["interval"] = numberWeek;
				}
				let rule = new RRule(r_rule);
				let recc: string = rule.toString();
				let re: string = recc.slice(0, 25).replace(":", "=");
				let reccu: string = recc.slice(25);
				recurrenceData = reccu + ';' + re;
				console.log(recurrenceData);

				this.event_allDates = RRule.fromString(recurrenceData).all()
			}
			this.finalCustomRecurrence = recurrenceData;
		}
	}

	/**
  * Function is used to select the week
  * @author  MangoIt Solutions
  */
	onWeekDaySelect(item: any) {
		this.weekDayTypeSelected.push(item['item_id']);
	}

	/**
	* Function is used to de select the week
	* @author  MangoIt Solutions
	*/
	onWeekDayDeSelect(item: any) {
		this.weekDayTypeSelected.forEach((value, index) => {
			if (value == item.item_id) {
				this.weekDayTypeSelected.splice(index, 1);
			}
		});
	}



	closeModal() {
	}

	customReccModalClose() {
		$('#showPopup').trigger('click');
		this.closeModal();
	}



	addAvailableTimes() {
		this.recurrenceDropdownField = false;
		this.eventForm.controls['recurrence'].setValue('');
		this.recurrenceString = ''
		if (this.errorTime.isError == false) {
			this.errorTime = { isError: false, errorMessage: '', index: '' };

			if (this.eventDate.valid) {
				const newAvailableTimes: UntypedFormGroup = this.formBuilder.group({
					date_from: ['', Validators.required],
					start_time: ['', Validators.required],
					end_time: ['', Validators.required],
				});
				this.eventDate.push(newAvailableTimes);

				if (this.eventForm.controls['eventDate'].value.length > 1) {
					this.recurrenceDropdownField = false;
					this.eventForm.controls['recurrence'].setValue('');
					this.eventForm.get('recurrence').clearValidators();
					this.eventForm.get('recurrence').updateValueAndValidity();
					this.eventForm.controls['date_repeat'].setValue('');
					this.eventForm.controls['date_to'].setValue('');
				}
			}
		}
	}

	removeAvailableTimes(index: any) {
		this.errorTime = { isError: false, errorMessage: '', index: '' };
		this.eventDate.removeAt(index);

		if (this.eventForm.controls['eventDate'].value.length == 1) {
			this.eventForm.controls["recurrence"].setValue('');
			this.recurrenceDropdownList = []
			this.recurrenceDropdownList.push(
				{ item_id: 0, item_text: 'Does not repeat' },
				{ item_id: 1, item_text: 'Every day' },
				{ item_id: 2, item_text: 'Every weak' },
				{ item_id: 3, item_text: 'Every month' },
				{ item_id: 4, item_text: 'Every year' },
				{ item_id: 5, item_text: 'Custom' }
			);
			this.recurrenceDropdownField = true;
			this.eventForm.get('recurrence').setValidators(Validators.required);
			this.eventForm.get('recurrence').updateValueAndValidity();
		}
		this.eventForm.controls["date_repeat"].setValue('');
		this.eventForm.get('date_repeat').clearValidators();
		this.eventForm.get('date_repeat').updateValueAndValidity();
		// this.endDateRepeat = false;
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
	showCalender: boolean = false;
	onRoomSelected(event: any) {
		const selectedRoomId = event.id

		if (selectedRoomId) {
			this.showCalender = true;

		}


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
