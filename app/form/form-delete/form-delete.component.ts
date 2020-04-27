import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../../server.service';
import { NavigationService } from "../../navigation.service";

interface areaCurrent {
  area: object
}

@Component({
  selector: 'app-form-delete',
  templateUrl: './form-delete.component.html',
  styleUrls: ['./form-delete.component.css']
})
export class DeleteFormComponent implements OnInit, OnChanges {
  @ViewChild('form') form: NgForm;
  @Input() states: boolean;
  hideForm: boolean = false;
  resultBox: object = {};
  currentLangSection = '';
  areaCurrent: areaCurrent[] = [];
  formList: object = [];
  currentLangArr = [];
  valueElem: string;
  pdf_link: string;

  constructor(private serverService: ServerService, private service: NavigationService){}

  ngOnInit() {
    this.serverService
      .siteGet()
      .subscribe((area: areaCurrent[])=> {
        this.areaCurrent =  area['object'];
      });
  }

  ngOnChanges() {
    this.refreshValues();
  }

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

  getListForm(id) {
    let obj = {"id" : id };

    this.serverService
      .formGet(JSON.stringify(obj))
      .subscribe((json)=> {
        this.formList = json.object;
      });

  }

  //получаем список полей из выбранного элемента для удаления
  editForm(value) {
    value = value.split(',');
    this.valueElem = value[0];
    let obj = {"id" : this.valueElem };
    console.log(this.valueElem);
    this.serverService
      .elemGet(JSON.stringify(obj))
      .subscribe((json)=> {
        console.log(json);
        this.fillForm(json);
    });
  }

  fillForm(form) {
    this.pdf_link = form.object.pdf_link;
  }

  refreshValues() {
    this.hideForm = false;
    this.form.reset();
    this.ngOnInit();
  }

  setState(currentState: string) {
    this.refreshValues();
    this.service.setState(currentState);
  }

  submitForm(form: NgForm) {
    this.resultBox = {id: this.valueElem, pdf_link: this.pdf_link};
    console.log(this.resultBox);
    this.serverService
      .formDelete(JSON.stringify(this.resultBox))
      .subscribe((json)=>{
        console.log(json);
      })
    ;
    this.hideForm = true;
  }

}
