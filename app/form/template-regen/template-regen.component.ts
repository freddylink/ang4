import { Component, OnInit, OnChanges, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ServerService} from "../../server.service";
import {NavigationService} from "../../navigation.service";

@Component({
  selector: 'app-template-regen',
  templateUrl: './template-regen.component.html',
  styleUrls: ['./template-regen.component.css']
})
export class TemplateRegenComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  hideForm: boolean = false;
  hideBlock: boolean = true;
  hideCheckAll: boolean = false;
  object;
  itemRegen;
  preloaderForm: boolean = false;
  templates = [];
  code: string;
  elements;

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnInit() {
    this.serverService
      .templateGet()
      .subscribe(json => {
        this.object = json;
        this.chooseTemplate();
      });
  }

  loadTemplate(value) {
    let language = value.split(',')[0];
    if (language === "Русская версия") {
      this.code = "ru";
    }
    if (language === "English version") {
      this.code = "en";
    }
    this.hideCheckAll = true;
    this.hideBlock = true;
    this.loadElements(this.code);
  }

  loadElements(code) {
    let obj = {"code": code};

    this.serverService
      .elemLoad(JSON.stringify(code))
      .subscribe(json => {
        this.parseElements(json.object);
      });
  }

  parseElements(obj) {
    this.elements = obj;
    console.log(this.elements);
  }

  checkAll() {
    for (let key in this.form.controls) {
      if(key.indexOf('checkbox-') !== -1) {
        if (this.form.controls[key].value === true) {
          this.form.controls[key].setValue(false);
        } else {
          this.form.controls[key].setValue(true);
        }
      }
    }
  }

  //парсер шааблонов из папки upload
  chooseTemplate() {
    if (this.object.length > 1) {
      for (let key in this.object) {
        let item = JSON.parse(this.object[key]);
        this.templates.push([item["language"], item["number"]]);
      }
    } else {
      //реализовать когда 1 вариант шаблона
      let item = JSON.parse(this.object);
      this.templates.push(item["language"], item["number"]);
    }
  }

  ngOnChanges() {
    this.refreshValues();
  }

  refreshValues() {
    this.hideForm = false;
    this.hideBlock = false;
    this.hideCheckAll = false;
    this.form.reset();
  }


  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }

  regenerateList(value) {
    console.log(this.elements);
    let checkbox = [];
    let pdfLink = {};
    for (let elem in value) {
      if (elem.indexOf('checkbox-') !== -1 && value[elem] === true) {
        elem = elem.replace('checkbox-', '');
        checkbox.push(elem);
      }
    }

    for (let item in checkbox) {
      for (let key in this.elements) {
        if (this.elements[key]['ID'] === checkbox[item]) {
          for (let langArr of this.elements[key]['subsection']) {
            for (let form of langArr['elems']) {
              pdfLink[form['ID']] = form['PROPERTY_PDF_LINK_VALUE'];
            }
          }
        }
      }
    }
    //console.log(pdfLink);
    return pdfLink;
  }

  submitForm(form: NgForm) {
    console.log(form);
    this.preloaderForm = true;
    let resultBox = {};
    let result = this.regenerateList(form.value);
    resultBox['code'] = this.code;
    resultBox['forms'] = result;
    this.itemRegen = result;
    console.log(resultBox);

    this.serverService
      .pdfLinkSend(JSON.stringify(resultBox))
      .subscribe((json)=>{
        while (!json) {

        }
        this.preloaderForm = false;
        console.log(json);
        this.hideForm = true;
      })
    ;

  }

}
