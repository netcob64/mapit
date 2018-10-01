import { Component, Inject, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewChecked, AfterViewInit, ElementRef } from '@angular/core';
import { ItMap, ItMapType } from '../core/models/it-map';
import { ItApplication } from '../core/models/it-application';
import { ItMessage } from '../core/models/it-message';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data.service.data.type';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { MxGraph } from '../core/mxgraph/mx.graph';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MapFormDialogComponent } from './map-form-dialog.component'
import { EnumToArrayPipe } from '../core/util'
import { inspect } from 'util';

export interface DialogData {
  name: string;
}

//declare var mxClient : any;

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.css']
})

export class MapFormComponent implements AfterViewInit {
  @ViewChild('graphContainer') graphContainerRef: ElementRef;
  @Input() guiCtrl: GuiCtrlComponent;
  @Input() map: ItMap;
  @Input() searchAppStr: string = 'app';
  ItMapType=ItMapType;
  error: boolean = false;
  errorMessage: string = null;
  prev: ItMap;
  isToBeSaved: boolean = false;
  graph: MxGraph;
  dialogResult: DialogData;
  appSelectionControl = new FormControl();
  filteredOptions: Observable < string[] > ;

  constructor(private dataService: DataService, private dialog: MatDialog) {
    this.dataService.SetDataType(DataServiceDataType.MAP);
    this.prev=new ItMap();
  }

  OpenDialog(cell: mxCell): void {
    // cell is current selected edge
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(MapFormDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {
          // Create new message
          
          this.isToBeSaved = true;
          const msg : ItMessage = new ItMessage();
          msg.SetData(data.description);
          msg.SetSource(cell.source.value.GetAsset()); 
          msg.SetTarget(cell.target.value.GetAsset()); 
          //--> Test if the message already exists, if yes reuse, if not create
        
          this.guiCtrl.RegisterMessage(msg);
         
          this.graph.BeginUpdate();
          //console.log('message label =>' + data.description);
          this.graph.SetValue(cell, this.graph.AssetToGraphObject(msg));
          this.graph.EndUpdate();
          //console.log(this.graph);
          
        } else {
          // no name provided for link -> remove created edge
          console.log('NO NAME FORM LINK');
          this.graph.RemoveSelection();
        }
      }
    );
  }

  GraphInfo(){
    console.log(this.graph.ViewXML());
    console.log(ItMapType);
  }

  ngOnInit() {
    this.prev.clone(this.map);

    this.filteredOptions = this.appSelectionControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

   console.log('ngOnInit:', this.map);
  }

  private _filter(value: string): string[] {
    //const availableApplications = this.guiCtrl.applications
    const availableApplications = this.guiCtrl.GetItAssets(this.guiCtrl.IT_APPLICATION_CLASS_NAME).map(app => app.name);
    const filterValue = value.toLowerCase();
    return availableApplications.filter(appName => appName.toLowerCase().includes(filterValue));
    //return this.availableApplications.filter(option => option.toLowerCase().includes(filterValue));
  }

  AddApplication(evt: Event) {
    console.log(this.appSelectionControl.value);
    //if(this.appSelectionControl.value!=undefined && this.guiCtrl.GetApplicationByName(this.appSelectionControl.value)!=undefined){
    if(this.appSelectionControl.value!=undefined && this.guiCtrl.GetAssetByName(this.guiCtrl.IT_APPLICATION_CLASS_NAME,this.appSelectionControl.value)!=undefined){
      this.isToBeSaved = true;
      this.graph.InsertVertex(this.guiCtrl.GetAssetByName(this.guiCtrl.IT_APPLICATION_CLASS_NAME,this.appSelectionControl.value), 10, 10, 50, 50); 
      //this.graph.insertVertex(this.guiCtrl.GetApplicationByName(this.appSelectionControl.value), 10, 10, 50, 50);
      this.appSelectionControl.setValue('');
    }
  }

  RemoveSelectionFromMap() {
    let cells = this.graph.RemoveSelection();
    console.log(cells);
    console.log(this.graph);
  }

  RemoveSelectionFromDataBase() {
     alert('MapFormComponent.RemoveSelectionFromDataBase() TODO');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGE: ' + inspect(changes.map));
    //Also be aware that you can pass options object to inspect (see link above)
    // inspect(myObject[, options: {showHidden, depth, colors, showProxy, ...moreOptions}])
  }

  Save(): void {
    this.map.setGraphData(this.graph.ViewXML());
    this.dataService.Save(this.map).subscribe(data => this.SaveDataHandler(data));
  }

  SaveDataHandler(data: any): void {
    if (data ==undefined)  {
      this.error = true;
      this.errorMessage = 'database error';
      this.guiCtrl.ShowMessage(this.errorMessage);
    } else if (data.status != 'success') {
      this.error = true;
      this.errorMessage = data.message;
      this.guiCtrl.ShowMessage(this.errorMessage);
    } else {
      var newObj: boolean = this.map.id != data.id;
      console.log('MapFormComponent::SaveDataHandler: ' + (newObj ? 'CREATED' : 'UPDATED') + ' id=' + data.id);
      this.error = false;
      this.map.id = data.id;
      this.guiCtrl.ItAssetSaved(this.map, this.prev);
      this.prev.clone(this.map);
    }
  }

  ngAfterViewInit() {
    const mapform: MapFormComponent = this;
    this.graph = new MxGraph(this.graphContainerRef.nativeElement, this.guiCtrl);
    console.log('ngAfterViewInit:', this.map);
   

    this.graph.RegisterAddCellHandler(function(sender, evt) {
      console.log('CELLS_ADDED:');
      console.log(evt);

      let cells = evt.getProperty('cells');
      if (cells != null && cells[0].isEdge()) {
        let source = evt.getProperty('source');
        let target = evt.getProperty('target');
        if (source != null) {
          console.log('source:' + source.value.name);
        }
        if (target != null) {
          console.log('target:' + target.value.name);
        }
        mapform.OpenDialog(cells[0]);
      }
    });

    this.graph.BeginUpdate();
    try {
      let c1 = this.graph.InsertVertex(this.map.getAsset(), 20, 40, 80, 70);
      /*
      let m = this.guiCtrl.GetApplicationByName('moSaic');
      let c2 = this.graph.insertVertex(m, 20, 40, 80, 70);
      this.graph.insertEdge(m, c1, c2, 20, 40, 80, 70);
      */
    } catch (error) {
      console.error(error);
    } finally {
      this.graph.EndUpdate();
    }
  }

  CheckToBeSaved() : boolean {
     if (this.NotEqual(this.map , this.prev) || this.map.id == null) {
      return true; 
    } else {
      return false; 
    }
  }

  NotEqual(o1, o2): boolean {
    var equal: boolean;
    equal = inspect(o1).localeCompare(inspect(o2)) == 0;
    return !equal;
  }
}
