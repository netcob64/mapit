import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { ItApplication } from '../core/models/it-application';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
	selector: 'app-application-list',
	templateUrl: './application-list.component.html',
	styleUrls: ['./application-list.component.css']
})

export class ApplicationListComponent implements OnInit {
	@Input() guiCtrl: GuiCtrlComponent;
	//@ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
	constructor() {}

	ngOnInit() {}

	Delete(app: ItApplication, event:Event): void {		
		//event.stopPropagation();
		this.guiCtrl.DeleteApplication(app);		
	}

	Edit(app: ItApplication, event: Event): void {
		event.stopPropagation();
		this.guiCtrl.EditApplication(app);
	}
	AddApplicationMap(app: ItApplication, event: Event): void {
		//event.stopPropagation();
		this.guiCtrl.AddNewApplicationMap(app);
    }	
    AddSubApplication(app: ItApplication, event: Event): void {
		//event.stopPropagation();
		
    }	
	

	stopEventPropagation(event: Event) {
		event.stopPropagation();
    	//this.menu.openMenu();
  	}
}

    