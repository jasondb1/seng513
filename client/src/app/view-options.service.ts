import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewOptionsService {

  displayChat: boolean = false;
  projectNumber: number = null;

  constructor() {
    console.log("[ViewOptionsService instance initialized]" + this.displayChat);

  }
}
