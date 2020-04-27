import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../server.service';
import { NavigationService } from "../../navigation.service";

interface areaCurrent {
  area: object
}


@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.css']
})
export class FormViewComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  areaCurrent: areaCurrent[] = [];
  searchSite = '';
  sites = [];
  langs = [];
  elems = [];


  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnInit() {
    this.serverService
      .formGetAll()
      .subscribe((area: areaCurrent[])=> {
        this.areaCurrent = area['object'];
        this.fillForm();
      });
  }

  refreshValues() {
    this.sites = [];
    this.areaCurrent = [];
    this.ngOnInit();
  }

  fillForm() {
    for (let key in this.areaCurrent) {
      let item = this.areaCurrent[key];
      for (let i in item['subsection']) {
        let langArr = item['subsection'][i]["NAME"];
        let form = {};
        let forms = item['subsection'][i]["elems"];
        for (let j in forms) {
          form = {
            "name" : forms[j]["NAME"],
            "link": forms[j]["PROPERTY_PDF_LINK_VALUE"]
          };
          this.elems.push(form);
        }
        let result = {
          "lang" : langArr,
          "elem": this.elems
        };
        this.langs.push(result);
        this.elems = [];
      }
      let obj = {
        "name": item['NAME'],
        "forms": this.langs,
      };
      this.sites.push(obj);
      this.langs = [];
    }
  };

  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }


}
