import { ItMap } from './it-map';
import { v1 as uuid } from 'uuid';

export enum ItAssetStatus {
  DRA = "PROJET",
  PRO = "PRODUCTION",
  ARC = "ARCHIVE"
}

export type ItAssetID = any;

export class ItAsset {
  protected className: string;
  protected id: ItAssetID;
  protected name: string;
  protected description: string;
  protected label: string;
  protected type: string;
  protected status: ItAssetStatus;
  protected version: number;
  protected validityStart: string;
  protected validityEnd: string;
  protected maps: ItMap[];
  protected mainMap: ItMap;
  protected children: ItAsset[];
  private modified: boolean =  false;

  constructor(id? : ItAssetID) {
    this.className = this.constructor.name;
    this.status = ItAssetStatus.DRA;
    this.id = (id != undefined ? id : uuid());
    this.version = 0;
    //console.log('ID => ', this.id);
  }

  SetFromJson(jsonData: Object): ItAsset {
    this.className = this.constructor.name;
    for (var prop in jsonData) {
      //console.log(prop+' => '+ jsonData[prop]);
      this[prop] = jsonData[prop];
    }
    //console.log("SetForJson", this);
    return this;
  }

  GetJsonData(): Object {
    let clone = JSON.parse(JSON.stringify(this));
    clone.delete('modified');
    return clone;
  }

  public GetId(): ItAssetID {
    return this.id;
  }

  public GetVersion(): number {
    return this.version;
  }
    
  public SetVersion(version: number): void {
    this.version = version;
  }

  public SetModified(isModified: boolean): void {
    this.modified = isModified;
  }

  public ItMustBeSaved(): boolean {
    return this.modified || this.version == 0;
  }

  public GetType(): string {
    return this.type;
  }

  public GetClassName(): string {
    return this.constructor.name;
  }

  public GetMaps(): ItMap[] {
    return this.maps;
  }

  public AddMap(map: ItMap, isMainMap: boolean = false): void {
    if (this.maps == undefined) this.maps = [];
    this.maps.concat(map);
    if (isMainMap) this.mainMap = map;
  }

  public GetMainMap(): ItMap {
    return this.mainMap;
  }

  /** for instance application module */
  public AddChildren(asset: ItAsset): void {
    if (this.children == undefined) this.children = [];
    this.children.concat(asset);
  }

  public GetName(): string {
    return this.name;
  }
  public GetDescription(): string {
    return this.description;
  }

  public SetName(name: string): void {
    this.name = name;
  }

  IsEqual(asset: ItAsset): boolean {
    return asset.id == this.id;
  }
}
