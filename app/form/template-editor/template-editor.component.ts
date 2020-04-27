import { Component, OnInit, OnChanges, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ServerService} from "../../server.service";
import {NavigationService} from "../../navigation.service";

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.css']
})
export class TemplateEditorComponent implements OnInit, OnChanges {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  hideForm: boolean = false;
  hideBlock: boolean = true;
  object;
  templates = [];
  current =  {};
  introduction;
  conclusion;
  partTemplate = [];
  patternTemplate = [];
  newTemplate;
  postVersion;
  autofill;
  tlInfo;

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnInit() {
    this.serverService
      .templateGet()
      .subscribe(json => {
        this.object = json;
        this.chooseTemplate();
      });
  }

  ngOnChanges() {
    this.refreshValues();
    if (JSON.stringify(this.object) === '{}') {
      this.templates = [];
      this.ngOnInit();
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
  //выбор шаблона
  loadTemplate(value) {
    this.postVersion = JSON.parse(this.object[value - 1]);
    this.parseTemplates(this.postVersion);
  }

  //подготовока шаблона для вывода на экран
  parseTemplates(object) {
    this.hideBlock = false;
    this.current = object.template;
    this.introduction = object.template.introduction;
    this.conclusion = object.template.conclusion;

    for (let key in this.current) {
      let keyString = key.replace(/[0-9]/, '');
      if (keyString === "part") {
        this.partTemplate.push(this.current[key]);
      }
    }

    this.autofill = object.autofill;
    this.tlInfo = object.autofill.tlInfo;
    for (let item in object.autofill) {
      let itemString = item.replace(/[0-9]/, '');
      if (itemString === "pattern") {
        this.patternTemplate.push(object.autofill[item]);
      }
    }
  }

  //обновляем форму при изменении шаблона
  refreshValues() {
    this.hideBlock = true;
    this.hideForm = false;
    this.introduction = {};
    this.conclusion = {};
    this.tlInfo = {};
    this.partTemplate = [];
    this.patternTemplate = [];
    this.form.reset();
  }

  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }

  //заполняем новый вариант шаблона
  fillTemplate(template) {
    let introduction = {};
    let conclusion = {};
    let tlInfo = {};
    for (let key in template) {
      if (key.indexOf('introduction-') !== -1) {
        let keyIntro = key.replace('introduction-', '');
        introduction[keyIntro] = template[key];
      }
      if (key.indexOf('conclusion-') !== -1) {
        let keyConclusion = key.replace('conclusion-', '');
        conclusion[keyConclusion] = template[key];
      }
      if (key.indexOf('tlInfo-') !== -1) {
        let keyInfo = key.replace('tlInfo-', '');
        tlInfo[keyInfo] = template[key];
      }
    }
    for (let element in this.autofill) {
      if (element === "tlInfo") {
        for (let info in this.autofill[element]) {
          if (this.autofill[element][info] !== tlInfo[info]) {
            this.autofill[element][info] = tlInfo[info];
          }
        }
      } else {
        for (let item in this.autofill[element]) {
          let index = element.replace(/\D/g, '');
          if (this.autofill[element][item] !== template[index+"pattern"+item]) {
            this.autofill[element][item] = template[index+"pattern"+item];
          }
        }
      }
    }
    //console.log(this.autofill);
    for (let name in this.current) {
      if (name === "introduction") {
        for (let intro in this.current[name]) {
          if (this.current[name][intro] !== introduction[intro]) {
            this.current[name][intro] = introduction[intro];
          }
        }
      } else if (name === "conclusion") {
        for (let elem in this.current[name]) {
          if (this.current[name][elem] !== conclusion[elem]) {
            this.current[name][elem] = conclusion[elem];
          }
        }
      } else {
        for (let item in this.current[name]) {
          let index = name.replace(/\D/g, '');
          if (this.current[name][item] !== template[index+item]) {
            this.current[name][item] = template[index+item];
          }
        }
      }
    }
    this.postVersion.template = this.current;
    this.postVersion.autofill = this.autofill;
    return this.postVersion;
  }

  submitForm(form: NgForm) {
    this.newTemplate = form.value;
    this.postVersion = this.fillTemplate(this.newTemplate);
    console.log(this.postVersion);
    this.serverService
      .templateSend(JSON.stringify(this.postVersion))
      .subscribe((json)=>{
        this.hideBlock = true;
        this.hideForm = true;
        console.log(json);
        this.object = {};
      })
    ;

  }
}
