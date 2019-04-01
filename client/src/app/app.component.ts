import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'smallFish ERP';
  headerVisible: boolean = false;

  constructor(private router: Router,
              private dataService: DataService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/') { 
          this.headerVisible = false;
          this.dataService.switchLoggedIn();
        } else {
          this.headerVisible = true; 
        }
      }
    });
  }
}
