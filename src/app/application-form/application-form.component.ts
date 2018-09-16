import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ItApplication } from '../core/models/it-application';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data-service-data-type';
import { GuiCtrlComponent } from '../gui-ctrl-component';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements AfterViewChecked, AfterViewInit {

  @Input() guiCtrl: GuiCtrlComponent;
  @Input() application: ItApplication;
  error : boolean = false;
  errorMessage : string = null;
  prev: ItApplication;
  isToBeSaved: boolean = false;

  constructor(private dataService: DataService) { 
    this.dataService.SetDataType(DataServiceDataType.APPLICATION);
  }

  ngOnInit() {
    this.Clone();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGE: ' + JSON.stringify(changes.application));
  }

  Save(): void {
    this.dataService.Save(this.application).subscribe(data => this.SaveDataHandler(data));
  }

  SaveDataHandler(data: any): void {
    if (data.status != 'success'){
      this.error = true;
      this.errorMessage = data.message;
    } else {
      var newObj: boolean = this.application.id != data.id;
      console.log('ApplicationFormComponent::SaveApplicationDataHandler: ' + (newObj ? 'CREATED' : 'UPDATED') + ' id=' + data.id);
      this.error = false;
      this.application.id = data.id;
      this.guiCtrl.ApplicationSaved(this.application, newObj);
      this.Clone();
    }
  }

  Clone(): void {
    this.isToBeSaved = false;
    this.prev = Object.assign({}, this.application);
  }
  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    //console.log('AfterViewInit');

  }

  ngAfterViewChecked() {
    //console.log('ngAfterViewChecked');
    //console.log('app: ' + JSON.stringify(this.application));

    //console.log('prev: ' + JSON.stringify(this.prev));
    if (this.NotEqual(this.application , this.prev) || this.application.id == null) {
      this.isToBeSaved = true; 
    } else {
      this.isToBeSaved = false; 
    }
  }
  NotEqual(o1, o2): boolean {
    var equal : boolean;
    equal = JSON.stringify(o1).localeCompare(JSON.stringify(o2)) == 0;
    return !equal;
  }
}
