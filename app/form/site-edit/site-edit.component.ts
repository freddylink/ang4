import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../server.service';
import {NavigationService} from "../../navigation.service";

interface areaCurrent {
  area: object
}

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
  styleUrls: ['./site-edit.component.css']
})
export class SiteEditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  areaCurrent: areaCurrent[] = [];
  statusLang: boolean;
  currentLangSection = '';
  currentLangArr = [];
  hideForm: boolean = false;
  hideBlock: boolean = false;
  resultBoxList = [];
  resultBox = [];
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

  getId(event: Event) {
    this.hideBlock = true;
    this.currentLangSection = (<HTMLInputElement>event.target).value;
    for (let key in this.areaCurrent) {
      let item = this.areaCurrent[key];
      if (item['ID'] && item['ID'] == this.currentLangSection) {
        this.currentLangArr = this.areaCurrent[key]['subsection'];
        break;
      }
    }
    this.checkLangTemplate();
  }

  checkLangTemplate() {
    let langs = [];
    let result = Object.assign([], this.checkBoxList);
    for (let key of this.currentLangArr) {
      langs.push(key['NAME']);
    }
    let i = 0;
    for (let elem of result) {
      for (let lang of langs) {
        if (elem.name === lang) {
          delete result[i];
        }
      }
      i++;
    }

    this.resultBoxList = Object.assign([], result.sort());
  }

  ngOnChanges() {
    this.refreshValues();
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

  refreshValues() {
    this.hideForm = false;
    this.hideBlock = false;
    this.statusLang = undefined;
    this.form.reset();
    this.ngOnInit();
  }

  submitForm(form: NgForm) {
    this.resultBox = this.form.value;
    this.resultBox['langs'] = this.checkLangList(this.form.value.langs);
    console.log(this.resultBox);
    this.serverService
      .siteEdit(JSON.stringify(this.resultBox))
      .subscribe((json)=>{
        console.log(json);
        this.hideForm = true;
        this.resultBox = [];
      });
  }

}
