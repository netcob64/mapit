import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewChecked, AfterViewInit, ElementRef } from '@angular/core';
import { ItMap } from '../core/models/it-map';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data.service.data.type';
import { GuiCtrlComponent } from '../gui-ctrl-component';
import { MxGraph } from '../core/mxgraph/mx.graph';


//declare var mxClient : any;

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.css']
})

export class MapFormComponent implements AfterViewChecked, AfterViewInit {
  @ViewChild('graphContainer') graphContainerRef: ElementRef;
  @Input() guiCtrl: GuiCtrlComponent;
  @Input() map: ItMap;

  error: boolean = false;
  errorMessage: string = null;
  prev: ItMap;
  isToBeSaved: boolean = false;
  graph: MxGraph;

  constructor(private dataService: DataService) {

    this.dataService.SetDataType(DataServiceDataType.MAP);

  }

  ngOnInit() {
    this.Clone();

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGE: ' + JSON.stringify(changes.map));
  }

  Save(): void {
    this.dataService.Save(this.map).subscribe(data => this.SaveDataHandler(data));
  }

  SaveDataHandler(data: any): void {
    if (data.status != 'success') {
      this.error = true;
      this.errorMessage = data.message;
    } else {
      var newObj: boolean = this.map.id != data.id;
      console.log('MapFormComponent::SaveDataHandler: ' + (newObj ? 'CREATED' : 'UPDATED') + ' id=' + data.id);
      this.error = false;
      this.map.id = data.id;
      this.guiCtrl.MapSaved(this.map, newObj);
      this.Clone();
    }
  }

  Clone(): void {
    this.isToBeSaved = false;
    this.prev = Object.assign({}, this.map);
  }


  ngAfterViewInit() {
    this.graph = new MxGraph(this.graphContainerRef.nativeElement);
    this.graph.registerAddCellHandler(function(sender, evt) {
      console.log('CELLS_ADDED:');
      console.log(evt);
      console.log(sender);
    });
    this.graph.beginUpdate();
    try {
      this.graph.insertVertex(this.map.getAsset(), 20, 40, 80, 70);
    } catch (error) {
      console.error(error);
    } finally {
      this.graph.endUpdate();
    }
  }

  ngAfterViewChecked() {
    //console.log('ngAfterViewChecked');
    //console.log('app: ' + JSON.stringify(this.application));

    //console.log('prev: ' + JSON.stringify(this.prev));
    if (this.NotEqual(this.map, this.prev) || this.map.id == null) {
      this.isToBeSaved = true;
    } else {
      this.isToBeSaved = false;
    }
  }
  NotEqual(o1, o2): boolean {
    var equal: boolean;
    equal = JSON.stringify(o1).localeCompare(JSON.stringify(o2)) == 0;
    return !equal;
  }

}
