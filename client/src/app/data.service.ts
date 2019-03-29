import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from './user';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //user: User[];
  baseUrl: string = "http://localhost:3000";
  private url = '/api/auth/users';

  constructor(private httpClient: HttpClient) { }

  /////////////////////
  //getEmployees ()

  getEmployees() {

    console.log("[data service - getting data] from:" + this.baseUrl + this
      .url);
    console.log (this.httpClient.get(this.baseUrl + this.url));

    return this.httpClient.get(this.baseUrl + this.url);

  }


  /////////////////////
  //deleteEmployees ()

  deleteEmployee(id: Number) {
    console.log("[delete an employee]" + id);

    return this.httpClient.delete(this.baseUrl + this.url + "/" + id)

  }

  /////////////////////
  //newEmployees ()

  newEmployee(user: User) {
    console.log("[add an employee]" + user);

    return this.httpClient.post(this.baseUrl + this.url, user);

  }

}
