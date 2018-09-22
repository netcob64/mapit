import { ItAsset, ItAssetStatus} from './it-asset';
export class ItData extends ItAsset {
	private parent: ItData;
	private description: string;

  	constructor() {
  		super();
  	}
}