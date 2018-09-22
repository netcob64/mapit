import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { ItAsset } from './core/models/it-asset';
import { ItApplication } from './core/models/it-application';
import { ItMap } from './core/models/it-map';
import { TabContentType } from './core/models/tab-content-type';
import { ItMetamodel } from './core/models/it-metamodel';
import { DataService } from './core/services/data.service';
import { DataServiceDataType } from './core/services/data.service.data.type';

class TabContent {
  type: TabContentType;
  content: any;
  label: string
}

@Component({
  selector: 'gui-ctrl',
  template: ``
})

export class GuiCtrlComponent {
  me: GuiCtrlComponent = this;
  @Input() app: AppComponent;

  test: boolean = true;

  constructor(private dataService: DataService) {
    dataService.guiCtrl = this;
    var newTab: TabContent = {
      type: TabContentType.TXT,
      label: 'Welcome',
      content: {
        name: 'Welcome',
        html: `<h1>Welcome</h1>
      <h3>TODO</h3>
      <ul>
        <li>mxGraph Management base sur les evt CELLS_ADDED...</li>
        <li>Bug affichage quand Zoom Chrom actif....</li>
        <li>Geston de l'objet meta model...: <b>revoir l'IHM des gestion des attr system</b></li>
        <li>Angular Material Tree component pour list des app?</li>
        <li>Authentification</li>
        <li>Gestion des version des objet</li>
        <li>Parametrage de la visu des graph en fonction de la date</li>
      </ul>
    </div>`
      }
    };
    this.AddTabContent(newTab);
    //this.ShowError('coucou');
  }

  GetApplicationByName(appName): ItApplication {
    return this.applications.find(function(app) { return app.name == appName; });
  }
  GetApplicationTitle(): string {
    return this.app.title;
  }

  //-------------------------
  // SideNav contrrol
  //-------------------------
  sidenavIsOpen: boolean = true;
  SidenavShowHide() {
    this.sidenavIsOpen = !this.sidenavIsOpen;
  }
  IsSidenavIsOpen(): boolean {
    return this.sidenavIsOpen;
  }

  //-------------------------
  // Meta model management
  //-------------------------
  metamodels: ItMetamodel[];
  AddNewMetamodel() {
    this.AddMetamodelTab('NEW META MODEL');
  }

  EditMetamodel(model: ItMetamodel) {
    console.log(JSON.stringify(model));
    this.AddMetamodelTab(model);
  }

  MetamodelSaved(model: ItMetamodel, isNew: boolean) {
    if (isNew) {
      this.metamodels = this.metamodels.concat(model);
    } else {
      this.metamodels = this.metamodels.filter(a => a !== model).concat(model);
    }
  }

  DeleteMetamodel(model: ItMetamodel) {
    console.log("Delete model id=" + model.id + ", name=" + model.name);
    this.dataService.SetDataType(DataServiceDataType.META_MODEL);
    this.dataService.Delete(model).subscribe(data => this.DeleteMetamodelDataHandler(data));
  }

  DeleteMetamodelDataHandler(data: any): void {
    if (data.status == 'success') {
      this.metamodels = this.metamodels.filter(a => a.id !== data.id);
    } else {
      this.ShowError(data.message);
    }
  }

  GetMetamodels(): void {
    // transform Observable<ItApplication[]> to ItApplication[]
    this.dataService.SetDataType(DataServiceDataType.META_MODEL);
    this.dataService.Get().subscribe(data => this.GetMetamodelsDataHandler(data));
  }

  GetMetamodelsDataHandler(data: any): void {
    this.AddMessage('GetMetamodelsDataHandler: ' + JSON.stringify(data));
   
     if (data['data']!=undefined){
      this.metamodels =data['data'].map(jsonApp => new ItMetamodel().setFromJson(jsonApp));
    }
  }
  //-------------------------
  // Login management
  //-------------------------
  first: boolean = true;

  Login(login: string, password: string): boolean {
    this.first = false;
    console.log('First: ' + this.first);
    console.log('Login: ' + login);
    console.log('Password: ' + password);
    if (login == "cob" && password == "cob") {
      this.app.logged = true;
      sessionStorage.setItem('access_token', 'fddf');
    } else {
      this.app.logged = false;

    }
    return this.app.logged;
  }

  Logout(): void {
    sessionStorage.removeItem('auth_token');
    this.app.logged = false;
    this.first = true;
  }
  //-------------------------
  // Tabs management
  //-------------------------
  tabs: TabContent[] = [];
  activeTab: TabContent;
  activeTabIndex: number = 0;

