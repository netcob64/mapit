import { ItAssetStatus } from './it-asset-status';

export class ItAsset {
  id: number;
  name: string;
  label: string;
  type: string;
  status: ItAssetStatus; 
  version: number;
  validityStart: string;
  validityEnd: string;

  public getClassName(): string {
  	return this.constructor.name;
  }
}

