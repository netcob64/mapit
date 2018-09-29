import { ItAsset, ItAssetStatus } from './it-asset';

export enum ItMapType {
  ENV="ENV. DIAGRAM",
  MOD="MODULE DIAGRAM",
  X="TBD"
}

export class ItMap extends ItAsset {
	private assetID : number;
	private assetClass : string;
  private graphData : string;
  private asset : ItAsset;
  private linkAasset : ItAsset[];

  constructor(asset? : ItAsset) {
  	super();

    if (asset!=null){
    	this.asset=asset;
    	this.assetID=asset.getID();
    	this.assetClass=asset.getClassName();
      this.asset.addMap(this, true);
    }
    console.log('ItMap.constructor ', this);
  }
  public setAsset(asset:ItAsset) : void {
     this.asset=asset;
  }
  public getAsset() : ItAsset {
  	return this.asset;
  }

  public getAssetID() : number {
  	return this.assetID;
  }

  public getAssetClass() : string {
  	return this.assetClass;
  }

  public setGraphData(data: string) : void {
  	this.graphData = data;
  }
}