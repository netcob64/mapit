import { ItAsset, ItAssetStatus } from './it-asset';

export class ItMap extends ItAsset {
	asset : ItAsset;
  
  constructor(asset : ItAsset) {
  	super();
  	this.status=ItAssetStatus.PROJECT;
  	this.asset=asset;
  }
  
  public getAsset() : ItAsset {
  	return this.asset;
  }
}