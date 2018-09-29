import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { ItAsset } from '../core/models/it-asset';
import { ItMetamodel } from '../core/models/it-metamodel';

@Component({
  selector: 'app-metamodel-list',
  templateUrl: './metamodel-list.component.html',
  styleUrls: ['./metamodel-list.component.css']
})

export class MetamodelListComponent implements OnInit  {
	@Input() guiCtrl: GuiCtrlComponent;	

	constructor() {}

	ngOnInit() {
		console.log('MetamodelListComponent.ngOnInit() - load metamodels...');
		this.guiCtrl.LoadItAssets(ItMetamodel);		
	}
/*
	Assets(): Array<ItAsset> {
		return Array.from(this.guiCtrl.GetItAssets(IT_METAMODEL_CLASS_NAME));
	}*/

	Delete(model : ItMetamodel, event:Event): void {		
		//event.stopPropagation();
		this.guiCtrl.DeleteItAsset(model);
	}

	Edit(model: ItMetamodel, event:Event): void {	
		//event.stopPropagation();
		this.guiCtrl.EditItAsset(model);
	}

	stopEventPropagation(event: Event) {
		event.stopPropagation();
    	//this.menu.openMenu();
  	}
}

    