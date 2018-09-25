import { ItAsset, ItAssetStatus } from './it-asset';
import { ItMessage } from './it-message';

export enum ItApplicationType {
	PRO="PROGICIEL",
	SPE="SPECIFIQUE",
	X="..."
}

export class ItApplication extends ItAsset {
	private outMessages: ItMessage[];
	constructor() {
		super();
		this.status=ItAssetStatus.DRA;

        //console.log('ItApplications.constructor ', this);
	}
	public addMessage(message: ItMessage): void {
		this.outMessages.concat(message);
	}
}


export class ItApplicationList  {
  applications: ItApplication[];
}