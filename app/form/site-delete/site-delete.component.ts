import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../server.service';
import {NavigationService} from "../../navigation.service";


interface areaCurrent {
  area: object
}


@Component({
  selector: 'app-site-delete',
  templateUrl: './site-delete.component.html',
  styleUrls: ['./site-delete.component.css']
})
export class SiteDeleteComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  areaCurrent: areaCurrent[] = [];
  hideForm: boolean = false;
  resultBox: object = {};

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnInit() {
    this.serverService
      .siteGet()
      .subscribe((area: areaCurrent[])=> {
        this.areaCurrent =  area['object'];
      });
  }

  ngOnChange() {
    this.refreshValues();
  }

  refreshValues() {
    this.hideForm = false;
    this.form.reset();
    this.ngOnInit();
  }

  actionDanger() {
    return confirm('Вы уверены, что хотите удалить площадку со всеми формами и pdf-шаблонами?');
  }

  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }
  submitForm(form: NgForm) {
    this.resultBox = form.value;
    if (this.actionDanger()) {
      console.log(this.resultBox);
      this.serverService
        .siteDelete(JSON.stringify(this.resultBox))
        .subscribe((json)=>{
          console.log(json);
      });
      this.hideForm = true;
    }

  }


}
