import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, AfterViewChecked, AfterViewInit, ElementRef} from '@angular/core';
import { ItMap } from '../core/models/it-map';
import { DataService } from '../core/services/data.service';
import { DataServiceDataType } from '../core/services/data-service-data-type';
import { GuiCtrlComponent } from '../gui-ctrl-component';


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

  error : boolean = false;
  errorMessage : string = null;
  prev: ItMap;
  isToBeSaved: boolean = false;
  graph: any; 

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
    if (data.status != 'success'){
      this.error = true;
      this.errorMessage = data.message;
    } else {
      var newObj: boolean = this.map.id != data.id;
      console.log('ApplicationFormComponent::SaveApplicationDataHandler: ' + (newObj ? 'CREATED' : 'UPDATED') + ' id=' + data.id);
      this.error = false;
      this.map.id = data.id;
      this.guiCtrl.ApplicationSaved(this.map, newObj);
      this.Clone();
    }
  }

  Clone(): void {
    this.isToBeSaved = false;
    this.prev = Object.assign({}, this.map);
  }


  ngAfterViewInit() {

    /*const graph = new mxGraph(this.graphContainerRef.nativeElement);

    try {
      const parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();

      const vertex1 = graph.insertVertex(parent, '1', 'Vertex 1', 0, 0, 200, 80);
      const vertex2 = graph.insertVertex(parent, '2', 'Vertex 2', 0, 0, 200, 80);

      graph.insertEdge(parent, '', '', vertex1, vertex2);
    } finally {
      graph.getModel().endUpdate();
      new mxHierarchicalLayout(graph).execute(graph.getDefaultParent());
    
    // viewChild is set after the view has been initialized
    //console.log('AfterViewInit');
    //this.redraw();

    // Program starts here. Creates a sample graph in the
    // DOM node with the specified ID. This function is invoked
    // from the onLoad event handler of the document (see below).
    // Overridden to define per-shape connection points
    
    */
   mxGraph.prototype.getAllConnectionConstraints = function(terminal , source) {
        if (terminal != null && terminal.shape != null) {
            if (terminal.shape.stencil != null) {
                if (terminal.shape.stencil != null) {
                    return terminal.shape.stencil.constraints;
                }
            } else if (terminal.shape.constraints != null) {
                return terminal.shape.constraints;
            }
        }

        return null;
    };

     // Defines the default constraints for all shapes
    mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
        new mxConnectionConstraint(new mxPoint(0.5, 0), true),
        new mxConnectionConstraint(new mxPoint(0.75, 0), true),
        new mxConnectionConstraint(new mxPoint(0, 0.25), true),
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(0, 0.75), true),
        new mxConnectionConstraint(new mxPoint(1, 0.25), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.75), true),
        new mxConnectionConstraint(new mxPoint(0.25, 1), true),
        new mxConnectionConstraint(new mxPoint(0.5, 1), true),
        new mxConnectionConstraint(new mxPoint(0.75, 1), true)
    ];
      // Edges have no connection points
    mxPolyline.prototype.constraints = null;

    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error('Browser is not supported!', 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(this.graphContainerRef.nativeElement);
            // Enables guides
            mxGraphHandler.prototype.guidesEnabled = true;

            // Alt disables guides
            mxGraphHandler.prototype.useGuidesForEvent = function(me) {
                return !mxEvent.isAltDown(me.getEvent());
            };

            // Defines the guides to be red (default)
            mxConstants.GUIDE_COLOR = 'rgb(227,205,90)';

            // Defines the guides to be 1 pixel (default)
            mxConstants.GUIDE_STROKEWIDTH = 1;

            // Enables snapping waypoints to terminals
            mxEdgeHandler.prototype.snapToTerminals = true;

            // Creates the graph inside the given container
            this.graph = new mxGraph(this.graphContainerRef.nativeElement);
            this.graph.setConnectable(true);
            
            this.graph.gridSize = 10;
            // Enables connect preview for the default edge style
            this.graph.connectionHandler.createEdgeState = function(me) {
              console.log('me '+me);
                var edge = this.graph.createEdge(null, null, null, null, null);
                return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
            };


            // Changes the default style for edges "in-place" and assigns
            // an alternate edge style which is applied in mxGraph.flip
            // when the user double clicks on the adjustment control point
            // of the edge. The ElbowConnector edge style switches to TopToBottom
            // if the horizontal style is true.

            var mainBackgound = 'rgb(24, 25, 21)';
            var mainFont = '#fee';
            var bgColor = "rgb(40,41,35)";
            var strColor = "rgb(255,192,0)";
            var ftColor = "rgb(227,205,90)";
            var style = this.graph.getStylesheet().getDefaultVertexStyle();


            style[mxConstants.STYLE_FILLCOLOR] = bgColor;
            style[mxConstants.STYLE_STROKECOLOR] = strColor;
            style[mxConstants.STYLE_FONTCOLOR] = ftColor;


            style = this.graph.getStylesheet().getDefaultEdgeStyle();
            //style[mxConstants.STYLE_ROUNDED] = true;
            style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
            //style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
            style[mxConstants.STYLE_FILLCOLOR] = "#0f0";
            style[mxConstants.STYLE_STROKECOLOR] = strColor;
            style[mxConstants.STYLE_STROKECOLOR] = "#0f0";
            style[mxConstants.STYLE_FONTCOLOR] = ftColor;
            style[mxConstants.STYLE_ENDARROW]= 'block';
          //EDGE_SELECTION_COLOR: '#00FF00',
            //EDGE_SELECTION_DASHED: true

            //graph.alternateEdgeStyle = 'elbow=vertical';
            // Specifies the default edge style
            this.graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
            // Enables rubberband selection
            new mxRubberband(this.graph);

            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            var parent = this.graph.getDefaultParent();

            // Adds cells to the model in a single step
            this.graph.getModel().beginUpdate();
            var v1;
            try {
                v1 = this.graph.insertVertex(parent, null, 'SAP', 20, 40, 80, 70);
                var v2 = this.graph.insertVertex(parent, null, 'Opale', 200, 140, 80, 40);
                var e1 = this.graph.insertEdge(parent, null, 'client', v1, v2, 'labelBackgroundColor='+bgColor+';');
                var v3 = this.graph.insertVertex(parent, null, 'Indigo', 20, 200, 80, 40);
                this.graph.insertEdge(parent, null, 'document', v1, v3,'labelBackgroundColor='+bgColor+';horizontal=0;');
                this.graph.insertEdge(parent, null, 'message', v2, v3,'labelBackgroundColor='+bgColor+';horizontal=0;');
            } finally {
                // Updates the display
                this.graph.getModel().endUpdate();
            }

            // Handles cursor keys
            var nudge = function(keyCode) {
                if (!this.graph.isSelectionEmpty()) {
                    var dx = 0;
                    var dy = 0;

                    if (keyCode == 37) {
                        dx = -1;
                    } else if (keyCode == 38) {
                        dy = -1;
                    } else if (keyCode == 39) {
                        dx = 1;
                    } else if (keyCode == 40) {
                        dy = 1;
                    }

                    this.graph.moveCells(this.graph.getSelectionCells(), dx, dy);
                }
            };

            // Transfer initial focus to graph container for keystroke handling
            this.graph.container.focus();

            // Handles keystroke events
            var keyHandler = new mxKeyHandler(this.graph);

            // Ignores enter keystroke. Remove this line if you want the
            // enter keystroke to stop editing
            // keyHandler.enter = function() {};
            keyHandler.bindKey(37, function() {
                nudge(37);
            });
            keyHandler.bindKey(38, function() {
                nudge(38);
            });
            keyHandler.bindKey(39, function() {
                nudge(39);
            });
            keyHandler.bindKey(40, function() {
                nudge(40);
            });

            // add buttons
            /*
            addButton = function (label, callback) {
                var btn = document.createElement('button');
                btn.textContent = label;
                console.log(btn.getAttribute('style'));
                btn.setAttribute('style', "background-color:" + mainBackgound + ';color:' + mainFont);
                btnContainer.appendChild(btn);
                btn.onclick = callback;
            }

            addButton("add Application", function() {
                    var v = graph.insertVertex(parent, null, 'Application', 200, 140, 80, 40);
                });

            addButton("add Decoration", function() {
                  
                    
                })
                */

        }
    
  }

  ngAfterViewChecked() {
    //console.log('ngAfterViewChecked');
    //console.log('app: ' + JSON.stringify(this.application));

    //console.log('prev: ' + JSON.stringify(this.prev));
    if (this.NotEqual(this.map , this.prev) || this.map.id == null) {
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

