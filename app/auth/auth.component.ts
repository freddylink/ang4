import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {AuthService} from "../auth.service";
import { ServerService } from './../server.service';
import {CookieService} from "../cookie.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  form: FormGroup;
  resultBox: {};
  message: object = {};

  constructor(
    private serverService: ServerService,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService

  ){}

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required]),
    })
  }

  private showMessage(text: string, type: string) {

  }

  onSubmit() {
    this.resultBox = this.form.value;
    this.serverService
      .getAccess(JSON.stringify(this.resultBox))
      .subscribe((json)=>{
        console.log(json);
        if (json.state === "SUCCESS") {
          this.message['text'] = '';
          //window.localStorage.setItem('user', JSON.stringify(json.object));
          this.authService.login();
          let date = new Date(new Date().getTime() + 7200 * 1000);
          this.cookieService.set('user', JSON.stringify(json.object), {"expires": date});
          this.router.navigate(['/form']);
        } else if (json.state === "NO_ACCESS") {
          this.message["text"] = "Пароль неверный";
          this.message["type"] = "danger";
        } else {
          this.message["text"] = "Такой логин не существует";
          this.message["type"] = "danger"
        }
      })
    ;
  }
}
