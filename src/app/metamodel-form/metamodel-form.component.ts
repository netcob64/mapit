import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ItAssetStatus } from '../core/models/it-asset';
import { ItMetamodel } from '../core/models/it-metamodel';
import { ItMetamodelAttribute, ItMetamodelAttributeType } from '../core/models/it-metamodel-attribute';
import { ItMetamodelRelation } from '../core/models/it-metamodel-relation';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data.service.data.type';
import { GuiCtrlComponent } from '../gui-ctrl-component';

@Component({
  selector: 'app-metamodel-form',
  templateUrl: './metamodel-form.component.html',
  styleUrls: ['./metamodel-form.component.css']
})

export class MetamodelFormComponent implements AfterViewChecked, AfterViewInit {

  @Input() guiCtrl: GuiCtrlComponent;
  @Input() model: ItMetamodel;
  error : boolean = false;
  errorMessage : string = null;
  prev: ItMetamodel;
  isToBeSaved: boolean ;
  ItMetamodelAttributeTypeEnum = ItMetamodelAttributeType;
  ItAssetStatusEnum=ItAssetStatus;


  constructor(private dataService: DataService) {
  	dataService.SetDataType(DataServiceDataType.META_MODEL);
    this.isToBeSaved=false;
	}

  ngOnInit() {
    this.Clone();
    this.guiCtrl.AddMessage('attributes: ' + JSON.stringify(this.model.attributes));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.guiCtrl.AddMessage('CHANGE: ' + JSON.stringify(changes.model));
  }
  AddAttribute(event: Event) {
    var attr:ItMetamodelAttribute  = new ItMetamodelAttribute(ItMetamodelAttributeType.TXT,"","");
    this.model.attributes.push(attr);
  }
  DeleteAttribute(attr:ItMetamodelAttribute){
    this.model.attributes = this.model.attributes.filter(a => a !== attr);
  }
   AddRelation(event:Event) {
    var rel:ItMetamodelRelation  = new ItMetamodelRelation();
    this.model.relations.push(rel);
  }
  DeleteRelation(rel:ItMetamodelRelation){
    this.model.relations = this.model.relations.filter(r => r !== rel);
  }

  Save(): void {
    this.dataService.Save(this.model).subscribe(data => this.SaveMetamodelDataHandler(data));
    
    this.model.attributes.forEach(function(element) {
      this.guiCtrl.AddMessage('\t'+JSON.stringify(element));
    }, this);
    this.guiCtrl.AddMessage('attributes: ');
  }

  SaveMetamodelDataHandler(data: any): void {
    if (data == undefined) { 
      this.error = true;
      this.errorMessage = 'database error';
      this.guiCtrl.AddMessage(this.errorMessage);
    } else if (data.status != 'success') {
      this.error = true;
      this.errorMessage = data.message;
      this.guiCtrl.AddMessage(this.errorMessage);
    } else {
      var newObj: boolean = this.model.id != data.id;
      this.guiCtrl.AddMessage('MetamodelFormComponent::SaveMetamodelDataHandler: ' + (newObj ? 'CREATED' : 'UPDATED') + ' id=' + data.id);
      this.error=false;
      this.model.id = data.id;
      this.model.version = data.version;
      this.guiCtrl.MetamodelSaved(this.model, newObj);
      this.Clone();
    }
  }

  Clone(): void {
    this.isToBeSaved = false;
    this.prev = Object.assign({}, this.model);
  }
  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    //console.log('AfterViewInit');

  }

  ngAfterViewChecked() {
    //console.log('ngAfterViewChecked');
    //console.log('app: ' + JSON.stringify(this.application));

    //console.log('prev: ' + JSON.stringify(this.prev));
    if (this.NotEqual(this.model , this.prev) || this.model.id == null) {
      this.isToBeSaved = true; 
    } else {
      this.isToBeSaved = false; 
    }
  }
  NotEqual(o1, o2): boolean {
    var equal : boolean;
    equal = JSON.stringify(o1).localeCompare(JSON.stringify(o2)) == 0;
    return !equal;
  }
}