  private AddApplicationTab(appref: string | ItApplication): void {
    var app: ItApplication;

    if (typeof appref == 'string') {
      app = new ItApplication();
      app.name = appref;
    } else {
      app = appref;
    }
    var newTab: TabContent = {
      type: TabContentType.APP,
      content: app,
      label: app.name
    };
    this.AddTabContent(newTab);
  }

  private AddMapTab(app: ItApplication, mapref: string | ItMap): void {
    var map: ItMap;

    if (typeof mapref == 'string') {
      map = new ItMap(app);
      map.name = mapref;
    } else {
      map = mapref;
    }
    var newTab: TabContent = {
      type: TabContentType.MAP,
      content: map,
      label: app.name + ' : ' + map.type + ': ' + map.name
    };
    this.AddTabContent(newTab);
  }

  private AddMetamodelTab(objClass: string | ItMetamodel): void {
    var obj: ItMetamodel;

    if (typeof objClass == 'string') {
      obj = new ItMetamodel();
      obj.name = objClass;
    } else {
      obj = objClass;
    }
    //console.log(JSON.stringify(obj));

    var newTab: TabContent = {
      type: TabContentType.META_MODEL,
      content: obj,
      label: obj.name
    };
    this.AddTabContent(newTab);
  }

  private AddTabContent(tabContent: TabContent): void {
    this.activeTab = tabContent;
    this.activeTabIndex = this.tabs.length;
    this.tabs = this.tabs.concat(tabContent);
  }

  DeleteTabContent(tabContent: TabContent): void {
    this.tabs = this.tabs.filter(tc => tc !== tabContent);
    this.activeTab = this.tabs[0];
  }

  //-------------------------
  // ItMap management
  //-------------------------

  maps: ItMap[];
  MapSaved(map: ItMap, isNew: boolean) {
    if (isNew) {
      this.maps = this.maps.concat(map);
    } else {
      this.maps = this.maps.filter(a => a !== map).concat(map);
    }
  }
  //-------------------------
  // ItApplication management
  //-------------------------
  applications: ItApplication[];

  AddNewApplication() {
    this.AddApplicationTab('APP_NEW');
  }

  EditApplication(application: ItApplication) {
    console.log(JSON.stringify(application));
    this.AddApplicationTab(application);
  }

  ApplicationSaved(application: ItApplication, isNew: boolean) {
    if (isNew) {
      this.applications = this.applications.concat(application);
    } else {
      this.applications = this.applications.filter(a => a !== application).concat(application);
    }
  }

  DeleteApplication(application: ItApplication) {
    console.log("Delete app id=" + application.id + ", name=" + application.name);
    this.dataService.SetDataType(DataServiceDataType.APPLICATION);
    this.dataService.Delete(application).subscribe(data => this.DeleteApplicationDataHandler(data));
  }

  DeleteApplicationDataHandler(data: any): void {
    if (data != undefined && data.status == 'success') {
      this.applications = this.applications.filter(a => a.id !== data.id);
    } else if (data == undefined) {
      this.ShowError('error trying to delete app');
    } else {
      this.ShowError(data.message);
    }
  }

  GetApplications(): void {
    // transform Observable<ItApplication[]> to ItApplication[]
    this.dataService.SetDataType(DataServiceDataType.APPLICATION);
    this.dataService.Get().subscribe(data => this.GetApplicationDataHandler(data));
  }

  GetApplicationDataHandler(data: any): void {

    this.AddMessage('GetApplicationDataHandler: ' + JSON.stringify(data));
    if (data['data']!=undefined){
      //this.AddMessage('GetApplicationDataHandler: ' + JSON.stringify(data));
      this.applications =data['data'].map(jsonApp => new ItApplication().setFromJson(jsonApp));
    }
  }

  AddNewApplicationMap(application: ItApplication) {
    this.AddMapTab(application, 'MAP_NEW');
  }
  //------------
  // Trace, Debug, Error
  //------------
  nbError: number = 0;
  ShowError(error: string) {
    this.nbError++;
    this.AddMessage('<span class="error"><b>ERROR >>> </b>' + error + '</span>');
    //console.error("ERROR >>> " + error);
  }

  footerMessage: string = "";
  // TRACE IN gui
  AddMessage(msg: string): void {
    var s: string = this.footerMessage.substring(0, 10000);
    this.footerMessage = '<p>' + msg + '</p>' + s;

  }

  ClearMessage(): void {
    this.footerMessage = '';
    this.nbError = 0;
  }

  debugIsVisible: boolean = false;

  DebugShowHide(): boolean {
    this.debugIsVisible = !this.debugIsVisible;
    return this.debugIsVisible;
  }
}
