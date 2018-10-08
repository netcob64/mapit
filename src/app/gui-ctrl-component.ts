import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { ItAsset } from './core/models/it-asset';
import { ItApplication } from './core/models/it-application';
import { ItMap } from './core/models/it-map';
import { ItMessage } from './core/models/it-message';
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
    return 'app: ' + this.content.GetName();
    } else if (this.content instanceof ItMetamodel) {
    return 'class: ' + this.content.GetName();
    } else if (this.content instanceof ItMap) {
    return 'map[' + this.content.GetType() + ']: ' + this.content.GetName() + ' (' + this.content.getAsset().GetName() + ')';
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
  //applications: ItApplication[];
  //maps: ItMap[];
  metamodels(): Map < string,  ItAsset > { return this.objectClassIndex.get(this.IT_METAMODEL_CLASS_NAME); }
  test: boolean = true;

  /* TODO: initialize from Database */
  public IT_METAMODEL_CLASS_NAME: string = (new ItMetamodel()).GetClassName();
  public IT_APPLICATION_CLASS_NAME: string = (new ItApplication()).GetClassName();
  public IT_MAP_CLASS_NAME: string = (new ItMap()).GetClassName();
  public IT_MESSAGE_CLASS_NAME: string = (new ItMessage()).GetClassName();

  constructor(private dataService: DataService) {
    this.objectClassIndex = new Map();
    //this.metamodels = [];    
    //this.applications = [];
    //this.maps = [];
    this.objectClassIndex.set(this.IT_APPLICATION_CLASS_NAME, new Map());
    this.objectClassIndex.set(this.IT_METAMODEL_CLASS_NAME, new Map());
    this.objectClassIndex.set(this.IT_MAP_CLASS_NAME, new Map());
    this.objectClassIndex.set(this.IT_MESSAGE_CLASS_NAME, new Map());

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
        
          <li>supprimer une tab quand l'objet est detruit par app-list ou metamodel-list...</li>
        </ul>
      </h2>
      <ul>     
      <li>
      voir https://medium.com/@mail.bahurudeen/create-a-dynamic-form-with-configurable-fields-and-validations-using-angular-6-994db56834da
      pour la gestion de form dynamiques ou http://jasonwatmore.com/post/2018/05/10/angular-6-reactive-forms-validation-example</li>   
        <li><b>Map:</b> chargement depuis BDD</li>
        <li><b>Map:</b>Parametrage de la visu des graph en fonction de la date</li>
        <li><b>Map:</b>Bug affichage mxGrpah quand Zoom Chrome actif....</li>
        <li><b>Map:</b>Bouton Zoom</li>
        <li><b>Map:</b>Print, Print setup, Preview</li>
        <li><b>Map:</b>add ANALitics funtion -> graph of dependencies...</li>
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
    let assets: Array<ItAsset> = [...this.objectClassIndex.get(className).values()];
    let asset : ItAsset = assets.find(asset => asset.GetId() == id);
    return asset.GetName();
  } 

  GetAssetFromID(className: string, id: number) : ItAsset {
    let assets: Array<ItAsset> = [...this.objectClassIndex.get(className).values()];
    return assets.find(asset => asset.GetId() == id);
  }
  /**
  *
  */
  GetAssetByName(className: string, name: string): ItAsset {
    return this.objectClassIndex.get(className).get(name);
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

  GetItMaps() {
    return this.GetItAssets(this.IT_MAP_CLASS_NAME);
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
      object.SetName(obj);
    } else {
      object = obj;
    }

    this.AddTabContent(this.tabContentTypeForClass[object.GetClassName()], object);
  }

  EditItAsset(asset: ItAsset) {
    //console.log('EditMetamodel() - ', inspect(asset));
    this.AddItAssetTab(asset);
  }

  ItAssetSaved(newAsset: ItAsset, oldAsset: ItAsset) {
    //console.log('ItAssetSaved => asset ',inspect(asset));
    console.log('ItAssetSaved => asset ', newAsset.GetName(), oldAsset.GetName());
    if (this.objectClassIndex.get(newAsset.GetClassName()).has(oldAsset.GetName())) {
      this.objectClassIndex.get(newAsset.GetClassName()).delete(oldAsset.GetName());
    }
    this.objectClassIndex.get(newAsset.GetClassName()).set(newAsset.GetName(), newAsset);
  }

  private dataServiceTypeForClass = {
    "ItApplication": DataServiceDataType.APPLICATION,
    "ItMetamodel": DataServiceDataType.META_MODEL,
    "ItMap": DataServiceDataType.MAP,
  }

  DeleteItAsset(asset: ItAsset) {
    console.log("Delete model id=" + asset.GetId() + ", name=" + asset.GetName());
    this.dataService.SetDataType(this.dataServiceTypeForClass[asset.GetClassName()]);
    this.dataService.Delete(asset).subscribe(data => this.DeleteItAssetDataHandler(data, asset));
  }

  DeleteItAssetDataHandler(data: any, asset: ItAsset): void {
    if (data != undefined && data.status == 'success') {
      //this.metamodels = this.metamodels.filter(a => a.id !== data.id);
      this.objectClassIndex.get(asset.GetClassName()).delete(asset.GetName());
      let tc : TabContent = this.SearchTabContent(this.tabContentTypeForClass[asset.GetClassName()], asset);
      this.DeleteTabContent(tc);
    } else if (data != undefined) {
      this.ShowError(data.message);
    } else {
      this.ShowError('Error: DB issue, trying to delete ' + asset.GetClassName() + ' '+ asset.GetName());
    }
  }

  LoadItAssets(assetClass: any) : void {
    this.dataService.SetDataType(this.dataServiceTypeForClass[(new assetClass()).GetClassName()]);
    this.dataService.Get().subscribe(data => this.LoadItAssetsDataHandler(data, assetClass));
  }
  
  LoadItAssetsDataHandler(data: any, assetClass: any): void {
    var asset:ItAsset= new assetClass();
    this.ShowMessage('LoadItAssetsDataHandler(): asset class = ' + asset.GetClassName()+ ' - data : ' + inspect(data));
    if (data['data'] != undefined) {
      data['data'].forEach(jsonData => this.objectClassIndex.get(asset.GetClassName()).set(jsonData.name, (new assetClass()).SetFromJson(jsonData)));
      console.log('LoadItAssetsDataHandler() - '+asset.GetClassName()+'(s) loaded!');
    } else {
      this.ShowError('Error: DB issue, trying to get metamodels');
    }
  }

  //-------------------------
  // ItMap management
  //-------------------------
  RegisterMessage(message: ItAsset) : void {
    let messages : Array<ItAsset> = [...this.objectClassIndex.get(this.IT_MESSAGE_CLASS_NAME).values()];
    let existingMessage = messages.find(msg => message.IsEqual(msg));
    if (existingMessage==undefined) {
      this.objectClassIndex.get(this.IT_MESSAGE_CLASS_NAME).set(message.GetName(), message);
    }
  }
  //-------------------------
  // ItApplication management
  //-------------------------
  AddNewApplication() {
    this.AddItAssetTab('NEW_APP', ItApplication);
  }

  AddNewApplicationMap(application: ItApplication) {
    this.AddMapTab(application, 'MAP_NEW');
  }
  //-------------------------
  // Tabs management
  //-------------------------
  tabs: TabContent[] = [];
  activeTab: TabContent;
  activeTabIndex: number = 0;

/*
  private AddApplicationTab(appref: string | ItApplication): void {
    var app: ItApplication;

    if (typeof appref == 'string') {
      app = new ItApplication();
      app.SetName(appref);
    } else {
      app = appref;
    }

    this.AddTabContent(TabContentType.APP, app);
  }
*/
  private AddMapTab(app: ItApplication, mapref: string | ItMap): void {
    var map: ItMap;

    if (typeof mapref == 'string') {
      map = new ItMap(app);
      map.SetName(mapref);
    } else {
      map = mapref;
    }

    this.AddTabContent(TabContentType.MAP, map);
  }

  private AddTabContent(tabType: TabContentType, asset:ItAsset|Object): void {
    let tab : TabContent;
    let assName : string = (asset instanceof ItAsset? asset.GetName() :"");

    // search if asset is already open in a tab
    let index = this.tabs.findIndex(elt => {
      return elt.type == tabType && (assName=="" || assName == elt.content.GetName())
    });
    //console.log('index='+index);
    if (index < 0) {
      // not found -> create new tab
      tab = new TabContent(tabType, asset);
      this.activeTab = tab;
      this.activeTabIndex = this.tabs.length;
      this.tabs = this.tabs.concat(tab);
      if (asset instanceof ItAsset) {
        // add asset in asset list
        this.objectClassIndex.get(asset.GetClassName()).set(asset.GetName(), asset);
      }
    } else {
      // found -> show the tab
      this.activeTabIndex = index;
    }
  }

  private SearchTabContent(tabType: TabContentType, asset: ItAsset | Object): TabContent {
    let assName: string = (asset instanceof ItAsset ? asset.GetName() : "");
    // search if asset is already open in a tab
    return this.tabs.find(elt => {
      return elt.type == tabType && (assName == "" || assName == elt.content.GetName())
    });
  
  }

  DeleteTabContent(tabContent: TabContent): void {
    if (tabContent!=undefined){
      this.tabs = this.tabs.filter(tc => tc !== tabContent);
      this.activeTab = this.tabs[0];
    }
  }

  //------------
  // Trace, Debug, Error
  //------------
  nbError: number = 0;
  ShowError(error: string) {
    this.nbError++;
    this.ShowMessage('<span class="error"><b>ERROR >>> </b>' + error + '</span>');
    console.error("ERROR >>> " + error);
  }

  footerMessage: string = "";
  // TRACE IN gui
  ShowMessage(msg: string): void {
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
