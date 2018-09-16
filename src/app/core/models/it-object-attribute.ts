import { ItObjectAttributeType } from './it-object-attribute-type';


export class ItObjectAttribute {
	id: number;
	classId: string;
	name: string;
	label: string;
	type: ItObjectAttributeType;
	values: string;
	isSystem: boolean;
	valSystem: boolean;
	constructor(type:ItObjectAttributeType, name:string, label:string, isSystem:boolean = false, valSystem:boolean = false, values:string = ""){
		this.type = type;
		this.name = name;
		this.label = label;
		this.values = values;
		this.isSystem = isSystem;
		this.valSystem = valSystem;
	};
}