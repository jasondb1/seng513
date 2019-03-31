import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { DataService } from './../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ DataService ]
})
export class LoginComponent {

  public user: any;
  public incorrectPass: boolean;
  public emptyCreds: boolean;

  constructor(private dataService: DataService,
              private router: Router) {
    
    this.user = {};
  }

  validateLogin() {
    if(this.user.username && this.user.password) {
        this.dataService.getEmployees().subscribe((result : Array<any>) => { 
        let returned = result.filter(obj => {
          return obj.username === this.user.username
        })
        if (returned.length !== 0) {
          if (returned[0].password === this.user.password) {
            this.router.navigateByUrl('/projects');
          } else {
            this.incorrectPass = true;
            this.emptyCreds = false;
          }
        } else {
          this.incorrectPass = true;
          this.emptyCreds = false;
        }
      }, error => {
        console.log(error);
      });
    } else {
        this.emptyCreds = true;
    }
  }
  
}
