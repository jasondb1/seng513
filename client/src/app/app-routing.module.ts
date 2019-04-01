import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AdminEmployeeComponent } from './admin-employee/admin-employee.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoginComponent } from './login/login.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PoComponent } from './po/po.component';

import { AuthGuardService } from './auth-guard.service'


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  //{ path: '/', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuardService]},
  { path: 'admin', component: AdminEmployeeComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent },
  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuardService]},
  { path: 'po', component: PoComponent, canActivate: [AuthGuardService]}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
