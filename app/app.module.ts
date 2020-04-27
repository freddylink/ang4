import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MainFormComponent } from './form/site-add/site-add.component';
import { NewFormComponent } from './form/form-add/form-add.component';
import { HttpModule } from '@angular/http';
import {ServerService} from "./server.service";
import {NavigationService} from "./navigation.service";
import { EditFormComponent } from './form/form-edit/form-edit.component';
import { DeleteFormComponent } from './form/form-delete/form-delete.component';
import { SiteDeleteComponent } from './form/site-delete/site-delete.component';
import { FormViewComponent } from './form/form-view/form-view.component';
import { FormFilterPipe } from './form/form-view/form-filter.pipe';
import {AppRoutingModule} from "./app-routing.module";
import { FormComponent } from './form/form.component';
import {AuthModule} from "./auth/auth.module";
import {AuthService} from "./auth.service";
import {CookieService} from "./cookie.service";
import { TemplateEditorComponent } from './form/template-editor/template-editor.component';
import {TemplateKeysPipe} from "./form/template-editor/template-keys.pipe";
import { TemplateRegenComponent } from './form/template-regen/template-regen.component';
import { SiteEditComponent } from './form/site-edit/site-edit.component';
import {LoaderComponent} from "./form/loader/loader.component";

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    NewFormComponent,
    EditFormComponent,
    DeleteFormComponent,
    SiteDeleteComponent,
    FormViewComponent,
    FormFilterPipe,
    TemplateKeysPipe,
    FormComponent,
    TemplateEditorComponent,
    TemplateRegenComponent,
    SiteEditComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [ServerService, NavigationService, AuthService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
