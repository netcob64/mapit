import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { ItAsset } from './core/models/it-asset';
import { ItApplication } from './core/models/it-application';
import { ItMap } from './core/models/it-map';
import { TabContentType } from './core/models/tab-content-type';
import { ItMetamodel } from './core/models/it-metamodel';
import { DataService } from './core/services/data.service';
import { DataServiceDataType } from './core/services/data.service.data.type';
import { GraphObjectFactory } from './core/mxgraph/mx.graph';
import { inspect } from 'util';

class TabContent {
  type: TabContentType;
  content: ItAsset | any;
  constructor(type: TabContentType, content: ItAsset | any) {
    this.type = type;
    this.content = content;
  }
  getLabel(): string {
    if (this.content instanceof ItApplication) {
      return 'app: ' + this.content.name;
    } else if (this.content instanceof ItMetamodel) {
      return 'class: ' + this.content.name;
    } else if (this.content instanceof ItMap) {
      return 'map[' + this.content.type + ']: ' + this.content.name + ' (' + this.content.getAsset().name + ')';
    } else {
      return this.content.name;
    }
  }
}




@Component({ selector: 'gui-ctrl', template: `` })
export class GuiCtrlComponent implements GraphObjectFactory {
  me: GuiCtrlComponent = this;
  @Input() app: AppComponent;
  objectClassIndex: Map < string,
  Map < string,
  ItAsset >> ;
  //metamodels: ItMetamodel[];
  applications: ItApplication[];
  maps: ItMap[];
  metamodels(): Map < string,  ItAsset > { return this.objectClassIndex.get(this.IT_METAMODEL_CLASS_NAME); }
  test: boolean = true;

  /* TODO from Database */
  public IT_METAMODEL_CLASS_NAME: string = (new ItMetamodel()).getClassName();
  public IT_APPLICATION_CLASS_NAME: string = (new ItApplication()).getClassName();
  public IT_MAP_CLASS_NAME: string = (new ItMap()).getClassName();

  constructor(private dataService: DataService) {
    this.objectClassIndex = new Map();
    //this.metamodels = [];    
    this.applications = [];
    this.maps = [];
    this.objectClassIndex.set(this.IT_APPLICATION_CLASS_NAME, new Map());
    this.objectClassIndex.set(this.IT_METAMODEL_CLASS_NAME, new Map());
    this.objectClassIndex.set(this.IT_MAP_CLASS_NAME, new Map());

    dataService.guiCtrl = this;

    this.AddTabContent(TabContentType.TXT, {
      name: 'Welcome',
      html: `<h1>Welcome</h1>
      <h3>TODO</h3>
      <h2>
        <ul>        
          <li>Passer ItApplication en generique comme Metamodel dans guiCtrl, applicaiton-list etc..</li>
          <li>permet de factoriser le code de guiCtrl..</li>
          <li>Finir la genericite mxgraph : GraphObject etc pour avoir des label et les editer sur tout type d'objet...</li>
        </ul>
      </h2>
      <ul>        
        <li><b>Map:</b> chargement depuis BDD</li>
        <li><b>Map:</b>Parametrage de la visu des graph en fonction de la date</li>
        <li><b>Map:</b>Bug affichage mxGrpah quand Zoom Chrome actif....</li>
        <li><b>Map:</b>Bouton Zoom</li>
        <li><b>Map:</b>Print, Print setup, Preview</li>
        <li>if an asset edition tab already exist don't create a new one...</li>
        <li>Gestion de l'objet meta model...: <b>revoir l'IHM de gestion des attr system</b></li>
        <li>Angular Material Tree component pour list des app?</li>        
        <li>Gestion des versions des objets et acces concurrents</li>
        <li>Gestion "not saved" pour app, graph, metamodel...
        <li>Authentification</li>
      </ul>
    </div>`
    });
    //this.ShowError('coucou');
  }

