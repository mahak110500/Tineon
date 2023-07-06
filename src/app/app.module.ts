import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './pages/auth/auth.component';
import { NavbarComponent } from './pages/common/navbar/navbar.component';
import { SidebarComponent } from './pages/common/sidebar/sidebar.component';
import { LayoutComponent } from './pages/common/layout/layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import {MatMenuModule} from '@angular/material/menu';
import { ClubwallComponent } from './pages/clubwall/clubwall.component';
import { CommunityComponent } from './pages/community/community.component';
import { OrganizerComponent } from './pages/organizer/organizer.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ClubwallNewsComponent } from './pages/clubwall/clubwall-news/clubwall-news.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EventDetailsComponent } from './pages/events/event-details/event-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { CreateEventsComponent } from './pages/events/create-events/create-events.component';
import { NgSelectModule } from '@ng-select/ng-select';




@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		AuthComponent,
		NavbarComponent,
		SidebarComponent,
		LayoutComponent,
		LoginComponent,
  ClubwallComponent,
  CommunityComponent,
  OrganizerComponent,
  ClubwallNewsComponent,
  EventDetailsComponent,
  CreateEventsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatCardModule,
		MatNativeDateModule,
		MatIconModule,
		MatMenuModule,
		FullCalendarModule,
		MatPaginatorModule,
		MatDialogModule,
		NgSelectModule,
		ModalModule.forRoot()
	],
	providers: [DatePipe,BsModalService],
	bootstrap: [AppComponent]
})
export class AppModule { }
