import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { TabContentType } from '../core/models/tab-content-type';
import { MatTabsModule, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
	selector: 'app-main-tab',
	templateUrl: './main-tab.component.html',
	styleUrls: ['./main-tab.component.css'],
	encapsulation: ViewEncapsulation.None, // in order to override css (.mat-tab-body, .mat-tab-body-wrapper)
})

export class MainTabComponent {
	// important to be able to use in html 'as let option of (TabContentType|enumToArray)''
	TabContentType = TabContentType;
	@ViewChild('tabGroup') tabGroup : MatTabGroup;
	@Input() guiCtrl: GuiCtrlComponent;
	selectedTab: number;

	tabChanged(tabChangeEvent: MatTabChangeEvent): void {
		/*let str :string ='MainTabComponent.tabChanged : tabChangeEvent => index => '+ tabChangeEvent.index+' / tabGroup.selectedIndex='+ this.tabGroup.selectedIndex;
		console.log(str);*/
	}	
}
