import { ItAsset } from '../models/it-asset';


const edgeFtColor: string = "rgb(227,205,90)";
//const bgColor = "rgb(48,48,48)";
const bgColor = "rgb(66,66,66)";
const edgeBorderColor = "rgb(255,192,0)";
const vertexBorderColor = 'white';
const vertexFtColor = 'white';
const guideColor = '#c2185b';
const selectionColor = '#00FFFF';

export interface GraphObjectFactory {
  GetLabelFor(className: string, id: number) : string;
  GetAssetFromID(className: string, id: number) : ItAsset;
} 

// Clmass avoid to inset asset full object and avoid circular reference in mxgraph
export class GraphObject {
  private id : number;
  private className: string;
  private objFactory: GraphObjectFactory;

  constructor(objClass: string, objID: number, objFactory: GraphObjectFactory){
    this.id=objID;
    this.className=objClass;
    this.objFactory=objFactory;
  }

  GetLabel():string {
    return this.objFactory.GetLabelFor(this.className, this.id);
  }

  GetAsset():ItAsset {
    return this.objFactory.GetAssetFromID(this.className, this.id);
  }

  GetId() : number {
    return this.id;
  }

  GetClassName(): string {
    return this.className;
  }

  GetFactory(): GraphObjectFactory {
    return this.objFactory;
  }
}

export class MxGraph {

  private graph;
  private parent;
  private factory: GraphObjectFactory;

  public RegisterAddCellHandler(handler: Function): void {
    this.graph.addListener(mxEvent.CELLS_ADDED, handler);
  }
  public RegisterBeforeAddVertexHandler(handler: Function): void {
    this.graph.addListener(mxEvent.BEFORE_ADD_VERTEX, handler);
  }

  public BeginUpdate(): void {
    this.graph.getModel().beginUpdate();
  }

  public EndUpdate(): void {
    this.graph.getModel().endUpdate();
  }

  public InsertVertex(asset: ItAsset, x: number, y: number, w: number, h: number): any {
    //var node = (mxUtils.createXmlDocument()).createElement(asset.getClassName()+'-'+asset.name);
    //return this.graph.insertVertex(this.parent, null, {name: asset.name, asset: asset}, x, y, w, h);
    return this.graph.insertVertex(this.parent, null, this.AssetToGraphObject(asset), x, y, w, h);
  }

  public InsertEdge(message: ItAsset, sourceAsset: ItAsset, targetAsset:ItAsset, x: number, y: number, w: number, h: number): any {
    //var node = (mxUtils.createXmlDocument()).createElement(asset.getClassName()+'-'+asset.name);
    //return this.graph.insertVertex(this.parent, null, {name: asset.name, asset: asset}, x, y, w, h);
    return this.graph.insertEdge(this.parent, null, this.AssetToGraphObject(message), 
      this.AssetToGraphObject(sourceAsset, this.factory), 
      this.AssetToGraphObject(targetAsset, this.factory));
  }

  public RemoveSelection(): any {
    return this.graph.removeCells(this.graph.getSelectionCells(), true /* remove also connected edge*/ );
  }

  public ViewXML(): string {
    var encoder = new mxCodec();
    var node = encoder.encode(this.graph.getModel());
    return mxUtils.getPrettyXml(node);
  }

  public SetValue(cell, value) {   
    this.graph.model.setValue(cell, value);
   
    /*console.log('MxGrpah.setValue()');
    console.log(cell);
    console.log(value);*/
  }

  public AssetToGraphObject(asset: ItAsset, factory?: GraphObjectFactory) : GraphObject {
    return new GraphObject(asset.getClassName(), asset.getId(), (factory == undefined? this.factory : factory));
  }

  public GetAssetFromObject(obj: GraphObject) : ItAsset {
    return this.factory.GetAssetFromID(obj.GetClassName(), obj.GetId());
  }
  
  public constructor(container: Element, factory: GraphObjectFactory) {
    this.factory=factory;
    mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
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
      mxEvent.disableContextMenu(container);
      // Enables guides
      mxGraphHandler.prototype.guidesEnabled = true;

      // Alt disables guides
      mxGraphHandler.prototype.useGuidesForEvent = function(me) {
        return !mxEvent.isAltDown(me.getEvent());
      };
      mxGraphHandler.prototype.rotationEnabled = true;



      // Defines the guides to be 1 pixel (default)
      mxConstants.GUIDE_STROKEWIDTH = 1;
      mxConstants.GUIDE_COLOR = guideColor;

      // Enables snapping waypoints to terminals
      mxEdgeHandler.prototype.snapToTerminals = true;

      // Creates the graph inside the given container
      this.graph = new mxGraph(container);
      this.graph.setConnectable(true);

      this.graph.gridSize = 10;
      // Enables connect preview for the default edge style
      this.graph.connectionHandler.createEdgeState = function(me) {
        var edge = this.graph.createEdge(null, null, null, null, null);
        return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
      };

      // Changes the default style for edges "in-place" and assigns
      // an alternate edge style which is applied in mxGraph.flip
      // when the user double clicks on the adjustment control point
      // of the edge. The ElbowConnector edge style switches to TopToBottom
      // if the horizontal style is true.



      // APP BOX
      var style = this.graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_FILLCOLOR] = bgColor;
      style[mxConstants.STYLE_STROKECOLOR] = vertexBorderColor;
      style[mxConstants.STYLE_FONTCOLOR] = vertexFtColor;

