import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { AdminEmployeeComponent } from './admin-employee/admin-employee.component';
import { LoginComponent } from './login/login.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PoComponent } from './po/po.component';
import { MessagingComponent } from './messaging/messaging.component';
import { AuthGuardService } from './auth-guard.service';
import { DataService } from './data.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsComponent,
    AdminEmployeeComponent,
    LoginComponent,
    InvoicesComponent,
    PoComponent,
    MessagingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [AuthGuardService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
