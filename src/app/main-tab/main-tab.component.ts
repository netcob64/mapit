import { Component, Input, ViewChild } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { TabContentType } from '../core/models/tab-content-type';
import { EscapeHtmlPipe } from '../core/util';
import { MatTabsModule, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
	selector: 'app-main-tab',
	templateUrl: './main-tab.component.html',
	styleUrls: ['./main-tab.component.css']
})

export class MainTabComponent {
	TabContentType = TabContentType;
	@ViewChild('tabGroup') tabGroup : MatTabGroup;
	@Input() guiCtrl: GuiCtrlComponent;
	selectedTab: number;

	constructor() { }

	ngOnInit() {
	}

	tabChanged(tabChangeEvent: MatTabChangeEvent): void {
		let str :string ='MainTabComponent.tabChanged : tabChangeEvent => index => '+ tabChangeEvent.index+' / tabGroup.selectedIndex='+ this.tabGroup.selectedIndex;
		console.log(str);
	}

	SelectTab(index) {
		this.selectedTab=index;
	}
}
