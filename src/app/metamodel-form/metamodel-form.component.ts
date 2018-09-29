import { Component, OnInit, Input } from '@angular/core';
import { ItAssetStatus, ItAsset } from '../core/models/it-asset';
import { ItMetamodel } from '../core/models/it-metamodel';
import { ItMetamodelAttribute, ItMetamodelAttributeType } from '../core/models/it-metamodel-attribute';
import { ItMetamodelRelation } from '../core/models/it-metamodel-relation';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data.service.data.type';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { inspect } from 'util';

@Component({
  selector: 'app-metamodel-form',
  templateUrl: './metamodel-form.component.html',
  styleUrls: ['./metamodel-form.component.css']
})

export class MetamodelFormComponent  {

  @Input() guiCtrl: GuiCtrlComponent;
  @Input() model: ItMetamodel;
  error : boolean = false;
  errorMessage : string = null;
  prev: ItMetamodel;
  ItMetamodelAttributeTypeEnum = ItMetamodelAttributeType;
  ItAssetStatusEnum=ItAssetStatus;


  constructor(private dataService: DataService) {
  	dataService.SetDataType(DataServiceDataType.META_MODEL);
    this.prev=new ItMetamodel();
	}

  ngOnInit() {
    this.prev.clone(this.model);
    this.guiCtrl.AddMessage('attributes: ' + inspect(this.model.attributes));
  }

  CheckToBeSaved() : boolean {
    if (this.NotEqual(this.model , this.prev) || this.model.id == null) {
      return true; 
    } else {
      return false; 
    }
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
    if (this.CheckToBeSaved()) {
      this.dataService.Save(this.model).subscribe(data => this.SaveDataHandler(data));
    }
    /*
    this.model.attributes.forEach(function(element) {
      this.guiCtrl.AddMessage('\t'+inspect(element));
    }, this);
    this.guiCtrl.AddMessage('attributes: ');*/
  }

  SaveDataHandler(data: any): void {
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
      //console.log("SaveMetamodelDataHandler prev.name='"+this.prev.name+"' model.name='"+this.model.name+"'");
      this.guiCtrl.ItAssetSaved(this.model, this.prev);
      this.prev.clone(this.model);
    }
  }


  NotEqual(o1, o2): boolean {
    var equal : boolean;
    equal = inspect(o1).localeCompare(inspect(o2)) == 0;
    return !equal;
  }
}

