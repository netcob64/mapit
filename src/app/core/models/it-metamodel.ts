import { ItMetamodelAttribute, ItMetamodelAttributeType } from './it-metamodel-attribute';
import { ItMetamodelRelation } from './it-metamodel-relation';
import { ItAsset } from './it-asset';


export enum  ItMetamodelStatus {
	DRAFT="DRAFT",
	ACTIV="ACTIVATED"
}

export class ItMetamodel extends ItAsset {
	
	classStatus: ItMetamodelStatus; 
	attributes: ItMetamodelAttribute[];
	relations: ItMetamodelRelation[];
	
	constructor(){
		super();
		this.classStatus = ItMetamodelStatus.DRAFT;
  		this.version = 0; 
  		this.attributes=[];
  		this.relations=[];
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.NUM, "id", "ID", true));
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.NUM, "version", "Version", true));
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.TXT, "name", "Name", true));
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.LIST, "type", "Type", true));
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.LIST, "status", "Status", true));
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.DATE, "validityStart", "Validity start date", true));
  		this.attributes.push(new ItMetamodelAttribute(ItMetamodelAttributeType.DATE, "validityEnd", "Validity end date", true));
	};
}