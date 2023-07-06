import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventDetailsService } from 'src/app/services/event-details.service';

@Component({
	selector: 'app-create-events',
	templateUrl: './create-events.component.html',
	styleUrls: ['./create-events.component.css']
})
export class CreateEventsComponent implements OnInit {
	eventForm: FormGroup | any;
	isSubmitted: boolean = false;
	imageUrl!: string;
	rooms: any = [];


	visibilityOptions = [
		{
			id: 1,
			name: 'Public'
		}, {
			id: 2,
			name: 'Private'
		}, {
			id: 3,
			name: 'Group'
		}, {
			id: 4,
			name: 'Club'
		},
	]
	mySelectModel!: number[];



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
		})

		this.teamGraoupandUsers();

	}

	onVisibilityChange() {
		// console.log( this.eventForm.get('visibility').value);
		let selectedId = this.eventForm.get('visibility').value
		console.log(selectedId.id);
		

	}


	get formControls() { return this.eventForm.controls }

	onImageChange(event: any) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.imageUrl = reader.result as string;
				console.log(this.imageUrl);

			};
		}
	}

	onSubmit() {
		console.log(this.eventForm.value);

	}

	teamGraoupandUsers() {
		this.eventService.getTeamGroupandUsers().subscribe((res: any) => {
			console.log(res);
			this.rooms = res.result.rooms
			// console.log(this.rooms);

		})
	}


}
