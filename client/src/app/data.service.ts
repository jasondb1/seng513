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

  private EMPLOYEE_URL = '/api/auth/users';
  private PROJECT_URL = '/api/project/';
  private LOGIN_URL = '/api/auth/login';
  loggedIn: boolean = false;
  baseUrl: string;

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
    this.baseUrl = configService.baseUrl;
  }
  /////////////////////
  //getEmployee ()

  getEmployees() {
    return this.httpClient.get(this.baseUrl + this.EMPLOYEE_URL);
  }

  /////////////////////
  //deleteEmployee ()

  deleteEmployee(id: Number) {
    return this.httpClient.delete(this.baseUrl + this.EMPLOYEE_URL + "/" + id)

  }

  /////////////////////
  //newEmployee ()

  newEmployee(user: User) {
    return this.httpClient.post(this.baseUrl + this.EMPLOYEE_URL, user);

  }

  /////////////////////
  //editEmployee ()

  editEmployee(user: User) {
    return this.httpClient.put(this.baseUrl + this.EMPLOYEE_URL + "/editUser", user);
  }

  /////////////////////
  //deleteProject ()

  deleteProject(id: Number) {
    return this.httpClient.delete(this.baseUrl + this.PROJECT_URL + "/" + id)

  }

  /////////////////////
  //getProject ()

  //getProjects() {
  getProjects(user:string){
    //console.log("[data service - getting data] from:" + this.baseUrl + this.PROJECT_URL);

    //return this.httpClient.get(this.baseUrl + this.PROJECT_URL);
    return this.httpClient.get(this.baseUrl + this.PROJECT_URL + user);
  }

  /////////////////////
  //newProject ()

  newProject(project: Project) {
    console.log("[add a Project]" + project);

    return this.httpClient.post(this.baseUrl + this.PROJECT_URL, project);

  }

  /////////////////////
  //edidProject ()

  editProject(project: Project) {
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "editProject", project);
  }


  /////////////////////
  //Add Employees to Project

  updateProjects(id: Number, project: Project){
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "/" +id, project);
  }



  /////////////////////
  //Add Employees to Project

  addEmployeesProject(id: Number, userIDs: []){
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "/addEmployees/" +id, userIDs)
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
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "addInvoice", invoice)
  }

  /////////////////////
  //Add Work Order to Project

  editInvoice(invoice: Invoice ){

    console.log(this.baseUrl + this.PROJECT_URL + "addInvoice");
    return this.httpClient.put(this.baseUrl + this.PROJECT_URL + "editInvoice", invoice)
  }



  /////////////////////
  //Delete Work Order to Project

  logIn(user: User){
    return this.httpClient.post(this.baseUrl + this.LOGIN_URL, user);
  }

}
