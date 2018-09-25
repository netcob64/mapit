export enum ItAssetStatus {
  DRA="PROJET",
  PRO="PRODUCTION",
  ARC="ARCHIVE"
}

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

  constructor() {
    this.className=this.constructor.name;    
    this.status=ItAssetStatus.DRA;
  }

   setFromJson(jsonData: Object) : ItAsset {
    this.className=this.constructor.name;  
     for (var prop in jsonData){

       //console.log(prop+' => '+ jsonData[prop]);
       this[prop] = jsonData[prop];
     }
 
    //console.log(this);
    return this;
   }

  public getClassName(): string {
  	return this.constructor.name;
  }
  public getID() : number {
    return this.id;
  }
}

