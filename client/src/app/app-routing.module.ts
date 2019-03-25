import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import  { AdminEmployeeComponent } from './admin-employee/admin-employee.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoginComponent } from './login/login.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PoComponent } from './po/po.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  //{ path: '/', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  {path: 'admin', component: AdminEmployeeComponent },
  {path: 'login', component: LoginComponent },
  {path: 'invoices', component: InvoicesComponent },
  {path: 'po', component: PoComponent }

];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
