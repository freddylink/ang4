import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { ServerService } from "../../server.service";
import { NavigationService } from "../../navigation.service";
import 'rxjs/add/operator/share';

interface areaCurrent {
  area: object
}

interface newForm {
  site: string,
  id: number,
  operator: string,
  name: string,
  data: string,
  aim: string,
  email: string
  contacts: string
}

@Component({
  selector: 'app-form-add',
  templateUrl: './form-add.component.html',
  styleUrls: ['./form-add.component.css']
})

export class NewFormComponent implements OnInit, OnChanges  {
  @ViewChild('form') form: NgForm;
  initial: boolean = false;
  areaCurrent: areaCurrent[] = [];
  currentLangSection = '';
  currentLangArr = [];
  newForm: newForm[] = [];
  formList: object = [];
  hideForm: boolean = false;
  @Input() states: boolean;
  statusOwner: boolean = false;
  statusInfo: boolean = false;
  createLink: string;
  name: string;
  data: string;
  aim: string;
  code: string;
  idLanguage;
  object;
  tlName;
  tlEmail;
  tlContacts;
  templateList = [];
  whoOwner = [];

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnChanges() {
    if (this.initial === true) {
      this.refreshValues();
    }
  }

  ngOnInit() {
    this.serverService
      .siteGet()
      .subscribe((area: areaCurrent[])=> {
        this.areaCurrent = area['object'];
      });
    //получаем список шаблонов
    this.serverService
      .templateGet()
      .subscribe(json => {
        this.object = json;
     });
    this.initial = true;
  }

  parseTemplate(lang) {
    if (this.object.length > 1) {
      for (let key in this.object) {
        let item = JSON.parse(this.object[key]);
        if (item.language === lang) {
          return item;
        }
      }
    } else {
      return JSON.parse(this.object);
    }
  }

  settingsLanguage(lang) {
    let currentLang = lang.split(',')[1];
    this.idLanguage = lang.split(',')[0];
    let activeTemplate = this.parseTemplate(currentLang);
    this.tlName = activeTemplate.autofill.tlInfo.tlName;
    this.tlEmail = activeTemplate.autofill.tlInfo.tlEmail;
    this.tlContacts = activeTemplate.autofill.tlInfo.tlContacts;
    this.whoOwner = [activeTemplate.autofill.tlInfo.tlName, "Владелец сайта"];
    this.code = activeTemplate['number'];
    this.templateList = [];
    for (let item in activeTemplate.autofill) {
      if (item.indexOf('pattern') !== -1) {
        this.templateList.push(activeTemplate.autofill[item]);
      }
    }
  }


  //установка владельца сайта TL или другая
  inputOwner(owner) {
    if (owner === "1") {
      this.statusOwner =  true;
    } else {
      this.statusOwner =  false;
    }
  }

  //обновляем форму
  refreshValues() {
    this.statusOwner =  false;
    this.hideForm = false;
    this.templateList = [];
    this.form.reset();
    this.ngOnInit();
  }

  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }

  //выбор площадки для формы, получениние существующих языковых версий
  getId(event: Event) {
    this.currentLangSection = (<HTMLInputElement>event.target).value;
    for (let key in this.areaCurrent) {
      let item = this.areaCurrent[key];
      if (item['ID'] && item['ID'] == this.currentLangSection) {
        this.currentLangArr = this.areaCurrent[key]['subsection'];
        break;
      }
    }
    this.getListForm(this.currentLangSection);
  }

  //получаем список уже созданных форм для выбранной площадке
  getListForm(id) {
    let obj = {"id" : id };
    console.log(JSON.stringify(obj));
    this.serverService
      .formGet(JSON.stringify(obj))
      .subscribe((json)=> {
        this.formList = json.object;
      });
  }

  showLink(response) {
    console.log(response.object);
    this.createLink = response.object;
  }
  //автозаполнение формы
  getTemplate(name) {
    let activeTemplate = this.templateList.find(function(item) {
      return item.name === name;
    });
    for (let key in this.form.controls) {
      if(activeTemplate[key]) {
        this.form.controls[key].setValue(activeTemplate[key]);
      }
    }
  }

  //показывать/скрывать список созданных форм
  infoAdd() {
    if (this.statusInfo === false) {
      this.statusInfo = true;
    }
    else {
      this.statusInfo = false;
    }
  }

  submitForm(form: NgForm) {
    this.newForm = this.form.value;
    if (this.newForm['operator'] === "0") {
      this.newForm['operator_name'] = this.tlName;
      this.newForm['id'] = this.idLanguage;
      this.newForm['email'] = this.tlEmail;
      this.newForm['contacts'] = this.tlContacts;
    }
    this.newForm['code'] = this.code;
    console.log(this.newForm);

    this.serverService
      .formAdd(JSON.stringify(this.newForm))
      .subscribe((json)=>{
        this.showLink(json);
      })
    ;

    this.hideForm = true;
  }
}
