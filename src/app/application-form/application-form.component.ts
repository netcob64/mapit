import { Component, OnInit, Input } from '@angular/core';
import { ItAssetStatus } from '../core/models/it-asset';
import { ItApplication, ItApplicationType } from '../core/models/it-application';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data.service.data.type';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { inspect } from 'util';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent {

  @Input() guiCtrl: GuiCtrlComponent;
  @Input() application: ItApplication;

 
  ItApplicationTypeEnum=ItApplicationType;
  ItAssetStatusEnum=ItAssetStatus;

  error : boolean = false;
  errorMessage : string = null;
  prev: ItApplication;
 

  constructor(private dataService: DataService) { 
    this.dataService.SetDataType(DataServiceDataType.APPLICATION);
    this.prev=new ItApplication();
  }

  ngOnInit() {
    this.prev.clone(this.application);
  }

  CheckToBeSaved() : boolean {
     if (this.NotEqual(this.application , this.prev) || this.application.id == null) {
      return true; 
    } else {
      return false; 
    }
  }

  Save(): void {
    if (this.CheckToBeSaved()) {
    this.dataService.Save(this.application).subscribe(data => this.SaveDataHandler(data));
    }
  }

  SaveDataHandler(data: any): void {
    if (data==undefined){
      this.error = true;
      this.errorMessage = 'database error';
      this.guiCtrl.AddMessage(this.errorMessage);
    }
    else if (data.status != 'success'){
      this.error = true;
      this.errorMessage = data.message;
      this.guiCtrl.AddMessage(this.errorMessage);
    } else {
      var newObj: boolean = this.application.id != data.id;
      console.log('ApplicationFormComponent::SaveApplicationDataHandler: ' + (newObj ? 'CREATED' : 'UPDATED') + ' id=' + data.id);
      this.error = false;
      this.application.id = data.id;
      //this.guiCtrl.ApplicationSaved(this.application, newObj); 
      this.guiCtrl.ItAssetSaved(this.application  , this.prev);    
      this.prev.clone(this.application);
    }
  }

  NotEqual(o1, o2): boolean {
    var equal : boolean;
    equal = inspect(o1).localeCompare(inspect(o2)) == 0;
    return !equal;
  }
}
