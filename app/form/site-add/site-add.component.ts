import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../server.service';
import {NavigationService} from "../../navigation.service";

interface areaCurrent {
  area: object
}

@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.css']
})

export class MainFormComponent implements OnInit, OnChanges {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  areaCurrent: areaCurrent[] = [];
  statusLang: boolean;
  statusCopy: boolean;
  hideForm: boolean = false;

  resultBox: object = {};

  checkBoxList = [
    {
      name: "Русская версия",
      code: "ru"
    },
    {
      name: "English version",
      code: "en"
    },
    {
      name: "Українська версія",
      code: "ua"
    }
  ];

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnInit() {
    this.serverService
      .siteGet()
      .subscribe((area: areaCurrent[])=> {
        this.areaCurrent = area['object'];
      });
  }

  ngOnChanges() {
    this.refreshValues();
  }

  refreshValues() {
    this.hideForm = false;
    this.statusCopy = undefined;
    this.statusLang = undefined;
    this.form.reset();
    this.ngOnInit();
  }

  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }

  //проверка, что выбран хотя бы один язык
  checkLangList(languagesObj: Object) {
    let language = {};
    this.statusLang = false;
    for (let i = 0; i < this.checkBoxList.length; i ++) {
      for (let key in languagesObj) {
        if (languagesObj[key] === true && key === this.checkBoxList[i].code) {
          language[i] = {
            'name' : this.checkBoxList[i].name,
            'code' : this.checkBoxList[i].code
          };
          this.statusLang = true;
        }
      }
    }
    return language;
  }
  //проверка что имя площадки уникально
  checkCopySite(area) {
    this.statusCopy = true;
    for (let key in this.areaCurrent) {
      if (this.areaCurrent[key]["NAME"] === area) {
        this.statusCopy = false;
      }
    }
    return this.statusCopy;
  }

  submitForm(form: NgForm) {
    this.resultBox['langs'] = this.checkLangList(this.form.value.langs);
    this.statusCopy = this.checkCopySite(this.form.value.area);
    if (this.statusLang === true && this.statusCopy === true) {
      this.resultBox['areaName'] = this.form.value.area;
      //console.log(this.resultBox);
      this.serverService
        .siteAdd(JSON.stringify(this.resultBox))
        .subscribe((json)=>{
          console.log(json);
          this.hideForm = true;
          this.resultBox = {};
      });
    }
  }
}
