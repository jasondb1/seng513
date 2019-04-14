import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from './user';
import { Project } from './project';
import { Invoice } from './invoice';
import { ConfigService} from "./config.service";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private EMPLOYEE_URL = '/api/users';
  private PROJECT_URL = '/api/project/';
  private AUTH_URL = '/api/auth';
  loggedIn: boolean = false;
  baseUrl: string;

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
    this.baseUrl = configService.baseUrl;
  }
  /////////////////////
  //getEmployee ()

  getEmployees() {
    console.log(this.baseUrl + this.EMPLOYEE_URL);
    return this.httpClient.get(this.baseUrl + this.EMPLOYEE_URL, {withCredentials: true});
  }

  /////////////////////
  //deleteEmployee ()

  deleteEmployee(id: Number) {
    return this.httpClient.delete(this.baseUrl + this.EMPLOYEE_URL + "/" + id, {withCredentials: true})

  }

  /////////////////////
  //newEmployee ()

  newEmployee(user: User) {
    return this.httpClient.post(this.baseUrl + this.EMPLOYEE_URL, user, {withCredentials: true});

  }

  /////////////////////
  //editEmployee ()

  editEmployee(user: User) {
    return this.httpClient.put(this.baseUrl + this.EMPLOYEE_URL + "/editUser", user, {withCredentials: true});
  }

  /////////////////////
  //deleteProject ()

  deleteProject(id: Number) {
    return this.httpClient.delete(this.baseUrl + this.PROJECT_URL + "/" + id, {withCredentials: true})

  }

  /////////////////////
  //getProject ()

  //getProjects() {
  getProjects(user:string){
    //console.log("[data service - getting data] from:" + this.baseUrl + this.PROJECT_URL);

    //return this.httpClient.get(this.baseUrl + this.PROJECT_URL);
    return this.httpClient.get(this.baseUrl + this.PROJECT_URL + user, {withCredentials: true});
  }

  /////////////////////
  //newProject ()

  newProject(project: Project) {

    return this.httpClient.post(this.baseUrl + this.PROJECT_URL, project, {withCredentials: true});

  }

  /////////////////////
  //editProject ()

  editProject(project: Project) {
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "editProject", project, {withCredentials: true});
  }


  /////////////////////
  //Add Employees to Project

  updateProjects(id: Number, project: Project){
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "/" +id, project, {withCredentials: true});
  }



  /////////////////////
  //Add Employees to Project

  addEmployeesProject(id: Number, userIDs: []){
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "/addEmployees/" +id, userIDs, {withCredentials: true})
  }

/*
/////////////////////
//Delete Employee from Project
removeEmployeesProject(id: Number, user: user?){
  return this.httpClient.put(this.baseUrl + this.projectUrl + "/" +id, ?????)
}
*/

  /////////////////////
  //Delete Employee from Project

/////////////////////
  //Delete Employee from Project



  /////////////////////
  //Add Invoice to Project
    newInvoice(id: Number, invoice: Invoice ){
      console.log(this.baseUrl + this.PROJECT_URL + "addInvoice");
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "addInvoice", invoice, {withCredentials: true})
  }

  /////////////////////
  //edit invoice

  editInvoice(invoice: Invoice ){

    console.log(this.baseUrl + this.PROJECT_URL + "addInvoice");
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "editInvoice", invoice, {withCredentials: true})
  }


  /////////////////////
  //delete invoice

  deleteInvoice(invoice: Invoice ){
    console.log(this.baseUrl + this.PROJECT_URL + "delInvoice");
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "deleteInvoice", invoice, {withCredentials: true})
  }


  /////////////////////
  //Log the user in

  logIn(user: User){
    return this.httpClient.post(this.baseUrl + this.AUTH_URL + '/login', user, {withCredentials: true});
  }

  /////////////////////
  //Log the user out

  logOut(){
    return this.httpClient.get(this.baseUrl + this.AUTH_URL + '/logout', {withCredentials: true});
  }

}
