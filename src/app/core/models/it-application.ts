import { ItAsset, ItAssetStatus } from './it-asset';
import { ItMessage } from './it-message';

export class ItApplication extends ItAsset {
	private outMessages: ItMessage[];
	constructor() {
		super();
		this.status=ItAssetStatus.PROJECT;
	}
	public addMessage(message: ItMessage): void {
		this.outMessages.concat(message);
	}
}


export class ItApplicationList  {
  applications: ItApplication[];
}