  GetLabelFor(className: string, id: number): string {
    return "guiCtrl.GetLabelFor - BUG TBD"; //this.objectClassIndex.get(className).objectIdIndex[id].getName();
  }
  /*GetApplicationByName(appName): ItApplication {
    return this.applications.find(function(app) { return app.name == appName; });
  }*/

  GetAssetByName(className: string, name: string): ItAsset {
    return this.objectClassIndex[className].find(function(asset) { return asset.name == name; });
  }
  GetItAssetNameIndex(className: string) : Map<string, ItAsset> {
    return this.objectClassIndex.get(className);
  }  
  GetItMetamodels() {
    return this.GetItAssets(this.IT_METAMODEL_CLASS_NAME);
  }

  GetItApplications() {
    return this.GetItAssets(this.IT_APPLICATION_CLASS_NAME);
  }

  GetItAssets(className: string) : Array<ItAsset> {
    if (this.objectClassIndex.has(className)){
      return Array.from(this.objectClassIndex.get(className).values());
    } else {
      return [];
    }
  }

  GetApplicationTitle(): string {
      return this.app.title;
    }

  //-------------------------
  // Meta model management
  //-------------------------

  AddNewMetamodel() {
    this.AddItAssetTab('NEW_METAMODEL', ItMetamodel);
  }

  private tabContentTypeForClass = {
    "ItApplication": TabContentType.APP,
    "ItMetamodel": TabContentType.META_MODEL,
    "ItMap": TabContentType.MAP,
  }

  /**
  * Add a Tab for an ItAsset edition
  * obj: string | ItAsset,   string for creation of a new ItAsset defined by its class (param: objClass)
  *                          or an instance of ItAsset
  * objClass ? : any         class of the object to be created
  */
  private AddItAssetTab(obj: string | ItAsset, objClass ? : any): void {
    var object: ItAsset;

    if (typeof obj == 'string') {
      object = new objClass();
      object.setName(obj);
    } else {
      object = obj;
    }

    this.AddTabContent(this.tabContentTypeForClass[object.getClassName()], object);
  }

  EditItAsset(asset: ItAsset) {
    //console.log('EditMetamodel() - ', inspect(asset));
    this.AddItAssetTab(asset);
  }

  ItAssetSaved(newAsset: ItAsset, oldAsset: ItAsset) {
    //console.log('ItAssetSaved => asset ',inspect(asset));
    console.log('ItAssetSaved => asset ', newAsset.getName(), oldAsset.getName());
    if (this.objectClassIndex.get(newAsset.getClassName()).has(oldAsset.getName())) {
      this.objectClassIndex.get(newAsset.getClassName()).delete(oldAsset.getName());
    }
    this.objectClassIndex.get(newAsset.getClassName()).set(newAsset.getName(), newAsset);
  }

  private dataServiceTypeForClass = {
    "ItApplication": DataServiceDataType.APPLICATION,
    "ItMetamodel": DataServiceDataType.META_MODEL,
    "ItMap": DataServiceDataType.MAP,
  }

  DeleteItAsset(asset: ItAsset) {
    console.log("Delete model id=" + asset.getId() + ", name=" + asset.getName());
    this.dataService.SetDataType(this.dataServiceTypeForClass[asset.getClassName()]);
    this.dataService.Delete(asset).subscribe(data => this.DeleteItAssetDataHandler(data, asset));
  }

  DeleteItAssetDataHandler(data: any, asset: ItAsset): void {
    if (data != undefined && data.status == 'success') {
      //this.metamodels = this.metamodels.filter(a => a.id !== data.id);
      this.objectClassIndex.get(asset.getClassName()).delete(asset.getName());
    } else if (data != undefined) {
      this.ShowError(data.message);
    } else {
      this.ShowError('Error: DB issue, trying to delete ' + asset.getClassName() + ' '+ asset.getName());
    }
  }

