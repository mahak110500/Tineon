import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		AuthComponent,
		NavbarComponent,
		SidebarComponent,
		LayoutComponent,
		LoginComponent
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
		MatMenuModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
