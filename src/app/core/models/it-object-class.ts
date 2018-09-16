import { ItObjectAttribute } from './it-object-attribute';
import { ItObjectAttributeType } from './it-object-attribute-type';
import { ItObjectRelation } from './it-object-relation';
import { ItAsset } from './it-asset';
import { ItAssetStatus } from './it-asset-status';

export enum  ItObjectClassStatus {
	DRAFT="DRAFT",
	ACTIV="ACTIVATED"
}

export class ItObjectClass extends ItAsset {
	
	classStatus: ItObjectClassStatus; 
	attributes: ItObjectAttribute[];
	relations: ItObjectRelation[];
	
	constructor(){
		super();
		this.classStatus = ItObjectClassStatus.DRAFT;
  		this.version = 0; 
  		this.attributes=[];
  		this.relations=[];
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.NUM, "id", "ID", true));
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.NUM, "version", "Version", true));
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.TXT, "name", "Name", true));
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.LIST, "type", "Type", true));
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.LIST, "status", "Status", true));
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.DATE, "validityStart", "Validity start date", true));
  		this.attributes.push(new ItObjectAttribute(ItObjectAttributeType.DATE, "validityEnd", "Validity end date", true));
	};
}