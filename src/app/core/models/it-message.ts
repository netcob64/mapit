import { ItAsset, ItAssetStatus} from './it-asset';
import { ItData} from './it-data';

export enum ItMessageMedia {
  FILE="FILE",
  MESSAGE="MESSAGE",
  WS="WEB SERVICE"
}

export enum ItMessageFrequency {
  DAILY="DAILY",
  WEEKLY="WEEKLY",
  MONTHLY="MONTHLY",
  MESSAGE="MESSAGE"
} 

export enum ItMessageProtocol {
  FTP="FTP",
  HTTP="HTTP",
  TDX="TRADE EXPRESS"
}

export class ItMessage extends ItAsset {
	private source: ItAsset;
	private target: ItAsset;
	//private data: ItData;
	private data: string;
	private media: ItMessageMedia;
	private protocol: ItMessageProtocol;
	private frequency: ItMessageFrequency;

  	constructor() {
  		super();
  	}
  	setData(data: string): void {
  		this.name=data;
  		this.data=data;
  	}
  	setSource(asset:ItAsset) : void{
  		this.source=asset;
  	}
  	setTarget(asset:ItAsset) : void{
  		this.target=asset;
  	}
}

export class ItMessageList  {
  messages: ItMessage[];
}