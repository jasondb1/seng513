import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  displayChat: boolean = false;
  projectNumber: number = null;

  constructor() {
    console.log("[ConfigService instance initialized]" + this.displayChat);

  }
}
