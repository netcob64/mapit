import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	@Input() guiCtrl: GuiCtrlComponent;
	//@ViewChild('msgBox') e : ElementRef;

	constructor() { }

	ngOnInit() {
	}
	/*
	GetScrollToBottomValue(): number {
		var sh = this.e.nativeElement.scrollHeight ;
		var h = this.e.nativeElement.getBoundingClientRect().height;
		var s : number = sh + 10;
		console.log('sh: '+sh+' h: '+h+' scroll: '+s);
		return s;
	}*/
}