      // LINK
      style = this.graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
      //style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
      style[mxConstants.STYLE_STROKECOLOR] = edgeBorderColor;
      style[mxConstants.STYLE_FONTCOLOR] = edgeFtColor;
      style[mxConstants.STYLE_ENDARROW] = 'block';
      style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = bgColor;

      //style[mxConstants.STYLE_LABEL_BORDERCOLOR] = '#0f0';

      // ghost of mxCell during its move
      mxConstants.OUTLINE_HIGHLIGHT_COLOR = "#000000";
      mxConstants.OUTLINE_HIGHLIGHT_STROKEWIDTH = 1;

      //??? no explanation about effect of those variables
      mxConstants.HIGHLIGHT_STROKEWIDTH = 1;
      mxConstants.HIGHLIGHT_COLOR = '#000';
      mxConstants.CONNECT_TARGET_COLOR = 'red';
      mxConstants.CONSTRAINT_HIGHLIGHT_SIZE = 10;
      // Selection color parameters
      mxConstants.EDGE_SELECTION_COLOR = selectionColor;
      mxConstants.EDGE_SELECTION_STROKEWIDTH = 1;
      mxConstants.EDGE_SELECTION_DASHED = 0;
      mxConstants.VERTEX_SELECTION_COLOR = selectionColor;
      mxConstants.VERTEX_SELECTION_STROKEWIDTH = 1;
      mxConstants.VERTEX_SELECTION_DASHED = 0;

      // Handle parameters
      mxConstants.HANDLE_SIZE = 4;
      mxConstants.HANDLE_FILLCOLOR = bgColor;
      mxConstants.HANDLE_STROKECOLOR = selectionColor;

      //graph.alternateEdgeStyle = 'elbow=vertical';
      // Specifies the default edge style
      this.graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';
      // Enables rubberband selection
      new mxRubberband(this.graph);

      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      this.parent = this.graph.getDefaultParent();

      var cellLabelChanged = this.graph.cellLabelChanged;
      this.graph.cellLabelChanged = function(cell, value, autoSize) {

        if (cell.value != null) {
          arguments[1] = cell.value;
          cell.value.name = value;
        }

        cellLabelChanged.apply(this, arguments);
      }

      this.graph.convertValueToString = function(cell) {
        console.log('MxGraph.convertValueToString() ==> cell.value =');
        console.log(cell.value);
        if (cell.value != null) {
          return cell.value.GetLabel();
        } else {
          return "no label";
        }
      };


      // Adds cells to the model in a single step
      /**
      this.graph.getModel().beginUpdate();
      var v1;
      try {
        v1 = this.graph.insertVertex(this.parent, null, 'CasqIT', 20, 40, 80, 70);
        var v2 = this.graph.insertVertex(this.parent, null, 'Opale', 200, 140, 80, 40);
        var e1 = this.graph.insertEdge(this.parent, null, 'client', v1, v2, 'labelBackgroundColor=' + bgColor + ';');
        var v3 = this.graph.insertVertex(this.parent, null, 'Indigo', 20, 200, 80, 40);
        this.graph.insertEdge(this.parent, null, 'document', v1, v3, 'labelBackgroundColor=' + bgColor + ';horizontal=0;');
        this.graph.insertEdge(this.parent, null, 'message', v2, v3, 'labelBackgroundColor=' + bgColor + ';horizontal=1;');
      } finally {
        // Updates the display
        this.graph.getModel().endUpdate();
      }*/
      let gr = this.graph;
      // Handles cursor keys
      var nudge = function(keyCode) {
        if (!gr.isSelectionEmpty()) {
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

          gr.moveCells(gr.getSelectionCells(), dx, dy);
        }
      };

      // Transfer initial focus to graph container for keystroke handling
      this.graph.container.focus();

      // Handles keystroke events
      var keyHandler = new mxKeyHandler(this.graph);

      // Ignores enter keystroke. Remove this line if you want the
      // enter keystroke to stop editing
      keyHandler.enter = function() {};
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

    }
  }
}
