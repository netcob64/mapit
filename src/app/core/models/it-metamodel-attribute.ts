export enum  ItMetamodelAttributeType {
		TXT="TXT",
		NUM="NUM",
		LIST="LIST",
		BOOL="BOOL",
		DATE="DATE",
		TIME="TIME"
}

export class ItMetamodelAttribute {
	id: number;
	classId: string;
	name: string;
	label: string;
	type: ItMetamodelAttributeType;
	values: string;
	isSystem: boolean;
	valSystem: boolean;
	constructor(type:ItMetamodelAttributeType, name:string, label:string, isSystem:boolean = false, valSystem:boolean = false, values:string = ""){
		this.type = type;
		this.name = name;
		this.label = label;
		this.values = values;
		this.isSystem = isSystem;
		this.valSystem = valSystem;
	};
}