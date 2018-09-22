import { Component, OnInit, Input } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { ItMetamodel } from '../core/models/it-metamodel';

@Component({
  selector: 'app-metamodel-list',
  templateUrl: './metamodel-list.component.html',
  styleUrls: ['./metamodel-list.component.css']
})

export class MetamodelListComponent implements OnInit {
	@Input() guiCtrl: GuiCtrlComponent;

	constructor() {}

	ngOnInit() {}

	Delete(model : ItMetamodel, event:Event): void {		
		event.stopPropagation();
		this.guiCtrl.DeleteMetamodel(model);
	}

	Edit(model: ItMetamodel, event:Event): void {	
		event.stopPropagation();
		this.guiCtrl.EditMetamodel(model);
	}

	stopEventPropagation(event: Event) {
		event.stopPropagation();
    	//this.menu.openMenu();
  	}
}

    