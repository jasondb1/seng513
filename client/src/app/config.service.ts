import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  displayChat: boolean = false;
  projectNumber: number = null;
  public static isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  currentUser: string = "";
  messagingUrl: string = 'http://localhost:5200/authenticate';
  baseUrl: string = "http://localhost:3000";


  constructor() {

  }
}
