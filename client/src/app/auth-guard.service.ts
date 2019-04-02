import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private dataService: DataService,
              private router: Router) {}
  
  canActivate() {
    if (this.dataService.loggedIn === false) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
    }
}