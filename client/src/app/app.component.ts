import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'smallFish ERP';
  headerVisible: boolean = false;

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] != '/projects' || event['url'] != '/admin' || event['url'] != '/po' || event['url'] != '/invoices') {
          this.headerVisible = false;
        } else {
          this.headerVisible = true;
        }
      }
    });
  }

  ngOnInit() {
    this.headerVisible = false;
  }
}
