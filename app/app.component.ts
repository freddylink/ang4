import { Component, OnInit } from '@angular/core';
import {NavigationService} from "./navigation.service";
import {AuthService} from "./auth.service";
import { Router } from '@angular/router';
import {CookieService} from "./cookie.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app';
  states = {};

  constructor(
    private service: NavigationService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.states = this.service.states;
    //window.localStorage.clear();
    if (this.cookieService.get('user')) {
      this.authService.login();
      this.router.navigate(['/form']);
    } else {
      this.router.navigate(['/']);
    }
  }

  setState(currentState: string) {
    this.service.setState(currentState);
  }

}
