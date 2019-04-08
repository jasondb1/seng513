import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from './user';
import { Project } from './project';
import { Invoice } from './invoice';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //user: User[];
  baseUrl: string = "http://localhost:3000";
  //baseUrl: string = "http://localhost:5200";
  private employeeUrl = '/api/auth/users';
  private projectUrl = '/api/project/';
  loggedIn: boolean = false;

  constructor(private httpClient: HttpClient) { }

  /////////////////////
  //getEmployee ()

  getEmployees() {
    console.log("[data service - getting data] from:" + this.baseUrl + this
      .employeeUrl);

    return this.httpClient.get(this.baseUrl + this.employeeUrl);
  }

  /////////////////////
  //deleteEmployee ()

  deleteEmployee(id: Number) {
    console.log("[delete an employee]" + id);

    return this.httpClient.delete(this.baseUrl + this.employeeUrl + "/" + id)

  }

  /////////////////////
  //newEmployee ()

  newEmployee(user: User) {
    console.log("[add an employee]" + user);

    return this.httpClient.post(this.baseUrl + this.employeeUrl, user);

  }

  /////////////////////
  //editEmployee ()

  editEmployee(user: User) {
    console.log("[Edit an employee]");
    console.log(user);

    return this.httpClient.put(this.baseUrl + this.employeeUrl + "/editUser", user);

  }

  /////////////////////
  //deleteProject ()

  deleteProject(id: Number) {
    console.log("[delete a project]" + id);

    return this.httpClient.delete(this.baseUrl + this.projectUrl + "/" + id)

  }

  /////////////////////
  //getProject ()

  getProjects() {
    console.log("[data service - getting data] from:" + this.baseUrl + this.projectUrl);

    return this.httpClient.get(this.baseUrl + this.projectUrl);
  }

  /////////////////////
  //newProject ()

  newProject(project: Project) {
    console.log("[add a Project]" + project);

    return this.httpClient.post(this.baseUrl + this.projectUrl, project);

  }

  /////////////////////
  //Add Employees to Project

  updateProjects(id: Number, project: Project){
    return this.httpClient.put(this.baseUrl + this.projectUrl + "/" +id, project);
  }



  /////////////////////
  //Add Employees to Project

  addEmployeesProject(id: Number, userIDs: []){
    return this.httpClient.put(this.baseUrl + this.projectUrl + "addEmployees/" +id, userIDs)
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
    return this.httpClient.put(this.baseUrl + this.projectUrl + "addEmployees/" +id, invoice)
  }

  /////////////////////
  //Add Work Order to Project



  /////////////////////
  //Delete Work Order to Project



}
