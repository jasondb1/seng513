import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  displayChat: boolean = false;
  projectNumber: number = null;
  isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  currentUser: string = "";

  constructor() {
    //console.log("[ConfigService instance initialized]" + this.displayChat);

  }
}
