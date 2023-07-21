import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LayoutComponent } from './pages/common/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClubwallComponent } from './pages/clubwall/clubwall.component';
import { CommunityComponent } from './pages/community/community.component';
import { OrganizerComponent } from './pages/organizer/organizer.component';
import { ClubwallNewsComponent } from './pages/clubwall/clubwall-news/clubwall-news.component';
import { EventDetailsComponent } from './pages/events/event-details/event-details.component';
import { CreateEventsComponent } from './pages/events/create-events/create-events.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
	{ path: 'login', component: LoginComponent},

	{
        path: '',
        component: LayoutComponent,
        // canActivate: [UserAuthGuard] ,

        children: [
            { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' }},
            { path: 'clubwall', component: ClubwallComponent},
            { path: 'clubwall-news', component: ClubwallNewsComponent},
            { path: 'community', component: CommunityComponent},
            { path: 'organizer', component: OrganizerComponent},
            { path: 'event-details/:id', component: EventDetailsComponent },
            { path: 'create-event', component: CreateEventsComponent },

        ]
    }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