  LoadItAssets(assetClass: any) : void {
    this.dataService.SetDataType(this.dataServiceTypeForClass[(new assetClass()).getClassName()]);
    this.dataService.Get().subscribe(data => this.LoadItAssetsDataHandler(data, assetClass));
  }
  
  LoadItAssetsDataHandler(data: any, assetClass: any): void {
    var asset:ItAsset= new assetClass();
    this.AddMessage('LoadItAssetsDataHandler(): asset class = ' + asset.getClassName()+ ' - data : ' + inspect(data));
    if (data['data'] != undefined) {
      data['data'].forEach(jsonData => this.objectClassIndex.get(asset.getClassName()).set(jsonData.name, (new assetClass()).setFromJson(jsonData)));
      console.log('LoadItAssetsDataHandler() - '+asset.getClassName()+'(s) loaded!');
    } else {
      this.ShowError('Error: DB issue, trying to get metamodels');
    }
  }

  //-------------------------
  // ItMap management
  //-------------------------


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
  AddNewApplication() {
       this.AddItAssetTab('NEW_APP', ItApplication);
  }

/*
  EditApplication(application: ItApplication) {
    //console.log(inspect(application));
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
    this.dataService.Delete(application).subscribe(data => this.DeleteApplicationDataHandler(data, application));
  }

  DeleteApplicationDataHandler(data: any, applicaiton: ItApplication): void {
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

    this.AddMessage('GetApplicationDataHandler: ' + inspect(data));
    if (data['data'] != undefined) {
      //this.AddMessage('GetApplicationDataHandler: ' + JSON.stringify(data));
      this.applications = data['data'].map(jsonApp => new ItApplication().setFromJson(jsonApp));
    }
  }*/

  AddNewApplicationMap(application: ItApplication) {
    this.AddMapTab(application, 'MAP_NEW');
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

    this.AddTabContent(TabContentType.APP, app);
  }

  private AddMapTab(app: ItApplication, mapref: string | ItMap): void {
    var map: ItMap;

    if (typeof mapref == 'string') {
      map = new ItMap(app);
      map.name = mapref;
    } else {
      map = mapref;
    }

    this.AddTabContent(TabContentType.MAP, map);
  }

  private AddTabContent(tabType: TabContentType, asset:ItAsset|Object): void {
    let tab : TabContent;
    let assName : string = (asset instanceof ItAsset? asset.getName() :"");

    // search if asset is already open in a tab
    let index = this.tabs.findIndex(elt => {
      return elt.type == tabType && (assName=="" || assName == elt.content.getName())
    });
    //console.log('index='+index);
    if (index < 0) {
      // not found -> create new tab
      tab = new TabContent(tabType, asset);
      this.activeTab = tab;
      this.activeTabIndex = this.tabs.length;
      this.tabs = this.tabs.concat(tab);
    } else {
      // found -> show the tab
      this.activeTabIndex = index;
    }
  }

  DeleteTabContent(tabContent: TabContent): void {
    this.tabs = this.tabs.filter(tc => tc !== tabContent);
    this.activeTab = this.tabs[0];
  }

  //------------
  // Trace, Debug, Error
  //------------
  nbError: number = 0;
  ShowError(error: string) {
    this.nbError++;
    this.AddMessage('<span class="error"><b>ERROR >>> </b>' + error + '</span>');
    console.error("ERROR >>> " + error);
  }

  footerMessage: string = "";
  // TRACE IN gui
  AddMessage(msg: string): void {
    var s: string = this.footerMessage.substring(0, 10000);
    this.footerMessage = '<p>' + msg + '</p>' + s;
    //console.log(msg);
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
  // SideNav contrrol
  //-------------------------
  sidenavIsOpen: boolean = true;
  SidenavShowHide() {
    this.sidenavIsOpen = !this.sidenavIsOpen;
  }
  IsSidenavIsOpen(): boolean {
    return this.sidenavIsOpen;
  }
}
