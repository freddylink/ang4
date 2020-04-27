import { Component, OnInit } from '@angular/core';
import { NavigationService } from "./../navigation.service";
import {AuthService} from "../auth.service";
import { Router } from '@angular/router';
import {CookieService} from "../cookie.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  superadmin: boolean = false;
  title = 'app';
  states = {};

  constructor(private service: NavigationService, private authService: AuthService, private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    this.states = this.service.states;
    let cookie = this.cookieService.get('user');
    //установка прав суперпользователя
    if (JSON.parse(cookie).super === "Y") {
      this.superadmin = true;
    }
    if (cookie) {
      this.authService.login();
      this.router.navigate(['/form']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onLogout() {
    this.authService.logout();
    this.cookieService.delete('user');
    this.router.navigate(['/']);
  }

  setState(currentState: string) {
    this.service.setState(currentState);
  }

}
