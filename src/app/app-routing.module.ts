import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LayoutComponent } from './pages/common/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
        ]
    }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
