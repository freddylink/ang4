import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';


@Injectable()

export class ServerService {
  constructor(private http: Http) {

  }

  getAccess(data:string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/get-access.php', data)
      .map((response: Response) => response.json());
  }

  siteGet() {
    return this.http.get('http://example.ru/local/templates/common/ajax/site-current.php')
      .map((response: Response) => response.json());
  }

  siteAdd(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/site-add.php', data)
      .map((response: Response) => response.json());
  }

  siteEdit(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/site-edit.php', data)
      .map((response: Response) => response.json());
  }

  siteDelete(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/site-delete.php', data)
      .map((response: Response) => response.json());
  }

  elemGet(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/element-get.php', data)
      .map((response: Response) => response.json());
  }

  elemLoad(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/element-load.php', data)
      .map((response: Response) => response.json());
  }

  formAdd(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/form-add.php', data)
      .map((response: Response) => response.json());
  }

  formGet(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/form-get.php', data)
      .map((response: Response) => response.json());
  }

  formGetAll() {
    return this.http.get('http://example.ru/local/templates/common/ajax/form-get-all.php')
      .map((response: Response) => response.json());
  }

  formEdit(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/form-edit.php', data)
      .map((response: Response) => response.json());
  }

  formDelete(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/form-delete.php', data)
      .map((response: Response) => response.json());
  }

  templateGet() {
    return this.http.get('http://example.ru/local/templates/common/ajax/template-get.php')
      .map((response: Response) => response.json());
  }

  templateSend(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/template-send.php', data)
      .map((response: Response) => response.json());
  }

  pdfLinkSend(data: string) {
    return this.http.post('http://example.ru/local/templates/common/ajax/pdfLink-send.php', data)
      .map((response: Response) => response.json());
  }

}
