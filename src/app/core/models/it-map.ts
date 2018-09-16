import { ItAsset } from './it-asset';
import { ItAssetStatus } from './it-asset-status';

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