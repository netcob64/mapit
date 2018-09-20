import { ItAsset } from './it-asset';
import { ItAssetStatus } from './it-asset-status';

export class ItApplication extends ItAsset {

  constructor() {
  	super();
  	this.status=ItAssetStatus.PROJECT;
  }
  toString():string {return this.name;}
}