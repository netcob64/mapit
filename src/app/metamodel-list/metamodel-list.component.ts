import { Component, OnInit, Input } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { ItObjectClass } from '../core/models/it-object-class';

@Component({
  selector: 'app-metamodel-list',
  templateUrl: './metamodel-list.component.html',
  styleUrls: ['./metamodel-list.component.css']
})

export class MetamodelListComponent implements OnInit {
	@Input() guiCtrl: GuiCtrlComponent;

	constructor() {}

	ngOnInit() {}

	Delete(model : ItObjectClass, event:Event): void {		
		event.stopPropagation();
		this.guiCtrl.DeleteMetamodel(model);
	}

	Edit(model: ItObjectClass, event:Event): void {	
		event.stopPropagation();
		this.guiCtrl.EditMetamodel(model);
	}

	stopEventPropagation(event: Event) {
		event.stopPropagation();
    	//this.menu.openMenu();
  	}
}

    