import { ItAssetStatus } from './it-asset-status';

export class ItAsset {
  className:string;
  id: number;
  name: string;
  label: string;
  type: string;
  status: ItAssetStatus; 
  version: number;
  validityStart: string;
  validityEnd: string;

  constructor(){
    this._class=this.constructor.name;    
  }

   setFromJson(jsonData: Object) : ItAsset {
    this.className=this.constructor.name;  
     for (var prop in jsonData){

    console.log(prop+' => '+ jsonData[prop]);
       this[prop] = jsonData[prop];
     }
 
    console.log(this);
    return this;
   }

  public getClassName(): string {
  	return this.constructor.name;
  }
}

