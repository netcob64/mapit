import { ItMap } from './it-map';

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
  maps: ItMap[];
  mainMap: ItMap;
  children: ItAsset[];

  constructor() {
    this.className=this.constructor.name;    
    this.status=ItAssetStatus.DRA;
  }

   setFromJson(jsonData: Object) : ItAsset {
    this.className=this.constructor.name;  
    for (var prop in jsonData) {
       //console.log(prop+' => '+ jsonData[prop]);
       this[prop] = jsonData[prop];
     }
    //console.log(this);
    return this;
   }

   getJsonData() : Object {
     return JSON.parse(JSON.stringify(this));
  } 

  public getId():number {
    return this.id;
  }
  public getClassName(): string {
  	return this.constructor.name;
  }
  public getID() : number {
    return this.id;
  }
  public getMaps() : ItMap[] {
    return this.maps;
  }
  public addMap(map: ItMap, isMainMap: boolean = false) : void {
     if (this.maps==undefined) this.maps=[];
    this.maps.concat(map);
    if (isMainMap) this.mainMap=map;
  }
  public getMainMap() : ItMap {
    return this.mainMap;
  }
  /** for instance application module */
  public addChildren(asset: ItAsset) : void {
    if (this.children==undefined) this.children=[];
    this.children.concat(asset);
  }
  public getName():string {
    return this.name;
  }
  public setName(name:string):void{
     this.name=name;
  }
  IsEqual(asset: ItAsset): boolean {
    return asset.id == this.id;
  }
}

