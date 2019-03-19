import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  displayMenu: boolean;

  constructor() { }

  ngOnInit() {

    this.displayMenu = false;

  }

}
