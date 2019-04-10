import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from "../config.service";

import {AuthGuardService} from './../auth-guard.service';
import {DataService} from './../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  public user: any;
  public incorrectPass: boolean;
  public emptyCreds: boolean;

  constructor(private authGuardService: AuthGuardService,
              private dataService: DataService,
              private router: Router,
              private configService: ConfigService) {

    this.user = {};
  }

  /**
   * Authenticates user with the node.js server
   */
  validateLogin() {
    if (this.user.username && this.user.password) {

      this.dataService.logIn(this.user).subscribe(
        (res) => {
          console.log(res['status']);
          if (res['status'] === 'authenticated') {

            //set state variables
            this.configService.isAuthenticated = true;
            this.configService.isAdmin = res['admin'];
            this.configService.currentUser = res['username'];

            this.dataService.loggedIn = true;
            this.authGuardService.canActivate();
            this.router.navigateByUrl('/projects');
          }
          else {
            this.incorrectPass = true;
            this.emptyCreds = false;
          }
        });
    } else {
      this.emptyCreds = true;
      this.incorrectPass = false;
    }
  }

}
