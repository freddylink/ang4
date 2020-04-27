import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../server.service';
import { NavigationService } from "../../navigation.service";

interface areaCurrent {
  area: object
}

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css']
})
export class EditFormComponent implements OnInit, OnChanges {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  currentLangSection = '';
  areaCurrent: areaCurrent[] = [];
  formList: object = [];
  currentLangArr = [];
  resultBox: object = {};
  element = [];
  idLanguage;
  hideForm: boolean = false;
  operator_name: string;
  name: string;
  code;
  data: string;
  aim: string;
  email: string;
  pdf_link: string;
  contacts:  string;
  valueID: string;
  valueElem: string;
  createLink: string;

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnChanges() {
    this.refreshValues();
  }

  ngOnInit() {
    this.serverService
      .siteGet()
      .subscribe((area: areaCurrent[])=> {
        this.areaCurrent = area['object'];
      });
  }

  getId(event: Event) {
    if (this.currentLangSection) {
      this.clearValues();
    }
    this.currentLangSection = (<HTMLInputElement>event.target).value;
    for (let key in this.areaCurrent) {
      let item = this.areaCurrent[key];
      if (item['ID'] && item['ID'] == this.currentLangSection) {
        this.currentLangArr = this.areaCurrent[key]['subsection'];
        break;
      }
    }
  }

  settingsLanguage(lang) {
    let currentLang = lang.split(',')[1];
    if (currentLang === "English version") {
      this.code = 2;
    }
    if (currentLang === "Русская версия") {
      this.code = 1;
    }
    this.idLanguage = lang.split(',')[0];
    this.getListForm(this.idLanguage);
  }

  getListForm(id) {
    let obj = {"id" : id };
    this.serverService
      .formGet(JSON.stringify(obj))
      .subscribe((json)=> {
        this.formList = json.object;
      });
  }

  editForm(value) {
    value = value.split(',');
    this.valueID = value[1];
    this.valueElem = value[0];
    let obj = {"id" : this.valueElem };
    this.serverService
      .elemGet(JSON.stringify(obj))
      .subscribe((json)=> {
        this.fillForm(json.object);
      });
  }

  fillForm(form) {
    this.operator_name = form.operator_name;
    this.data = form.data;
    this.name = form.name;
    this.aim = form.aim;
    this.email = form.email;
    this.pdf_link = form.pdf_link;
    console.log(this.contacts);
    this.contacts = form.contacts;
  }

  refreshValues() {
    this.form.reset();
    this.hideForm = false;
    this.areaCurrent = [];
    this.formList = [];
    this.clearValues();
    this.ngOnInit();
  }

  clearValues() {
    this.operator_name = '';
    this.data = '';
    this.name = '';
    this.aim = '';
    this.email = '';
    this.pdf_link = '';
    this.contacts = '';
  }

  setState(currentState: string) {
    this.service.setState(currentState);
    this.refreshValues();
  }

  checkFields(form) {
    if (form.data == "" || form.data == null) {
      form.data = this.data;
    }
    if (form.operator_name == "" || form.operator_name == null) {
      form.operator_name = this.operator_name;
    }
    if (form.name == "" || form.name == null) {
      form.name = this.name;
    }
    if (form.aim == "" || form.aim == null) {
      form.aim = this.aim;
    }
    if (form.email == "" || form.email == null) {
      form.email = this.email;
    }
    if (form.pdf_link == "" || form.pdf_link == null) {
      form.pdf_link = this.pdf_link;
    }
    if (form.contacts == "" || form.contacts == null) {
      form.contacts = this.contacts;
    }
    form.site = this.currentLangSection;
    form.id = this.valueID;
    form.elem = this.valueElem;
    delete form.nameForm;

    return form;
  }

  submitForm(form: NgForm) {
    this.resultBox = this.form.value;
    this.resultBox = this.checkFields(this.resultBox);
    this.resultBox['code'] = this.code;
    console.log(this.resultBox);

    this.serverService
      .formEdit(JSON.stringify(this.resultBox))
      .subscribe((json)=>{
        console.log(json);
        this.createLink = json.object;
      })
    ;

    this.hideForm = true;
    this.resultBox = [];
  }

}
